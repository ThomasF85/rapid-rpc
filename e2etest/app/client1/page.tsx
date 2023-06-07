"use client";

import { api } from "@/rpc/1/client";

export default function Page() {
  const {
    data: entries1,
    isLoading: loading1,
    error: error1,
  } = api.getEntries.useQuery();
  const {
    data: entries2,
    isLoading: loading2,
    error: error2,
  } = api.getEntries.useQueryOptions({});

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
          <li key={entry.id} data-cy={`client1-entry-${entry.label}`}>
            {entry.label} : {entry.favorite.toString()}
          </li>
        ))}
      </ul>
      <ul>
        {entries2!.map((entry) => (
          <li key={entry.id} data-cy={`client1-entry-options-${entry.label}`}>
            {entry.label} : {entry.favorite.toString()}
          </li>
        ))}
      </ul>
    </>
  );
}
