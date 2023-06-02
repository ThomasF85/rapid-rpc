export interface RPCResponse {
  result?: {
    data: any;
  };
  error?: {
    json: {
      message: string;
      code: number;
      data: {
        httpStatus: number;
      };
    };
  };
}

export interface BatchInputArguments {
  [key: number]: any[];
}
