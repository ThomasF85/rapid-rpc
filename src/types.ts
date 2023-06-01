export interface RPCResponse {
  result?: {
    data: any;
  };
  error?: {
    json: {
      message: string;
    };
  };
}

export interface BatchInputArguments {
  [key: number]: any[];
}
