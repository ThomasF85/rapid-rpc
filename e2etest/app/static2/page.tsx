import { serverApi } from "@/rpc/2/server";

export default async function Home() {
  const double = await serverApi.getDouble(12);
  const greeting1 = await serverApi.getGreeting("Max", {
    age: 36,
    isHungry: true,
  });
  const greeting2 = await serverApi.getGreeting("Mario", {
    age: 39,
    isHungry: false,
  });

  return (
    <>
      <div data-cy="static-double">Double: {double}</div>
      <div data-cy="static-greeting1">{greeting1}</div>
      <div data-cy="static-greeting2">{greeting2}</div>
    </>
  );
}
