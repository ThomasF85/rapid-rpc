import { NextRequest, NextResponse } from "next/server";
import { Connector, MiddlewareOptions } from "./types";
import { BatchInputArguments, RPCResponse } from "../../types";

function decodeArguments(serialized: string | null): any[] {
  if (serialized === null) {
    return [];
  }
  return JSON.parse(decodeURIComponent(serialized));
}

// TODO: refactor to make queries and mutations internally know about their context and middleware => has to work with combine
export function getConnector<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(
  queries: Q,
  mutations: M,
  getContext?: () => any,
  middleware?: (options: MiddlewareOptions<any>, next: () => any) => any
): Connector {
  return {
    GET: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      if (request.nextUrl.searchParams.get("batch")) {
        const response: RPCResponse[] = [];
        const methods: string[] = params.params.method.split(",");
        const batchArgs: BatchInputArguments = JSON.parse(
          decodeURIComponent(request.nextUrl.searchParams.get("input")!)
        );
        for (let index = 0; index < methods.length; index++) {
          const method = methods[index];
          const query = queries[method];
          if (!query) {
            response.push({
              error: { json: { message: `query ${method} not found` } },
            });
          }
          const args: any[] = batchArgs[index];
          const data: any = await executeQuery(
            query,
            method,
            getContext,
            middleware,
            args
          );
          response.push({
            result: { data },
          });
        }
        return NextResponse.json(response);
      } else {
        const query = queries[params.params.method];
        if (!query) {
          return NextResponse.json(
            { message: "Query not found" },
            { status: 404 }
          );
        }
        const args: any[] = decodeArguments(
          request.nextUrl.searchParams.get("input")
        );
        if (!getContext) {
          return NextResponse.json(await query(...args));
        }
        const ctx = await getContext();
        const result = middleware
          ? await middleware(
              { ctx, method: params.params.method, methodType: "query", args },
              async () => await query(ctx, ...args)
            )
          : await query(ctx, ...args);
        return NextResponse.json(result);
      }
    },
    POST: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      const mutation = mutations[params.params.method];
      if (!mutation) {
        return NextResponse.json(
          { message: "Mutation not found" },
          { status: 404 }
        );
      }
      const args: any[] = await request.json();
      if (!getContext) {
        return NextResponse.json(await mutation(...args));
      }
      const ctx = await getContext();
      const result = middleware
        ? await middleware(
            { ctx, method: params.params.method, methodType: "mutation", args },
            async () => await mutation(ctx, ...args)
          )
        : await mutation(ctx, ...args);
      return NextResponse.json(result);
    },
  };
}

async function executeQuery(query, method, getContext, middleware, args) {
  if (!getContext) {
    return await query(...args);
  }
  const ctx = await getContext();
  return middleware
    ? await middleware(
        { ctx, method, methodType: "query", args },
        async () => await query(ctx, ...args)
      )
    : await query(ctx, ...args);
}
