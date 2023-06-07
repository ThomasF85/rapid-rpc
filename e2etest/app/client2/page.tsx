"use client";

import { api } from "@/rpc/2/client";

export default function Page() {
  const {
    data: double1,
    isLoading: loading1,
    error: error1,
  } = api.getDouble.useQuery(15);
  const {
    data: double1b,
    isLoading: loading1b,
    error: error1b,
  } = api.getDouble.useQueryOptions({}, 24);
  const {
    data: greeting1,
    isLoading: loading2,
    error: error2,
  } = api.getGreeting.useQuery("Max", { age: 33, isHungry: true });
  const {
    data: greeting1b,
    isLoading: loading2b,
    error: error2b,
  } = api.getGreeting.useQueryOptions({}, "Max", { age: 36, isHungry: true });
  const {
    data: greeting2,
    isLoading: loading3,
    error: error3,
  } = api.getGreeting.useQuery("Mario", { age: 36, isHungry: false });
  const {
    data: greeting2b,
    isLoading: loading3b,
    error: error3b,
  } = api.getGreeting.useQuery("Mario", { age: 39, isHungry: false });

  if (loading1 || loading1b || loading2 || loading2b || loading3 || loading3b) {
    return <div>Loading...</div>;
  }

  if (error1 || error1b || error2 || error2b || error3 || error3b) {
    return <div>An error occurred</div>;
  }

  return (
    <>
      <div data-cy="client-double">Double: {double1}</div>
      <div data-cy="client-greeting1">{greeting1}</div>
      <div data-cy="client-greeting2">{greeting2}</div>
      <div data-cy="client-options-double">Double: {double1b}</div>
      <div data-cy="client-options-greeting1">{greeting1b}</div>
      <div data-cy="client-options-greeting2">{greeting2b}</div>
    </>
  );
}
