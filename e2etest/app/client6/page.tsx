"use client";

import { api } from "@/rpc/6/client";

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
  const { mutate } = api.addEntry.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
      mutateC();
      mutateD();
      mutateE();
    },
  });
  const { mutate: reset } = api.resetCallCount.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
      mutateC();
      mutateD();
      mutateE();
    },
  });

  if (loading1 || loading2 || loadings1 || loadings2 || loadings3) {
    return <div>Loading...</div>;
  }

  if (error1 || error2 || errors1 || errors2 || errors3) {
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
      <div data-cy="callcount">
        context: {calls!.context}, middleware: {calls!.middleware}
      </div>
      <button data-cy="reset" onClick={() => reset()}>
        add entry
      </button>
      <button data-cy="mutation" onClick={() => mutate()}>
        add entry
      </button>
    </>
  );
}
