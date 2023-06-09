# rapid-rpc

A lightweight, typesafe, and scalable way of writing APIs that works with Next.js. Build to work with the App Router and server and client components.

> **This is an experimental version not meant for production use**

## Create your API

We recommend creating your API safely using the server-only package, to make sure you never expose server code to the client.

```ts
// filename: rpc/server.ts
import "server-only";
import { create } from "rapid-rpc";

export const [serverApi, connector] = create({
  queries: {
    getRecentTodos: async (max: number) => {
      const todos: Todo[] = await db.readTodos(max);
      return todos;
    },
  },
  mutations: {
    addTodo: async (text: string, completed: boolean) => {
      const newTodo: Todo = await db.createTodo(text, completed);
      return newTodo;
    },
  },
});

export type API = typeof serverApi;
```

Create your API client:

```ts
// filename: rpc/client.ts
"use client";

import { createClient } from "rapid-rpc/client";
import { API } from "./server";

export const api = createClient<API>("http://localhost:3000/api");
```

Connect your route:

```ts
// filename: app/api/[method]/route.ts
import { connector } from "@/rpc/server";

export const { GET, POST } = connector;
```

## Use your API

Use the API in server components:

```ts
import { serverApi } from "@/rpc/server";

export default async function Page() {
  const todos = await serverApi.getRecentTodos(5);

  return <Home todos={todos} />;
}
```

Use the API in client components:

```ts
"use client";

import { api } from "@/rpc/client";

export default function MyClientComponent() {
  const { data, isLoading, error, mutate } = api.getRecentTodos.useQuery(10);
  const { trigger } = api.addTodo.useMutation({
    onSuccess: () => mutate(),
  });

  // You can call trigger with two arguments anytime like so: trigger("learn typescript", false)

  //...
}
```

The hooks `useQuery` and `useMutation` are thin wrappers around SWRs `useSWR` and `useSWRMutation` hooks.

There is also the `useQueryOptions` hook which gives you access to the options you have with the `useSWR` hook:

```ts
"use client";

import { api } from "@/rpc/client";

export default function MyClientComponent() {
  const { data, isLoading, error } = api.getRecentTodos.useQueryOptions({ refreshInterval: 5000 }, 10);

  //...
}
```

## Create a protected API

```ts
import "server-only";
import { createProtected, MiddlewareOptions } from "rapid-rpc";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const [serverApi, connector] = createProtected({
  // The returned context will be fed into every query and mutation call
  getContext: async (): Promise<Token | null> => {
    const sessionCookie = cookies().get("session");
    const token: Token | null = auth.getToken(sessionCookie);
    return token;
  },
  middleware: (options: MiddlewareOptions<Token | null>, next: () => any) => {
    // options.ctx will contain the return value of getContext
    if (!options.ctx) {
      return NextResponse.json({ message: "Not logged in!" }, { status: 403 });
    }
    return next();
  },
  queries: {
    getTodosByUser: async (ctx: Token | null, max: number) => {
      const { userId } = ctx!;
      const todos: Todo[] = await db.readTodosByUser(userId, max);
      return todos;
    },
  },
  mutations: {
    addTodo: async (ctx: Token | null, text: string, completed: boolean) => {
      const { userId } = ctx!;
      const newTodo: Todo = await db.createTodo(userId, text, completed);
      return newTodo;
    },
  },
});

export type API = typeof serverApi;
```

## Combine APIs

```ts
import "server-only";
import { create, createProtected, combine } from "rapid-rpc";

const publicApi = create({
  //...
});

const protectedApi = createProtected({
  //...
});

export const [serverApi, connector] = combine(publicApi, protectedApi);

export type API = typeof serverApi;
```
