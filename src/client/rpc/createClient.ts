"use client";

import { ClientApiType } from "./types";
import { getFetcher, getPostFunction } from "./fetcher";
import { useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getBatchFetcher, getBatchPostFunction } from "./batchFetcher";

export interface ClientOptions {
  batching?: boolean;
}

const defaultOptions: ClientOptions = {
  batching: true,
};

export function createClient<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
>(path: string, options?: ClientOptions): ClientApiType<T> {
  const thisOptions: ClientOptions = { ...defaultOptions, ...(options || {}) };
  const basePath: string = `${path}${path.endsWith("/") ? "" : "/"}`;
  const fetcher = thisOptions.batching
    ? getBatchFetcher(basePath)
    : getFetcher(basePath);
  const postFunction = thisOptions.batching
    ? getBatchPostFunction(basePath)
    : getPostFunction(basePath);
  const handler = {
    get(target: any, prop: string) {
      // todo: check what to do about $$typeof and prototype
      if (prop === "$$typeof") {
        return undefined;
      }
      if (target.hasOwnProperty(prop)) {
        return target[prop];
      }
      target[prop] = {
        useQuery: (...args: any) => useSWR([prop, args], fetcher),
        useQueryOptions: (options: any, ...args: any) =>
          useSWR([prop, args], fetcher, options),
        useMutation: (options?: any) => {
          const mutationResult: any = useSWRMutation(
            prop,
            postFunction,
            options
          );

          mutationResult.mutate = useMemo(() => {
            return (...args: any[]) => mutationResult.trigger(args);
          }, [mutationResult.trigger]);

          return mutationResult;
        },
      };
      return target[prop];
    },
  };

  return new Proxy({}, handler) as ClientApiType<T>;
}
