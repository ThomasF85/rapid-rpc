import { NextRequest, NextResponse } from "next/server";
import { Connector, InternalConnector, MiddlewareOptions } from "./types";
import { BatchInputArguments, RPCResponse } from "../../types";
import { errorResponse, successResponse } from "./rpcResponse";

export function getConnector<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(
  queries: Q,
  mutations: M,
  getContext?: () => any,
  middleware?: (options: MiddlewareOptions<any>, next: () => any) => any
): Connector {
  const internalConnector: InternalConnector = {
    _getContext: getContext,
    _get: createProcedureHandler(!!getContext, queries, middleware),
    _post: createProcedureHandler(!!getContext, mutations, middleware),
  };
  const connector: Connector = {
    GET: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      const input = request.nextUrl.searchParams.get("input");
      const args: any[] | BatchInputArguments = input
        ? JSON.parse(decodeURIComponent(input))
        : [];
      return await createResponse(
        "query",
        params.params.method,
        !!request.nextUrl.searchParams.get("batch"),
        args,
        internalConnector._get,
        getContext
      );
    },
    POST: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      const args: any[] | BatchInputArguments = await request.json();
      return await createResponse(
        "mutation",
        params.params.method,
        !!request.nextUrl.searchParams.get("batch"),
        args,
        internalConnector._post,
        getContext
      );
    },
  };
  return { ...connector, ...internalConnector };
}

function createProcedureHandler(
  hasContext: boolean,
  procedures: { [key: string]: (...args: any[]) => any },
  middleware?: (options: MiddlewareOptions<any>, next: () => any) => any
): Map<string, (...args: any[]) => Promise<RPCResponse>> {
  const handler: Map<string, (...args: any[]) => Promise<RPCResponse>> =
    new Map();
  for (const procedure in procedures) {
    handler.set(procedure, async (...allArgs: any[]) => {
      try {
        if (!hasContext) {
          return successResponse(await procedures[procedure](...allArgs));
        }
        const [ctx, ...args] = allArgs;
        const data = middleware
          ? await middleware(
              { ctx, method: procedure, methodType: "query", args },
              async () => await procedures[procedure](ctx, ...args)
            )
          : await procedures[procedure](ctx, ...args);
        return successResponse(data);
      } catch (error: any) {
        return errorResponse.INTERNAL_SERVER_ERROR(error.message);
      }
    });
  }
  return handler;
}

async function createResponse(
  type: "query" | "mutation",
  method: string,
  batch: boolean,
  args: any[] | BatchInputArguments,
  methodMap: Map<string, (...args: any[]) => Promise<RPCResponse>>,
  getContext?: () => any
) {
  if (batch) {
    const response: RPCResponse[] = [];
    const methods: string[] = method.split(",");
    const batchArgs: BatchInputArguments = args;
    const context = getContext ? await getContext() : null;
    for (let index = 0; index < methods.length; index++) {
      const methodName = methods[index];
      const procedure = methodMap.get(methodName);
      if (!procedure) {
        response.push(
          errorResponse.NOT_FOUND(`${type} ${methodName} not found`)
        );
      }
      const args: any[] = batchArgs[index];
      const allArgs = getContext ? [context, ...args] : args;
      response.push(await procedure!(...allArgs));
    }
    const status: number = getStatus(response);
    return status === 200
      ? NextResponse.json(response)
      : NextResponse.json(response, { status });
  } else {
    const procedure = methodMap.get(method);
    if (!procedure) {
      const response: RPCResponse = errorResponse.NOT_FOUND(
        `${type} ${method} not found`
      );
      return NextResponse.json(response, {
        status: response.error!.json.data.httpStatus,
      });
    }
    const allArgs = getContext
      ? [await getContext(), ...(args as any[])]
      : (args as any[]);
    const response = await procedure(...allArgs);
    return response.error
      ? NextResponse.json(response, {
          status: response.error!.json.data.httpStatus,
        })
      : NextResponse.json(response);
  }
}

function getStatus(responses: RPCResponse[]): number {
  const status: number = responses[0].result
    ? 200
    : responses[0].error!.json.data.httpStatus;
  for (const response of responses) {
    const currentStatus: number = response.result
      ? 200
      : response.error!.json.data.httpStatus;
    if (status !== currentStatus) {
      return 207;
    }
  }
  return status;
}
