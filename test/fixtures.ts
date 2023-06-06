import { combine, create, createProtected } from "../src/server";
import { Connector } from "../src/server/rpc/types";

export interface Fixture {
  createServer: () => [any, Connector];
  queries: { method: string; args: any[]; expected: any }[];
  events: {
    mutations: { method: string; args: any[][] }[];
    queries: {
      method: string;
      args: any[];
      expected: any;
      initialExpected: any;
    }[];
  };
  hasContext: boolean;
  hasMiddleware: boolean;
  expectedContextCalls?: (
    batching: boolean,
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => number;
  expectedMiddlewareCalls?: (
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => number;
  getNumberOfContextCalls?: () => number;
  getNumberOfMiddlewareCalls?: () => number;
}

function getExpectedContextCalls(queries, events) {
  return (
    batching: boolean,
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => {
    let contextCalls = 0;
    contextCalls += queriesCalled * (batching ? 1 : queries.length);
    if (batching) {
      contextCalls += eventQueriesCalled + eventMutationsCalled;
    } else {
      contextCalls +=
        eventQueriesCalled * events.queries.length +
        eventMutationsCalled * events.mutations.flatMap((m) => m.args).length;
    }
    return contextCalls;
  };
}

function getExpectedMiddlewareCalls(queries, events) {
  return (
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => {
    let contextCalls = 0;
    contextCalls += queriesCalled * queries.length;
    contextCalls +=
      eventQueriesCalled * events.queries.length +
      eventMutationsCalled * events.mutations.flatMap((m) => m.args).length;
    return contextCalls;
  };
}

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

const fixture1: Fixture = {
  createServer: createServerF1,
  queries: queriesF1,
  events: eventsF1,
  hasContext: false,
  hasMiddleware: false,
};

const createServerF2 = () => {
  let count: number = 0;
  return create({
    queries: {
      getStringF2: () => {
        return "foo";
      },
      getString2F2: async (number: number) => {
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
      incrementF2: async (amount: number) => {
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

const fixture2: Fixture = {
  createServer: createServerF2,
  queries: queriesF2,
  events: eventsF2,
  hasContext: false,
  hasMiddleware: false,
};

const counterF3 = {
  contextCalls: 0,
  middlewareCalls: 0,
};

const createServerF3 = () => {
  let count: number = 0;
  counterF3.contextCalls = 0;
  counterF3.middlewareCalls = 0;
  return createProtected({
    getContext: async () => {
      counterF3.contextCalls++;
      return { additional: 30 };
    },
    middleware: async (options, next) => {
      counterF3.middlewareCalls++;
      return next();
    },
    queries: {
      getStringF3: (ctx) => {
        return "foo" + ctx.additional;
      },
      getString2F3: async (ctx, number: number) => {
        return { answer: 2 * number + "foo" + ctx.additional };
      },
      getString3F3: (ctx, foo: string, numbers: { a: number; b: number }) => {
        return numbers.a + numbers.b + foo + ctx.additional;
      },
      getCountF3: (ctx) => {
        return { count, additional: ctx.additional };
      },
      getCount2F3: async (ctx, factor) => {
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

const fixture3: Fixture = {
  createServer: createServerF3,
  queries: queriesF3,
  events: eventsF3,
  hasContext: true,
  hasMiddleware: true,
  expectedContextCalls: getExpectedContextCalls(queriesF3, eventsF3),
  expectedMiddlewareCalls: getExpectedMiddlewareCalls(queriesF3, eventsF3),
  getNumberOfContextCalls: () => counterF3.contextCalls,
  getNumberOfMiddlewareCalls: () => counterF3.middlewareCalls,
};

const counterF4 = {
  contextCalls: 0,
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

const fixture4: Fixture = {
  createServer: createServerF4,
  queries: queriesF4,
  events: eventsF4,
  hasContext: true,
  hasMiddleware: false,
  expectedContextCalls: getExpectedContextCalls(queriesF4, eventsF4),
  getNumberOfContextCalls: () => counterF4.contextCalls,
};

const counterF5 = {
  contextCalls: 0,
  middlewareCalls: 0,
};

const createServerF5 = () => {
  let protectedCount: number = 0;
  let count: number = 0;
  counterF5.contextCalls = 0;
  counterF5.middlewareCalls = 0;
  const protectedApi = createProtected({
    getContext: () => {
      counterF5.contextCalls++;
      return { additional: 30 };
    },
    middleware: (ctx, next) => {
      counterF5.middlewareCalls++;
      return next();
    },
    queries: {
      getStringF5: (ctx) => {
        return "foo" + ctx.additional;
      },
      getString2F5: (ctx, number: number) => {
        return { answer: 2 * number + "foo" + ctx.additional };
      },
      getCountF5: (ctx) => {
        return { count: protectedCount, additional: ctx.additional };
      },
    },
    mutations: {
      incrementF5: (ctx, amount: number) => {
        protectedCount += amount;
      },
      resetF5: (ctx) => {
        protectedCount = 0;
      },
    },
  });
  const api = create({
    queries: {
      getNumberF5: () => {
        return 72;
      },
      getNumber2F5: (number: number) => {
        return 2 * number;
      },
      getCount2F5: () => {
        return count;
      },
    },
    mutations: {
      increment2F5: (amount: number) => {
        count += amount;
      },
      reset2F5: () => {
        count = 0;
      },
    },
  });
  return combine(api, protectedApi);
};

const queriesF5 = [
  { method: "getStringF5", args: [], expected: "foo30" },
  { method: "getNumberF5", args: [], expected: 72 },
  { method: "getString2F5", args: [9], expected: { answer: "18foo30" } },
  { method: "getNumber2F5", args: [18], expected: 36 },
];

const eventsF5 = {
  mutations: [
    { method: "reset2F5", args: [[]] },
    { method: "resetF5", args: [[]] },
    { method: "increment2F5", args: [[15], [12]] },
    { method: "incrementF5", args: [[10], [5], [4], [16], [7]] },
  ],
  queries: [
    {
      method: "getCountF5",
      args: [],
      expected: { count: 42, additional: 30 },
      initialExpected: { count: 0, additional: 30 },
    },
    {
      method: "getCount2F5",
      args: [],
      expected: 27,
      initialExpected: 0,
    },
  ],
};

const fixture5: Fixture = {
  createServer: createServerF5,
  queries: queriesF5,
  events: eventsF5,
  hasContext: true,
  hasMiddleware: true,
  expectedContextCalls: (
    batching: boolean,
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => {
    let contextCalls = 0;
    contextCalls += queriesCalled * (batching ? 1 : 2);
    if (batching) {
      contextCalls += eventQueriesCalled + eventMutationsCalled;
    } else {
      contextCalls += eventQueriesCalled + eventMutationsCalled * 6;
    }
    return contextCalls;
  },
  expectedMiddlewareCalls: (
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => {
    let middlewareCalls = 0;
    middlewareCalls += queriesCalled * 2;
    middlewareCalls += eventQueriesCalled + eventMutationsCalled * 6;
    return middlewareCalls;
  },
  getNumberOfContextCalls: () => counterF5.contextCalls,
  getNumberOfMiddlewareCalls: () => counterF5.middlewareCalls,
};

const counterF6 = {
  contextCalls: 0,
  middlewareCalls: 0,
};

const createServerF6 = () => {
  let protectedCount: number = 0;
  let count: number = 0;
  counterF6.contextCalls = 0;
  counterF6.middlewareCalls = 0;
  const protectedApi = createProtected({
    getContext: () => {
      counterF6.contextCalls++;
      return { additional: 30 };
    },
    middleware: (ctx, next) => {
      counterF6.middlewareCalls++;
      return next();
    },
    queries: {
      getStringF6: (ctx) => {
        return "foo" + ctx.additional;
      },
      getString2F6: (ctx, number: number) => {
        return { answer: 2 * number + "foo" + ctx.additional };
      },
      getCountF6: (ctx) => {
        return { count: protectedCount, additional: ctx.additional };
      },
    },
    mutations: {
      incrementF6: (ctx, amount: number) => {
        protectedCount += amount;
      },
      resetF6: (ctx) => {
        protectedCount = 0;
      },
    },
  });
  const protectedApi2 = createProtected({
    getContext: () => {
      counterF6.contextCalls++;
      return { additional: 30 };
    },
    queries: {
      getNumberF6: (ctx) => {
        return 72;
      },
      getNumber2F6: (ctx, number: number) => {
        return 2 * number;
      },
      getCount2F6: (ctx) => {
        return count;
      },
    },
    mutations: {
      increment2F6: (ctx, amount: number) => {
        count += amount;
      },
      reset2F6: (ctx) => {
        count = 0;
      },
    },
  });
  const api = create({
    queries: {
      getBooleanF6: () => {
        return false;
      },
      getBoolean2F6: (input: string) => {
        return { a: true, b: input };
      },
    },
    mutations: {},
  });
  return combine(protectedApi2, protectedApi, api);
};

const queriesF6 = [
  { method: "getStringF6", args: [], expected: "foo30" },
  { method: "getNumberF6", args: [], expected: 72 },
  { method: "getString2F6", args: [9], expected: { answer: "18foo30" } },
  { method: "getNumber2F6", args: [18], expected: 36 },
  { method: "getBooleanF6", args: [], expected: false },
  { method: "getBoolean2F6", args: ["baz"], expected: { a: true, b: "baz" } },
];

const eventsF6 = {
  mutations: [
    { method: "reset2F6", args: [[]] },
    { method: "resetF6", args: [[]] },
    { method: "increment2F6", args: [[15], [12]] },
    { method: "incrementF6", args: [[10], [5], [4], [16], [7]] },
  ],
  queries: [
    {
      method: "getCountF6",
      args: [],
      expected: { count: 42, additional: 30 },
      initialExpected: { count: 0, additional: 30 },
    },
    {
      method: "getCount2F6",
      args: [],
      expected: 27,
      initialExpected: 0,
    },
    {
      method: "getBooleanF6",
      args: [],
      expected: false,
      initialExpected: false,
    },
    {
      method: "getBoolean2F6",
      args: ["nba"],
      expected: { a: true, b: "nba" },
      initialExpected: { a: true, b: "nba" },
    },
  ],
};

const fixture6: Fixture = {
  createServer: createServerF6,
  queries: queriesF6,
  events: eventsF6,
  hasContext: true,
  hasMiddleware: true,
  expectedContextCalls: (
    batching: boolean,
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => {
    let contextCalls = 0;
    contextCalls += queriesCalled * (batching ? 2 : 4);
    if (batching) {
      contextCalls += 2 * eventQueriesCalled + 2 * eventMutationsCalled;
    } else {
      contextCalls += 2 * eventQueriesCalled + eventMutationsCalled * 9;
    }
    return contextCalls;
  },
  expectedMiddlewareCalls: (
    queriesCalled: number,
    eventQueriesCalled: number,
    eventMutationsCalled: number
  ) => {
    let middlewareCalls = 0;
    middlewareCalls += queriesCalled * 2;
    middlewareCalls += eventQueriesCalled + eventMutationsCalled * 6;
    return middlewareCalls;
  },
  getNumberOfContextCalls: () => counterF6.contextCalls,
  getNumberOfMiddlewareCalls: () => counterF6.middlewareCalls,
};

export const fixtures: Fixture[] = [
  fixture1,
  fixture2,
  fixture3,
  fixture4,
  fixture5,
  fixture6,
];
