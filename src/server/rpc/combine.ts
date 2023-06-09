import { NextRequest, NextResponse } from "next/server";
import { Connector, InternalConnector } from "./types";
import { BatchInputArguments } from "../../types";
import { RPCResponse } from "../../types";
import { getStatus } from "./connector";
import { errorResponse } from "./rpcResponse";

type QandMBaseType = { [key: string]: (...args: any[]) => any };
type ServerApiType<Q extends QandMBaseType, M extends QandMBaseType> = Q &
  M & { queries: Q; mutations: M };

// @ts-ignore
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

export function combine(...apis: [ServerApiType<any, any>, Connector & InternalConnector][]) {
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
        return batchResult(methods, apis.map(api => api[1]), args, true);
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
        return batchResult(methods, apis.map(api => api[1]), args, false);
      }
    },
  };
  return [serverApi, connector];
}

function verifyUniqueMethodNames(
  apis: [ServerApiType<any, any>, Connector & InternalConnector][]
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
  methods: string[],
  connectors: (Connector & InternalConnector)[],
  args: BatchInputArguments,
  get: boolean
): Promise<Response> {
  const rpcResponses: (Promise<RPCResponse> | RPCResponse)[] = [];
  const contexts: Map<Connector & InternalConnector, any> = new Map();

  async function getContext(connector: Connector & InternalConnector): Promise<any> {
    if (!contexts.has(connector)) {
      contexts.set(connector, await connector._getContext!())
    }
    return contexts.get(connector);
  }

  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    const connector: (Connector & InternalConnector) | undefined = connectors.find(api => api[get ? "_get" : "_post"].has(method));
    if (connector) {
      const allArgs = connector._getContext ? [await getContext(connector), ...args[i]] : args[i];
      rpcResponses.push(connector[get ? "_get" : "_post"].get(method)!(...allArgs))
    } else {
      rpcResponses.push(errorResponse.NOT_FOUND(`method ${method} not found`))
    }
  }
  const response: RPCResponse[] = await Promise.all(rpcResponses);

  const status = getStatus(response);
  return status === 200
    ? NextResponse.json(response)
    : NextResponse.json(response, { status });
}
