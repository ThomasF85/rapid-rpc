"use client";

import { createClient } from "rapid-rpc/client";
import { API } from "./server";

export const api = createClient<API>("http://localhost:3000/api/9", {
  batching: false,
});
