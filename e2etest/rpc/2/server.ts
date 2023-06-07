import "server-only";
import { create } from "rapid-rpc";

export const [serverApi, connector] = create({
  queries: {
    getDouble: (number: number) => {
      return 2 * number;
    },
    getGreeting: (name: string, info: { age: number; isHungry: boolean }) => {
      return `Hi ${name}, you are ${info.age} years old and you are ${
        info.isHungry ? "" : "not "
      }hungry`;
    },
  },
  mutations: {},
});

export type API = typeof serverApi;
