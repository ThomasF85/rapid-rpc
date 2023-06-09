"use client";

import { ClientApiType } from "./types";
import { getFetcher, getPostFunction } from "./fetcher";
import { MutableRefObject, useMemo, useRef } from "react";
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
          const ownTrigger:  MutableRefObject<(() => any) | null> = useRef(null);

          mutationResult.trigger = useMemo(() => {
            if (ownTrigger.current !== mutationResult.trigger) {
              const swrTrigger = mutationResult.trigger;
              const trigger = (...args: any[]) => swrTrigger(args);
              ownTrigger.current = trigger;
              return trigger
            }
            return mutationResult.trigger;
          }, [mutationResult.trigger]);

          return mutationResult;
        },
      };
      return target[prop];
    },
  };

  return new Proxy({}, handler) as ClientApiType<T>;
}
