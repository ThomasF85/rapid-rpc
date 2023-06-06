"use client";

import { ClientApiType, createClient } from "../../src/client";
import { API } from "./server";

export const api: ClientApiType<API> = createClient<API>(
  "http://localhost:3000/api"
);
