import { BatchInputArguments, RPCResponse } from "../../types";

interface RequestQueue {
  get: {
    procedureCall: [path: string, args: any[]];
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
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
      const error: Error = new Error(
        "An error occurred while fetching the data."
      );
      for (const request of requests) {
        request.reject(error);
      }
    } else {
      const result: RPCResponse[] = await response.json();

      result.forEach((response, index) => {
        if (response.result) {
          requests[index].resolve(response.result!.data);
        } else {
          requests[index].reject(new Error(response.error!.json.message));
        }
      });
    }
  } catch (error) {
    for (const request of requests) {
      request.reject(error);
    }
  }
}

export const getBatchFetcher = (basePath: string) => {
  return async (procedureCall: [path: string, args: any[]]): Promise<any> => {
    let resolve: null | ((value: unknown) => void) = null;
    let reject: null | ((reason?: any) => void) = null;
    const promise = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve;
      reject = promiseReject;
    });
    if (requestQueue.get.length === 0) {
      requestQueue.get = [
        { procedureCall, resolve: resolve!, reject: reject! },
      ];
      setTimeout(() => sendGetRequest(basePath));
    } else {
      requestQueue.get = [
        ...requestQueue.get,
        { procedureCall, resolve: resolve!, reject: reject! },
      ];
    }
    return promise;
  };
};
