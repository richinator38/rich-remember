import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Layout from "@/components/Layout";
import { BookmarksContextProvider } from "@/store/bookmarks-context";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <ToastContainer
        autoClose={false}
        position="bottom-center"
        newestOnTop
        closeButton={false}
        closeOnClick={false}
        theme="colored"
      />
      <Layout>
        <BookmarksContextProvider>
          <Component {...pageProps} />
        </BookmarksContextProvider>
      </Layout>
    </SessionProvider>
  );
}
