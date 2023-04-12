import { useContext, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ky from "ky";
import { toast } from "react-toastify";

import AccessDenied from "@/components/Auth/access-denied";
import BookmarksContext from "@/store/bookmarks-context";
import { UserModel } from "@/models";
import BookmarkContainer from "@/components/Bookmark/BookmarkContainer";
import { useUserFromStorage } from "@/hooks/useUserFromStorage";

export default function Home() {
  const { data: session } = useSession();
  const { id: user_id } = useUserFromStorage();
  const bmCtx = useRef(useContext(BookmarksContext));
  let userIdFromContext = bmCtx.current.user?.id || "";
  const router = useRouter();
  const emailSession = session?.user?.email || "";
  const nameSession = session?.user?.name || "";
  const hasId =
    (user_id && user_id.length > 0) ||
    (userIdFromContext && userIdFromContext.length > 0);

  useEffect(() => {
    const setUser = async () => {
      toast("Loading User...");
      const userFromDbResponse = await ky.get(
        `/api/user?email=${emailSession}`,
        {
          timeout: 20000,
          throwHttpErrors: false,
        }
      );
      toast.dismiss();

      let userSet!: UserModel;

      if (userFromDbResponse.status === 200) {
        userSet = await userFromDbResponse.json<UserModel>();

        bmCtx.current.onSetUser(userSet);
      } else if (userFromDbResponse.status === 404) {
        toast("Saving User...");
        const response = await ky.post("/api/user", {
          json: { name: nameSession, email: emailSession },
          timeout: 20000,
        });
        toast.dismiss();

        userSet = await response.json();
        bmCtx.current.onSetUser(userSet);
      }
    };

    const hasEmail = emailSession && emailSession.length > 0;
    if (hasEmail && !hasId) {
      setUser();
    }
  }, [emailSession, nameSession, userIdFromContext, router, user_id]);

  const header = (
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
    </>
  );

  if (session || hasId) {
    return (
      <>
        {header}
        <BookmarkContainer />
      </>
    );
  } else {
    return (
      <>
        {header}
        <AccessDenied />
      </>
    );
  }
}
