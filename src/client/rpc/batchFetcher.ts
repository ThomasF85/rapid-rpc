import { BatchInputArguments, RPCResponse } from "../../types";

type RequestQueue = {
  procedureCall: [path: string, args: any[]];
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[];

const requestQueue: { get: RequestQueue; post: RequestQueue } = {
  get: [],
  post: [],
};

async function sendGetRequest(basePath: string) {
  const requests = requestQueue.get;
  requestQueue.get = [];
  await sendRequest(basePath, getRequest, requests);
}

async function getRequest(
  basePath: string,
  requests: RequestQueue,
  inputs: BatchInputArguments
) {
  const url = `${basePath}${requests
    .map((req) => req.procedureCall[0])
    .join(",")}?batch=1&input=${encodeURIComponent(JSON.stringify(inputs))}`;
  return await fetch(url);
}

async function sendPostRequest(basePath: string) {
  const requests = requestQueue.post;
  requestQueue.post = [];
  await sendRequest(basePath, postRequest, requests);
}

async function postRequest(
  basePath: string,
  requests: RequestQueue,
  inputs: BatchInputArguments
) {
  const url = `${basePath}${requests
    .map((req) => req.procedureCall[0])
    .join(",")}?batch=1`;
  return await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });
}

async function sendRequest(
  basePath: string,
  fetchFunction: (
    basePath: string,
    requests: RequestQueue,
    inputs: BatchInputArguments
  ) => Promise<Response>,
  requests: RequestQueue
) {
  try {
    const inputs: BatchInputArguments = {};
    requests
      .map((req) => req.procedureCall[1])
      .forEach((args: any[], index: number) => {
        inputs[index] = args;
      });
    const response: Response = await fetchFunction(basePath, requests, inputs);

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

export const getBatchPostFunction = (basePath: string) => {
  return async (path: string, { arg }: { arg: any[] }): Promise<any> => {
    let resolve: null | ((value: unknown) => void) = null;
    let reject: null | ((reason?: any) => void) = null;
    const promise = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve;
      reject = promiseReject;
    });
    const procedureCall: [path: string, args: any[]] = [path, arg];
    if (requestQueue.post.length === 0) {
      requestQueue.post = [
        { procedureCall, resolve: resolve!, reject: reject! },
      ];
      setTimeout(() => sendPostRequest(basePath));
    } else {
      requestQueue.post = [
        ...requestQueue.post,
        { procedureCall, resolve: resolve!, reject: reject! },
      ];
    }
    return promise;
  };
};
