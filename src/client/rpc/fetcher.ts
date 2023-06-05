import { RPCResponse } from "../../types";
import { encodeArguments } from "./utils";

export const getFetcher = (basePath: string) => {
  return async (procedureCall: [path: string, args: any[]]): Promise<any> => {
    const [path, args] = procedureCall;
    const url =
      args.length === 0
        ? `${basePath}${path}`
        : `${basePath}${path}?input=${encodeArguments(args)}`;
    return mapResponse(await fetch(url));
  };
};

export const getPostFunction = (basePath: string) => {
  return async (path: string, { arg }: { arg: any[] }) => {
    const response: Response = await fetch(`${basePath}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    return mapResponse(response);
  };
};

async function mapResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const error: Error = new Error(
      "An error occurred while fetching the data."
    );

    throw error;
  }
  const result: RPCResponse = await response.json();
  return result.result!.data;
}
