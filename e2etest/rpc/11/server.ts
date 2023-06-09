import "server-only";
import { combine, create, createProtected } from "rapid-rpc";

const api = create({
  queries: {
    getDouble: (number: number) => {
      return 2 * number;
    },
    getGreeting: (name: string, info: { age: number; isHungry: boolean }) => {
      return `Hi ${name}, you are ${info.age} years old and you are ${
        info.isHungry ? "" : "not "
      }hungry`;
    },
    getTriple: (number: number) => {
      if (number < 1000) {
        throw new Error("Number must be 1000 or higher");
      }
      return 3 * 1000;
    },
  },
  mutations: {},
});

const protectedApi = createProtected({
  getContext: () => {
    return { answer: 42 }
  },
  middleware: (options, next) => {
    return next();
  },
  queries: {
    getDouble2: (ctx, number: number) => {
      return 2 * number + ctx.answer;
    },
    getGreeting2: (ctx, name: string, info: { age: number; isHungry: boolean }) => {
      return `Hi ${name}, you are ${info.age + ctx.answer} years old and you are ${
        info.isHungry ? "" : "not "
      }hungry`;
    },
    getTriple2: (ctx, number: number) => {
      if (number < 1000) {
        throw new Error("Number must be 1000 or higher");
      }
      return 3 * 1000;
    },
  },
  mutations: {},
});

export const [serverApi, connector] = combine(api, protectedApi);

export type API = typeof serverApi;
