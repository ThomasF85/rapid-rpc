import "server-only";
import { createProtected } from "rapid-rpc";

export const [serverApi, connector] = createProtected({
  getContext: () => {
    return { answer: 42 }
  },
  middleware: (options, next) => {
    return next();
  },
  queries: {
    getDouble: (ctx, number: number) => {
      return 2 * number + ctx.answer;
    },
    getGreeting: (ctx, name: string, info: { age: number; isHungry: boolean }) => {
      return `Hi ${name}, you are ${info.age + ctx.answer} years old and you are ${
        info.isHungry ? "" : "not "
      }hungry`;
    },
    getTriple: (ctx, number: number) => {
      if (number < 1000) {
        throw new Error("Number must be 1000 or higher");
      }
      return 3 * 1000;
    },
  },
  mutations: {},
});

export type API = typeof serverApi;
