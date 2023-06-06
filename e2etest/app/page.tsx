import { serverApi } from "@/rpc/server";
import Link from "next/link";

export default async function Home() {
  const entries = await serverApi.getEntries();

  return (
    <>
      <main>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id} data-cy={`static-entry-${entry.label}`}>
              {entry.label} : {entry.favorite.toString()}
            </li>
          ))}
        </ul>
      </main>
      <footer>
        <nav>
          <ul>
            <li>
              <Link href="/client1" data-cy="nav-client1">
                client page 1
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
