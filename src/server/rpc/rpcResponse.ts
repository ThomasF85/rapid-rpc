import { RPCResponse } from "../../types";

export function successResponse(data: any): RPCResponse {
  return { result: { data } };
}

function getErrorResponse(
  message: string,
  code: number,
  httpStatus: number
): RPCResponse {
  return { error: { json: { message, code, data: { httpStatus } } } };
}

export const errorResponse = {
  NOT_FOUND: (message: string) => getErrorResponse(message, -32004, 404),
  INTERNAL_SERVER_ERROR: (message: string) =>
    getErrorResponse(message, -32603, 500),
};
