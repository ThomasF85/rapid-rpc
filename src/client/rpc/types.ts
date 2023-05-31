import { SWRConfiguration, SWRResponse } from "swr";
import { SWRMutationConfiguration, SWRMutationResponse } from "swr/mutation";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type UseQuery<T extends (...args: any[]) => any> = {
  useQuery: (...args: Parameters<T>) => SWRResponse<Awaited<ReturnType<T>>>;
  useQueryOptions: (
    options: Omit<SWRConfiguration<Awaited<ReturnType<T>>>, "fetcher">,
    ...args: Parameters<T>
  ) => SWRResponse<Awaited<ReturnType<T>>>;
};

export type QueryType<T extends { [key: string]: (...args: any[]) => any }> = {
  [P in keyof T]: UseQuery<T[P]>;
};

type UseMutation<T extends (...args: any[]) => any> = {
  useMutation: (
    options?: Omit<
      SWRMutationConfiguration<Awaited<ReturnType<T>>, unknown>,
      "fetcher"
    >
  ) => Omit<SWRMutationResponse<Awaited<ReturnType<T>>>, "trigger"> & {
    mutate: (...args: Parameters<T>) => void;
  };
};

export type MutationType<T extends { [key: string]: (...args: any[]) => any }> =
  {
    [P in keyof T]: UseMutation<T[P]>;
  };

export type ClientApiType<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
> = QueryType<T["queries"]> & MutationType<T["mutations"]>;
