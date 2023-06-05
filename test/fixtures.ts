const apiOptionsF1 = () => {
  let count: number = 0;
  return {
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
  };
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

const apiOptionsF2 = () => {
  let count: number = 0;
  return {
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
  };
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

export const fixtures: [any, any, any][] = [
  [apiOptionsF1, queriesF1, eventsF1],
  [apiOptionsF2, queriesF2, eventsF2],
];
