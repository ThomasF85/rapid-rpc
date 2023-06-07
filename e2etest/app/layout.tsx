import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <footer>
          <nav>
            <ul>
              <li>
                <Link href="/static1" data-cy="nav-static1">
                  static page 1
                </Link>
              </li>
              <li>
                <Link href="/static2" data-cy="nav-static2">
                  static page 2
                </Link>
              </li>
              <li>
                <Link href="/static7" data-cy="nav-static7">
                  static page 7
                </Link>
              </li>
              <li>
                <Link href="/client1" data-cy="nav-client1">
                  client page 1
                </Link>
              </li>
              <li>
                <Link href="/client2" data-cy="nav-client2">
                  client page 2
                </Link>
              </li>
              <li>
                <Link href="/client3" data-cy="nav-client3">
                  client page 3
                </Link>
              </li>
              <li>
                <Link href="/client4" data-cy="nav-client4">
                  client page 4
                </Link>
              </li>
              <li>
                <Link href="/client5" data-cy="nav-client5">
                  client page 5
                </Link>
              </li>
              <li>
                <Link href="/client6" data-cy="nav-client6">
                  client page 6
                </Link>
              </li>
              <li>
                <Link
                  href="/client6-no-batching"
                  data-cy="nav-client6-no-batching"
                >
                  client page 6 no batching
                </Link>
              </li>
              <li>
                <Link href="/client7" data-cy="nav-client7">
                  client page 7
                </Link>
              </li>
              <li>
                <Link
                  href="/client7-no-batching"
                  data-cy="nav-client7-no-batching"
                >
                  client page 7 no batching
                </Link>
              </li>
            </ul>
          </nav>
        </footer>
      </body>
    </html>
  );
}
