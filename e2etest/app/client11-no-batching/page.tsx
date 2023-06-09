"use client";

import { api } from "@/rpc/11/client-no-batching";

export default function Page() {
  const {
    data: double,
    isLoading: loading,
    error: error,
  } = api.getDouble.useQuery(12);
  const {
    data: triple,
    isLoading: loading3,
    error: error3,
  } = api.getTriple.useQuery(12);
  const {
    data: nothing,
    isLoading: loadingx,
    error: errorx,
    //@ts-ignore
  } = api.getNothing.useQuery(12);
  const {
    data: greeting,
    isLoading: loading2,
    error: error2,
  } = api.getGreeting.useQuery("Max", { age: 33, isHungry: true });
  const {
    data: doubleb,
    isLoading: loadingb,
    error: errorb,
  } = api.getDouble2.useQuery(12);
  const {
    data: tripleb,
    isLoading: loading3b,
    error: error3b,
  } = api.getTriple2.useQuery(12);
  const {
    data: greetingb,
    isLoading: loading2b,
    error: error2b,
  } = api.getGreeting2.useQuery("Max", { age: 33, isHungry: true });

  return (
    <>
      <div data-cy="client-double">
        {error ? "error" : loading ? "loading" : "Double: " + double}
      </div>
      <div data-cy="client-greeting">
        {error2 ? "error" : loading2 ? "loading" : "Greeting: " + greeting}
      </div>
      <div data-cy="client-triple">
        {error3 ? "error" : loading3 ? "loading" : "Triple: " + triple}
      </div>
      <div data-cy="client-double2">
        {errorb ? "error" : loadingb ? "loading" : "Double: " + doubleb}
      </div>
      <div data-cy="client-greeting2">
        {error2b ? "error" : loading2b ? "loading" : "Greeting: " + greetingb}
      </div>
      <div data-cy="client-triple2">
        {error3b ? "error" : loading3b ? "loading" : "Triple: " + tripleb}
      </div>
      <div data-cy="client-nothing">
        {errorx ? "error" : loadingx ? "loading" : "Nothing: " + nothing}
      </div>
    </>
  );
}