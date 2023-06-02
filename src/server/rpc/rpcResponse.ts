import { RPCResponse } from "../../types";

export function successResponse(data: any): RPCResponse {
  return { result: { data } };
}

export function errorResponse(message: string): RPCResponse {
  return { error: { json: { message } } };
}
