"use client";

import { api } from "@/rpc/3/client";

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
  const { trigger: mutate1 } = api.addEntry.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
    },
  });
  const { trigger: mutate2 } = api.addEntry2.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
    },
  });
  const { trigger: mutate3 } = api.addEntry3.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
    },
  });
  const { trigger: mutate4 } = api.addEntry4.useMutation({
    onSuccess: () => {
      mutateA();
      mutateB();
    },
  });

  if (loading1 || loading2) {
    return <div>Loading...</div>;
  }

  if (error1 || error2) {
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
      <button data-cy="mutation1" onClick={() => mutate1()}>
        add entry
      </button>
      <button data-cy="mutation2" onClick={() => mutate2("mario")}>
        add entry
      </button>
      <button data-cy="mutation3" onClick={() => mutate3("luigi", true)}>
        add entry
      </button>
      <button
        data-cy="mutation4"
        onClick={() => mutate4({ label: "max", favorite: true })}
      >
        add entry
      </button>
    </>
  );
}
