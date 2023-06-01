import { NextRequest, NextResponse } from "next/server";
import { Connector } from "./types";

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
      const method = params.params.method;
      for (const api of apis) {
        if (api[0].queries[method]) {
          return api[1].GET(request, params);
        }
      }
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    },
    POST: async (
      request: NextRequest,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      const method = params.params.method;
      for (const api of apis) {
        if (api[0].mutations[method]) {
          return api[1].POST(request, params);
        }
      }
      return NextResponse.json(
        { message: "Mutation not found" },
        { status: 404 }
      );
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
