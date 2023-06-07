import "server-only";
import { create } from "rapid-rpc";

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
  mutations: {},
});

export type API = typeof serverApi;
