import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

import Layout from "@/components/Layout";
import { BookmarksContextProvider } from "@/store/bookmarks-context";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <BookmarksContextProvider>
          <Component {...pageProps} />
        </BookmarksContextProvider>
      </Layout>
    </SessionProvider>
  );
}
