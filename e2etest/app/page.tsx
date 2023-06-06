import { serverApi } from "@/rpc/server";

export default async function Home() {
  const entries = await serverApi.getEntries();

  return (
    <main>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} data-cy={`static-entry-${entry.label}`}>
            {entry.label} : {entry.favorite.toString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
