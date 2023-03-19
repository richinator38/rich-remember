import Head from "next/head";
import { useSession } from "next-auth/react";

import AccessDenied from "@/components/Auth/access-denied";
import BookmarksPage from "./[user_id]";
import { useRouter } from "next/router";
import { useContext } from "react";
import BookmarksContext from "@/store/bookmarks-context";

export default function Home() {
  const { data: session } = useSession();
  const bmCtx = useContext(BookmarksContext);
  const router = useRouter();

  if (session && bmCtx.user) {
    router.push(`/${bmCtx.user.id}`);
  } else {
    return (
      <>
        <Head>
          <title>iRemember</title>
          <meta
            name="description"
            content="Bookmark app for those with less than ideal memories"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AccessDenied />
      </>
    );
  }
}
