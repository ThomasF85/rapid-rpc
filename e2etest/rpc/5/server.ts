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

export const [serverApi, connector] = createProtected({
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
    addEntry2: (ctx, label: string) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label: ctx.prefix + label,
        favorite: false,
      };
      entries.push(entry);
      return entry;
    },
    addEntry3: (ctx, label: string, favorite: boolean) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label: ctx.prefix + label,
        favorite,
      };
      entries.push(entry);
      return entry;
    },
    addEntry4: (ctx, input: { label: string; favorite: boolean }) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label: ctx.prefix + input.label,
        favorite: input.favorite,
      };
      entries.push(entry);
      return entry;
    },
  },
});

export type API = typeof serverApi;
