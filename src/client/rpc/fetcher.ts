import { RPCResponse } from "../../types";
import { encodeArguments } from "./utils";

export const getFetcher = (basePath: string) => {
  return async (x: [path: string, args: any[]]): Promise<any> => {
    const [path, args] = x;
    const url =
      args.length === 0
        ? path
        : `${basePath}${path}?input=${encodeArguments(args)}`;
    const res = await fetch(url);

    if (!res.ok) {
      const error: Error = new Error(
        "An error occurred while fetching the data."
      );

      throw error;
    }
    const result: RPCResponse = await res.json();
    return result.result!.data;
  };
};

// TODO: make export getter function instead of fetcher directly
export const postFunction = async (url: string, { arg }: { arg: any[] }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};
