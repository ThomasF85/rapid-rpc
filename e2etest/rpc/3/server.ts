import "server-only";
import { create } from "rapid-rpc";

interface Entry {
  id: string;
  label: string;
  favorite: boolean;
}

const entries: Entry[] = [
  { id: "1", label: "X1", favorite: false },
  { id: "2", label: "X2", favorite: true },
];

export const [serverApi, connector] = create({
  queries: {
    getEntries: () => {
      return entries;
    },
  },
  mutations: {
    addEntry: () => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label: "X" + (entries.length + 1),
        favorite: false,
      };
      entries.push(entry);
      return entry;
    },
    addEntry2: (label: string) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label,
        favorite: false,
      };
      entries.push(entry);
      return entry;
    },
    addEntry3: (label: string, favorite: boolean) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label,
        favorite,
      };
      entries.push(entry);
      return entry;
    },
    addEntry4: (input: { label: string; favorite: boolean }) => {
      const entry: Entry = {
        id: crypto.randomUUID(),
        label: input.label,
        favorite: input.favorite,
      };
      entries.push(entry);
      return entry;
    },
  },
});

export type API = typeof serverApi;
