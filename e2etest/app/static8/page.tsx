import { serverApi } from "@/rpc/8/server";

export default async function Home() {
  const double = await serverApi.getDouble(12);
  const triple = await serverApi.getTriple(12);
  const count = await serverApi.getCount();
  const entry = await serverApi.getEntry(0);
  const value = await serverApi.getValue();

  return (
    <>
      <div data-cy="static-double">Double: {double}</div>
      <div data-cy="static-triple">Triple: {triple}</div>
      <div data-cy="static-count">Count: {count}</div>
      <div data-cy="static-value">Value: {value}</div>
      <div data-cy="static-entry">
        {entry.label} : {entry.favorite.toString()}
      </div>
    </>
  );
}
