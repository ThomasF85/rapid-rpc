import { NextRequest, NextResponse } from "next/server";
import { Connector } from "./types";
import { BatchInputArguments } from "../../types";
import { RPCResponse } from "../../types";
import { getStatus } from "./connector";
import { errorResponse } from "./rpcResponse";

type QandMBaseType = { [key: string]: (...args: any[]) => any };
type ServerApiType<Q extends QandMBaseType, M extends QandMBaseType> = Q &
  M & { queries: Q; mutations: M };

export function combine<
  Q1 extends QandMBaseType,
  M1 extends QandMBaseType,
  Q2 extends QandMBaseType,
  M2 extends QandMBaseType
>(
  api1: [serverApi: ServerApiType<Q1, M1>, connector: Connector],
  api2: [serverApi: ServerApiType<Q2, M2>, connector: Connector]
): [serverApi: ServerApiType<Q1 & Q2, M1 & M2>, connector: Connector];

export function combine<
  Q1 extends QandMBaseType,
  M1 extends QandMBaseType,
  Q2 extends QandMBaseType,
  M2 extends QandMBaseType,
  Q3 extends QandMBaseType,
  M3 extends QandMBaseType
>(
  api1: [serverApi: ServerApiType<Q1, M1>, connector: Connector],
  api2: [serverApi: ServerApiType<Q2, M2>, connector: Connector],
  api3: [serverApi: ServerApiType<Q3, M3>, connector: Connector]
): [serverApi: ServerApiType<Q1 & Q2 & Q3, M1 & M2 & M3>, connector: Connector];

export function combine<
  Q1 extends QandMBaseType,
  M1 extends QandMBaseType,
  Q2 extends QandMBaseType,
  M2 extends QandMBaseType,
  Q3 extends QandMBaseType,
  M3 extends QandMBaseType,
  Q4 extends QandMBaseType,
  M4 extends QandMBaseType
>(
  api1: [serverApi: ServerApiType<Q1, M1>, connector: Connector],
  api2: [serverApi: ServerApiType<Q2, M2>, connector: Connector],
  api3: [serverApi: ServerApiType<Q3, M3>, connector: Connector],
  api4: [serverApi: ServerApiType<Q4, M4>, connector: Connector]
): [
  serverApi: ServerApiType<Q1 & Q2 & Q3 & Q4, M1 & M2 & M3 & M4>,
  connector: Connector
];

export function combine<
  Q1 extends QandMBaseType,
  M1 extends QandMBaseType,
  Q2 extends QandMBaseType,
  M2 extends QandMBaseType,
  Q3 extends QandMBaseType,
  M3 extends QandMBaseType,
  Q4 extends QandMBaseType,
  M4 extends QandMBaseType,
  Q5 extends QandMBaseType,
  M5 extends QandMBaseType
>(
  api1: [serverApi: ServerApiType<Q1, M1>, connector: Connector],
  api2: [serverApi: ServerApiType<Q2, M2>, connector: Connector],
  api3: [serverApi: ServerApiType<Q3, M3>, connector: Connector],
  api4: [serverApi: ServerApiType<Q4, M4>, connector: Connector],
  api5: [serverApi: ServerApiType<Q5, M5>, connector: Connector]
): [
  serverApi: ServerApiType<Q1 & Q2 & Q3 & Q4 & Q5, M1 & M2 & M3 & M4 & M5>,
  connector: Connector
];

