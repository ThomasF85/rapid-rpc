import "server-only";
import { combine, create, createProtected } from "rapid-rpc";

interface Entry {
  id: string;
  label: string;
  favorite: boolean;
}

const entries: Entry[] = [
  { id: "1", label: "X1", favorite: false },
  { id: "2", label: "X2", favorite: true },
];

let count = 0;

const api = create({
  queries: {
    getDouble: (number: number) => 2 * number,
    getTriple: (number: number) => 3 * number,
    getCount: () => count,
  },
  mutations: {
    setCount: (newCount: number) => {
      count = newCount;
      return true;
    },
  },
});

const protectedApi = createProtected({
  getContext: () => {
    return { prefix: "XYZ" };
  },
  middleware: (options, next) => {
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
  },
});

const protectedApi2 = createProtected({
  getContext: () => {
    return { prefix: "XYZ" };
  },
  middleware: (options, next) => {
    if (options.ctx.prefix !== "XYZ") {
      throw new Error("middleware does not work correctly");
    }
    return next();
  },
  queries: {
    getValue: (ctx) => {
      return 42 + ctx.prefix;
    },
  },
  mutations: {},
});

export const [serverApi, connector] = combine(protectedApi, api, protectedApi2);

export type API = typeof serverApi;
