import "server-only";
import { createProtected } from "rapid-rpc";

interface Entry {
  id: string;
  label: string;
  favorite: boolean;
}

const entries: Entry[] = [
  { id: "1", label: "X1", favorite: false },
  { id: "2", label: "X2", favorite: true },
];

const callCount = {
  context: 0,
  middleware: 0,
};

export const [serverApi, connector] = createProtected({
  getContext: () => {
    callCount.context++;
    return { prefix: "XYZ" };
  },
  middleware: (options, next) => {
    callCount.middleware++;
    if (options.ctx.prefix !== "XYZ") {
      throw new Error("middleware does not work correctly");
    }
    return next();
  },
  queries: {
    getEntries: (ctx) => {
      return [{ id: "0", label: ctx.prefix, favorite: false }, ...entries];
    },
    getEntry: (ctx, index: number) => {
      return [{ id: "0", label: ctx.prefix, favorite: false }, ...entries][
        index
      ];
    },
    getCallCounts: (ctx) => {
      return callCount;
    },
  },
  mutations: {
    addEntry: (ctx) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label: ctx.prefix + "X" + (entries.length + 1),
        favorite: false,
      };
      entries.push(entry);
      return entry;
    },
    resetCallCount: (ctx) => {
      callCount.context = 0;
      callCount.middleware = 0;
      return callCount;
    },
  },
});

export type API = typeof serverApi;