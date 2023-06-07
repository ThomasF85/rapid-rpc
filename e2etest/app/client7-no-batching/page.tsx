"use client";

import { api } from "@/rpc/7/client-no-batching";

export default function Page() {
  const {
    data: entries1,
    isLoading: loading1,
    error: error1,
    mutate: mutateA,
  } = api.getEntries.useQuery();
  const {
    data: entries2,
    isLoading: loading2,
    error: error2,
    mutate: mutateB,
  } = api.getEntries.useQueryOptions({});
  const {
    data: entry1,
    isLoading: loadings1,
    error: errors1,
    mutate: mutateC,
  } = api.getEntry.useQuery(0);
  const {
    data: entry2,
    isLoading: loadings2,
    error: errors2,
    mutate: mutateD,
  } = api.getEntry.useQuery(1);
  const {
    data: calls,
    isLoading: loadings3,
    error: errors3,
    mutate: mutateE,
  } = api.getCallCounts.useQuery();
  const {
    data: double,
    isLoading: loadings4,
    error: errors4,
    mutate: mutateF,
  } = api.getDouble.useQuery(12);
  const {
    data: triple,
    isLoading: loadings5,
    error: errors5,
    mutate: mutateG,
  } = api.getTriple.useQuery(12);
  const {
    data: count,
    isLoading: loadings6,
    error: errors6,
    mutate: mutateH,
  } = api.getCount.useQuery();
  const { mutate: setCount } = api.setCount.useMutation();
  const { mutate } = api.addEntry.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
      mutateC();
      mutateD();
      mutateE();
      mutateF();
      mutateG();
      mutateH();
    },
  });
  const { mutate: reset } = api.resetCallCount.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
      mutateC();
      mutateD();
      mutateE();
      mutateF();
      mutateG();
      mutateH();
    },
  });

  if (
    loading1 ||
    loading2 ||
    loadings1 ||
    loadings2 ||
    loadings3 ||
    loadings4 ||
    loadings5 ||
    loadings6
  ) {
    return <div>Loading...</div>;
  }

  if (
    error1 ||
    error2 ||
    errors1 ||
    errors2 ||
    errors3 ||
    errors4 ||
    errors5 ||
    errors6
  ) {
    return <div>An error occurred</div>;
  }

  return (
    <>
      <ul>
        {entries1!.map((entry) => (
          <li key={entry.id} data-cy={`client-entry-${entry.label}`}>
            {entry.label} : {entry.favorite.toString()}
          </li>
        ))}
      </ul>
      <ul>
        {entries2!.map((entry) => (
          <li key={entry.id} data-cy={`client-entry-options-${entry.label}`}>
            {entry.label} : {entry.favorite.toString()}
          </li>
        ))}
      </ul>
      <div data-cy="entry1">
        {entry1!.label} : {entry1!.favorite.toString()}
      </div>
      <div data-cy="entry2">
        {entry2!.label} : {entry2!.favorite.toString()}
      </div>
      <div data-cy="double">Double: {double}</div>
      <div data-cy="triple">Triple: {triple}</div>
      <div data-cy="count">Count: {count}</div>
      <div data-cy="callcount">
        context: {calls!.context}, middleware: {calls!.middleware}
      </div>
      <button data-cy="reset" onClick={() => reset()}>
        reset
      </button>
      <button data-cy="mutation" onClick={() => mutate()}>
        add entry
      </button>
      <button data-cy="setCount" onClick={() => setCount(1337)}>
        set Count
      </button>
    </>
  );
}
