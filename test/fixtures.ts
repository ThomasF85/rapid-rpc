const apiOptionsA = () => {
  let count: number = 0;
  return {
    queries: {
      get42: () => {
        return 42;
      },
      getDouble: (number: number) => {
        return 2 * number;
      },
      getSum: (number: number, numbers: { a: number; b: number }) => {
        return number + numbers.a + numbers.b;
      },
      getCount: () => {
        return count;
      },
    },
    mutations: {
      increment: (amount: number) => {
        count += amount;
      },
      reset: () => {
        count = 0;
      },
    },
  };
};

const queriesA = [
  { method: "get42", args: [], expected: 42 },
  { method: "getDouble", args: [6], expected: 12 },
  { method: "getSum", args: [3, { a: 6, b: 9 }], expected: 18 },
];

const eventsA = {
  mutations: [
    { method: "reset", args: [[]] },
    { method: "increment", args: [[15], [24]] },
  ],
  queries: [{ method: "getCount", args: [], expected: 39, initialExpected: 0 }],
};

export const fixtures: [typeof apiOptionsA, typeof queriesA, typeof eventsA][] =
  [[apiOptionsA, queriesA, eventsA]];
