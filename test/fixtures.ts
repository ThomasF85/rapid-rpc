import { create, createProtected } from "../src/server";

const createServerF1 = () => {
  let count: number = 0;
  return create({
    queries: {
      get42F1: () => {
        return 42;
      },
      getDoubleF1: (number: number) => {
        return 2 * number;
      },
      getSumF1: (number: number, numbers: { a: number; b: number }) => {
        return number + numbers.a + numbers.b;
      },
      getCountF1: () => {
        return count;
      },
    },
    mutations: {
      incrementF1: (amount: number) => {
        count += amount;
      },
      resetF1: () => {
        count = 0;
      },
    },
  });
};

const queriesF1 = [
  { method: "get42F1", args: [], expected: 42 },
  { method: "getDoubleF1", args: [6], expected: 12 },
  { method: "getSumF1", args: [3, { a: 6, b: 9 }], expected: 18 },
];

const eventsF1 = {
  mutations: [
    { method: "resetF1", args: [[]] },
    { method: "incrementF1", args: [[15], [24]] },
  ],
  queries: [
    { method: "getCountF1", args: [], expected: 39, initialExpected: 0 },
  ],
};

const createServerF2 = () => {
  let count: number = 0;
  return create({
    queries: {
      getStringF2: () => {
        return "foo";
      },
      getString2F2: (number: number) => {
        return { answer: 2 * number + "foo" };
      },
      getString3F2: (foo: string, numbers: { a: number; b: number }) => {
        return numbers.a + numbers.b + foo;
      },
      getCountF2: () => {
        return { count };
      },
    },
    mutations: {
      incrementF2: (amount: number) => {
        count += amount;
      },
      resetF2: () => {
        count = 0;
      },
    },
  });
};

const queriesF2 = [
  { method: "getStringF2", args: [], expected: "foo" },
  { method: "getString2F2", args: [6], expected: { answer: "12foo" } },
  { method: "getString3F2", args: ["bar", { a: 6, b: 9 }], expected: "15bar" },
];

const eventsF2 = {
  mutations: [
    { method: "resetF2", args: [[]] },
    { method: "incrementF2", args: [[15], [24]] },
  ],
  queries: [
    {
      method: "getCountF2",
      args: [],
      expected: { count: 39 },
      initialExpected: { count: 0 },
    },
  ],
};

const counterF3 = {
  contextCalls: 0,
  middlewareCalls: 0,
};

const checkCallsF3 = (withEvents: boolean, batching: boolean) => {
  let expectedContextCalls: number = 0;
  let expectedmiddlewareCalls: number = 0;
  if (!withEvents) {
    expectedContextCalls = batching ? 1 : queriesF3.length;
    expectedmiddlewareCalls = queriesF3.length;
  } else {
    expectedContextCalls = batching
      ? 3
      : 2 * eventsF3.queries.length +
        eventsF3.mutations.flatMap((m) => m.args).length;
    expectedmiddlewareCalls =
      2 * eventsF3.queries.length +
      eventsF3.mutations.flatMap((m) => m.args).length;
  }
  expect(counterF3.contextCalls).toBe(expectedContextCalls);
  expect(counterF3.middlewareCalls).toBe(expectedmiddlewareCalls);
};

const createServerF3 = () => {
  let count: number = 0;
  counterF3.contextCalls = 0;
  counterF3.middlewareCalls = 0;
  return createProtected({
    getContext: () => {
      counterF3.contextCalls++;
      return { additional: 30 };
    },
    middleware: (options, next) => {
      counterF3.middlewareCalls++;
      return next();
    },
    queries: {
      getStringF3: (ctx) => {
        return "foo" + ctx.additional;
      },
      getString2F3: (ctx, number: number) => {
        return { answer: 2 * number + "foo" + ctx.additional };
      },
      getString3F3: (ctx, foo: string, numbers: { a: number; b: number }) => {
        return numbers.a + numbers.b + foo + ctx.additional;
      },
      getCountF3: (ctx) => {
        return { count, additional: ctx.additional };
      },
      getCount2F3: (ctx, factor) => {
        return { count: count * factor, additional: ctx.additional };
      },
    },
    mutations: {
      incrementF3: (ctx, amount: number) => {
        count += amount;
      },
      resetF3: (ctx) => {
        count = 0;
      },
    },
  });
};