// TODO: refactor to work with batching
export function combine(...apis: any[]) {
  verifyUniqueMethodNames(apis);
  let serverApi = { queries: {}, mutations: {} };
  for (const api of apis) {
    const sApi = api[0];
    serverApi = {
      ...serverApi,
      ...sApi.queries,
      ...sApi.mutations,
      queries: { ...serverApi.queries, ...sApi.queries },
      mutations: { ...serverApi.mutations, ...sApi.mutations },
    };
  }
  const connector: Connector = {
    GET: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      if (!request.nextUrl.searchParams.get("batch")) {
        const method = params.params.method;
        for (const api of apis) {
          if (api[0].queries[method]) {
            return api[1].GET(request, params);
          }
        }
        const response: RPCResponse = errorResponse.NOT_FOUND(
          `query ${method} not found`
        );
        return NextResponse.json(response, {
          status: response.error!.json.data.httpStatus,
        });
      } else {
        const input = request.nextUrl.searchParams.get("input");
        const args: BatchInputArguments = JSON.parse(
          decodeURIComponent(input!)
        );
        const methods: string[] = params.params.method.split(",");
        return batchResult(request, methods, apis, args, true);
      }
    },
    POST: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      if (!request.nextUrl.searchParams.get("batch")) {
        const method = params.params.method;
        for (const api of apis) {
          if (api[0].mutations[method]) {
            return api[1].POST(request, params);
          }
        }
        const response: RPCResponse = errorResponse.NOT_FOUND(
          `query ${method} not found`
        );
        return NextResponse.json(response, {
          status: response.error!.json.data.httpStatus,
        });
      } else {
        const args: BatchInputArguments = await request.json();
        const methods: string[] = params.params.method.split(",");
        return batchResult(request, methods, apis, args, false);
      }
    },
  };
  return [serverApi, connector];
}

function verifyUniqueMethodNames(
  apis: [
    {
      queries: { [key: string]: (...args: any[]) => any };
      mutations: { [key: string]: (...args: any[]) => any };
    },
    any
  ][]
) {
  const names: Set<string> = new Set();
  for (const api of apis) {
    for (const method in api[0].queries) {
      if (names.has(method)) {
        throw new Error(
          `Method names for queries and mutations must be unique. Ambiguous method name: ${method}`
        );
      }
      names.add(method);
    }
    for (const method in api[0].mutations) {
      if (names.has(method)) {
        throw new Error(
          `Method names for queries and mutations must be unique. Ambiguous method name: ${method}`
        );
      }
      names.add(method);
    }
  }
}

async function batchResult(
  request: Request,
  methods: string[],
  apis: any[],
  args: BatchInputArguments,
  get: boolean
): Promise<Response> {
  const allocations: {
    apiIndex: number;
    methodIndex: number[];
    args: BatchInputArguments;
    method: string;
  }[] = [];
  const unknownMethodCalls: { index:number, method: string }[] = [];
  for (let methodIndex = 0; methodIndex < methods.length; methodIndex++) {
    let found: boolean = false;
    for (let apiIndex = 0; apiIndex < apis.length; apiIndex++) {
      if (
        apis[apiIndex][0][get ? "queries" : "mutations"][methods[methodIndex]]
      ) {
        found = true;
        const allocation = allocations.find((a) => a.apiIndex === apiIndex);
        if (allocation) {
          allocation.methodIndex.push(methodIndex);
          allocation.args[allocation.methodIndex.length - 1] =
            args[methodIndex];
          allocation.method += "," + methods[methodIndex];
        } else {
          allocations.push({
            apiIndex,
            methodIndex: [methodIndex],
            args: { 0: args[methodIndex] },
            method: methods[methodIndex],
          });
        }
      }
    }
    // TODO: refactor
    if (!found) {
      unknownMethodCalls.push({ index: methodIndex, method: methods[methodIndex] })
    }
  }
  const responses: { [key: number]: RPCResponse } = {};
  for (const allocation of allocations) {
    const response = await apis[allocation.apiIndex][1][get ? "GET" : "POST"](
      request,
      {
        params: {
          method: allocation.method,
        },
      },
      allocation.args
    );
    const allocationResponses: RPCResponse[] = await response.json();
    for (let i = 0; i < allocationResponses.length; i++) {
      responses[allocation.methodIndex[i]] = allocationResponses[i];
    }
  }
  for (const unknown of unknownMethodCalls) {
    responses[unknown.index] = errorResponse.NOT_FOUND(`method ${unknown.method} not found`)
  }
  const rpcResponses: RPCResponse[] = [];
  for (let i = 0; i < methods.length; i++) {
    rpcResponses.push(responses[i]);
  }
  const status = getStatus(rpcResponses);
  return status === 200
    ? NextResponse.json(rpcResponses)
    : NextResponse.json(rpcResponses, { status });
}
