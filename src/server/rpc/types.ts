import { NextRequest } from "next/server";

export interface Connector {
  GET: (
    request: NextRequest,
    params: {
      params: { method: string };
    }
  ) => Promise<Response>;
  POST: (
    request: NextRequest,
    params: {
      params: { method: string };
    }
  ) => Promise<Response>;
}

export interface ApiOptions<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
> {
  queries: Q;
  mutations: M;
}

export interface MiddlewareOptions<C> {
  ctx: C;
  methodType: "query" | "mutation";
  method: string;
  args: any[];
}

export interface ProtectedApiOptions<
  C,
  Q extends { [key: string]: (ctx: C, ...args: any[]) => any },
  M extends { [key: string]: (ctx: C, ...args: any[]) => any }
> extends ApiOptions<Q, M> {
  getContext: () => Promise<C> | C;
  middleware?: (options: MiddlewareOptions<C>, next: () => any) => any;
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type OmitFirstArguments<
  T extends { [key: string]: (ctx: any, ...args: any[]) => any }
> = {
  [P in keyof T]: OmitFirstArg<T[P]>;
};