const queriesF3 = [
  { method: "getStringF3", args: [], expected: "foo30" },
  { method: "getString2F3", args: [6], expected: { answer: "12foo30" } },
  {
    method: "getString3F3",
    args: ["bar", { a: 6, b: 9 }],
    expected: "15bar30",
  },
];

const eventsF3 = {
  mutations: [
    { method: "resetF3", args: [[]] },
    { method: "incrementF3", args: [[15], [24]] },
  ],
  queries: [
    {
      method: "getCountF3",
      args: [],
      expected: { count: 39, additional: 30 },
      initialExpected: { count: 0, additional: 30 },
    },
    {
      method: "getCount2F3",
      args: [6],
      expected: { count: 39 * 6, additional: 30 },
      initialExpected: { count: 0, additional: 30 },
    },
  ],
};

const counterF4 = {
  contextCalls: 0,
};

const checkCallsF4 = (withEvents: boolean, batching: boolean) => {
  let expectedContextCalls: number = 0;
  if (!withEvents) {
    expectedContextCalls = batching ? 1 : queriesF4.length;
  } else {
    expectedContextCalls = batching
      ? 3
      : 2 * eventsF4.queries.length +
        eventsF4.mutations.flatMap((m) => m.args).length;
  }
  expect(counterF4.contextCalls).toBe(expectedContextCalls);
};

const createServerF4 = () => {
  let count: number = 0;
  counterF4.contextCalls = 0;
  return createProtected({
    getContext: () => {
      counterF4.contextCalls++;
      return { additional: 30 };
    },
    queries: {
      getStringF4: (ctx) => {
        return "foo" + ctx.additional;
      },
      getString2F4: (ctx, number: number) => {
        return { answer: 2 * number + "foo" + ctx.additional };
      },
      getString3F4: (ctx, foo: string, numbers: { a: number; b: number }) => {
        return numbers.a + numbers.b + foo + ctx.additional;
      },
      getCountF4: (ctx) => {
        return { count, additional: ctx.additional };
      },
      getCount2F4: (ctx, factor) => {
        return { count: count * factor, additional: ctx.additional };
      },
    },
    mutations: {
      incrementF4: (ctx, amount: number) => {
        count += amount;
      },
      resetF4: (ctx) => {
        count = 0;
      },
    },
  });
};

const queriesF4 = [
  { method: "getStringF4", args: [], expected: "foo30" },
  { method: "getString2F4", args: [6], expected: { answer: "12foo30" } },
  {
    method: "getString3F4",
    args: ["bar", { a: 6, b: 9 }],
    expected: "15bar30",
  },
];

const eventsF4 = {
  mutations: [
    { method: "resetF4", args: [[]] },
    { method: "incrementF4", args: [[15], [24]] },
  ],
  queries: [
    {
      method: "getCountF4",
      args: [],
      expected: { count: 39, additional: 30 },
      initialExpected: { count: 0, additional: 30 },
    },
    {
      method: "getCount2F4",
      args: [6],
      expected: { count: 39 * 6, additional: 30 },
      initialExpected: { count: 0, additional: 30 },
    },
  ],
};

export const fixtures: [any, any, any, any][] = [
  [createServerF1, queriesF1, eventsF1, null],
  [createServerF2, queriesF2, eventsF2, null],
  [createServerF3, queriesF3, eventsF3, checkCallsF3],
  [createServerF4, queriesF4, eventsF4, checkCallsF4],
];
