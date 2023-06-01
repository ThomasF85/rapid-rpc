import { BatchInputArguments, RPCResponse } from "../../types";

interface RequestQueue {
  get: {
    procedureCall: [path: string, args: any[]];
    resolve: (value: unknown) => void;
  }[];
}

const requestQueue: RequestQueue = {
  get: [],
};

// TODO add fetcher for post requests
async function sendGetRequest(basePath: string) {
  const requests = requestQueue.get;
  requestQueue.get = [];
  try {
    const inputs: BatchInputArguments = {};
    requests
      .map((req) => req.procedureCall[1])
      .forEach((args: any[], index: number) => {
        inputs[index] = args;
      });
    const url = `${basePath}${requests
      .map((req) => req.procedureCall[0])
      .join(",")}?batch=1&input=${encodeURIComponent(JSON.stringify(inputs))}`;
    const response = await fetch(url);

    if (!response.ok) {
      // TODO: reject / throw on all requests
    }

    const result: RPCResponse[] = await response.json();

    result.forEach((response, index) => {
      // TODO: reject / throw on failing requests
      requests[index].resolve(response.result!.data);
    });
  } catch (error) {
    // TODO: reject / throw on all requests
  }
}

export const getBatchFetcher = (basePath: string) => {
  return async (procedureCall: [path: string, args: any[]]): Promise<any> => {
    let resolve: null | ((value: unknown) => void) = null;
    const promise = new Promise((promiseResolve) => (resolve = promiseResolve));
    if (requestQueue.get.length === 0) {
      requestQueue.get = [{ procedureCall, resolve: resolve! }];
      setTimeout(() => sendGetRequest(basePath));
    } else {
      requestQueue.get = [
        ...requestQueue.get,
        { procedureCall, resolve: resolve! },
      ];
    }
    return promise;
  };
};
