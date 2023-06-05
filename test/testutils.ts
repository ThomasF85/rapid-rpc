import { NextResponse } from "next/server";
import { Connector } from "../src/server/rpc/types";
import { createClient } from "../src/client";
import { create } from "../src/server";
import fetchMock from "jest-fetch-mock";

export function mockFetch(connector: Connector) {
  fetchMock.resetMocks();
  //@ts-ignore
  NextResponse.json = (res) => JSON.stringify(res);
  //@ts-ignore
  fetchMock.mockResponse(async (req) => {
    const searchParams: any = new Map();
    if (req.url.includes("batch")) {
      searchParams.set("batch", 1);
    }
    if (req.url.includes("?")) {
      searchParams.set(
        "input",
        req.url.substring(req.url.indexOf("input=") + 6)
      );
    }
    const request: any = {
      ...req,
      nextUrl: { searchParams },
    };
    const method = req.url.includes("?")
      ? req.url.substring(5, req.url.indexOf("?"))
      : req.url.substring(5);
    const params: any = {
      params: { method },
    };
    if (req.method === "POST") {
      if (req.body) {
        request.json = () => req.json();
      }
    }
    return await connector[req.method](request, params);
  });
}

export function setUpClientApi(apiOptions, batching) {
  const [serverApi, connector] = create(apiOptions());
  mockFetch(connector);
  type API = typeof serverApi;
  return createClient<API>("test", {
    batching,
  });
}
