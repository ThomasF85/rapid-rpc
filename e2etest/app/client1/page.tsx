"use client";

import { api } from "@/rpc/client";

export default function Page() {
  const { data: entries, isLoading, error } = api.getEntries.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred</div>;
  }

  return (
    <main>
      <ul>
        {entries!.map((entry) => (
          <li key={entry.id} data-cy={`client1-entry-${entry.label}`}>
            {entry.label} : {entry.favorite.toString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
