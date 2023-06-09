"use client";

import { api } from "@/rpc/8/client-no-batching";

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
    data: double,
    isLoading: loadings4,
    error: errors4,
    mutate: mutateF,
  } = api.getDouble.useQuery(12);
  const {
    data: value,
    isLoading: loadings5,
    error: errors5,
    mutate: mutateG,
  } = api.getValue.useQuery();
  const { trigger:mutate } = api.addEntry.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
      mutateC();
      mutateD();
      mutateF();
      mutateG();
    },
  });

  if (
    loading1 ||
    loading2 ||
    loadings1 ||
    loadings2 ||
    loadings4 ||
    loadings5
  ) {
    return <div>Loading...</div>;
  }

  if (error1 || error2 || errors1 || errors2 || errors4 || errors5) {
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
      <div data-cy="value">Value: {value}</div>
      <button data-cy="mutation" onClick={() => mutate()}>
        add entry
      </button>
    </>
  );
}
