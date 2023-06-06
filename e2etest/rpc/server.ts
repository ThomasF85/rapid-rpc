import "server-only";
import { create } from "../../src/server/index";

interface Entry {
  id: string;
  label: string;
  favorite: boolean;
}

const entries: Entry[] = [
  { id: "1", label: "E1", favorite: false },
  { id: "2", label: "E2", favorite: true },
];

export const [serverApi, connector] = create({
  queries: {
    getEntries: () => {
      return entries;
    },
  },
  mutations: {
    addEntry: (label: string, favorite: boolean) => {
      const entry: Entry = { id: crypto.randomUUID(), label, favorite };
      entries.push(entry);
      return entry;
    },
  },
});

export type API = typeof serverApi;
