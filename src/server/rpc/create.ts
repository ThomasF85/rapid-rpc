import {
  ApiOptions,
  Connector,
  OmitFirstArguments,
  ProtectedApiOptions,
} from "./types";
import { getConnector } from "./connector";

function verifyUniqueMethodNames(
  queries: { [key: string]: (...args: any[]) => any },
  mutations: { [key: string]: (...args: any[]) => any }
) {
  const names: Set<string> = new Set();
  for (const method in queries) {
    if (names.has(method)) {
      throw new Error(
        `Method names for queries and mutations must be unique. Ambiguous method name: ${method}`
      );
    }
    names.add(method);
  }
  for (const method in mutations) {
    if (names.has(method)) {
      throw new Error(
        `Method names for queries and mutations must be unique. Ambiguous method name: ${method}`
      );
    }
    names.add(method);
  }
}

export function create<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(
  options: ApiOptions<Q, M>
): [Q & M & { queries: Q; mutations: M }, Connector] {
  const { queries, mutations } = options;
  verifyUniqueMethodNames(queries, mutations);
  const serverApi = {
    ...queries,
    ...mutations,
    queries: { ...queries },
    mutations: { ...mutations },
  };
  const connector: Connector = getConnector<Q, M>(queries, mutations);

  return [serverApi, connector];
}

export function createProtected<
  C,
  Q extends { [key: string]: (ctx: C, ...args: any[]) => any },
  M extends { [key: string]: (ctx: C, ...args: any[]) => any }
>(
  options: ProtectedApiOptions<C, Q, M>
): [
  OmitFirstArguments<Q> &
    OmitFirstArguments<M> & {
      queries: OmitFirstArguments<Q>;
      mutations: OmitFirstArguments<M>;
    },
  Connector
] {
  const { queries, mutations, getContext, middleware } = options;
  verifyUniqueMethodNames(queries, mutations);
  const queriesWithContext: any = {};
  const mutationsWithContext: any = {};
  if (middleware) {
    for (const query in queries) {
      queriesWithContext[query] = async (...args: any[]) => {
        const ctx = await getContext();
        await middleware(
          { ctx, args, method: query, methodType: "query" },
          () => queries[query](ctx, ...args)
        );
      };
    }
    for (const mutation in mutations) {
      mutationsWithContext[mutation] = async (...args: any[]) => {
        const ctx = await getContext();
        await middleware(
          { ctx, args, method: mutation, methodType: "mutation" },
          () => mutations[mutation](ctx, ...args)
        );
      };
    }
  } else {
    for (const query in queries) {
      queriesWithContext[query] = async (...args: any[]) =>
        await queries[query](await getContext(), ...args);
    }
    for (const mutation in mutations) {
      mutationsWithContext[mutation] = async (...args: any[]) =>
        await mutations[mutation](await getContext(), ...args);
    }
  }

  const serverApi = {
    ...queriesWithContext,
    ...mutationsWithContext,
    queries: { ...queriesWithContext },
    mutations: { ...mutationsWithContext },
  };
  const connector: Connector = getConnector<Q, M>(
    queries,
    mutations,
    getContext,
    middleware
  );

  return [
    serverApi as OmitFirstArguments<Q> &
      OmitFirstArguments<M> & {
        queries: OmitFirstArguments<Q>;
        mutations: OmitFirstArguments<M>;
      },
    connector,
  ];
}
