import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Layout from "@/components/Layout";
import { BookmarksContextProvider } from "@/store/bookmarks-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <BookmarksContextProvider>
        <Component {...pageProps} />
      </BookmarksContextProvider>
    </Layout>
  );
}
