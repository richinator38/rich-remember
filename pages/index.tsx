import { useContext, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ky from "ky";

import AccessDenied from "@/components/Auth/access-denied";
import BookmarksContext from "@/store/bookmarks-context";
import { UserModel } from "@/models";

export default function Home() {
  const { data: session } = useSession();
  const bmCtx = useRef(useContext(BookmarksContext));
  const userIdFromContext = bmCtx.current.user?.id || "";
  const router = useRouter();
  const emailSession = session?.user?.email || "";
  const nameSession = session?.user?.name || "";

  useEffect(() => {
    if (userIdFromContext && userIdFromContext.length > 0) {
      router.push(`/${userIdFromContext}`);
    }
  }, [userIdFromContext, router]);

  useEffect(() => {
    console.log("setUser outside", userIdFromContext);
    const setUser = async () => {
      console.log("setUser inside", userIdFromContext);
      const userFromDbResponse = await ky.get(
        `/api/user?email=${emailSession}`,
        {
          timeout: 20000,
          throwHttpErrors: false,
        }
      );
      console.log("userFromDbResponse", userFromDbResponse);

      let userSet!: UserModel;

      if (userFromDbResponse.status === 200) {
        userSet = await userFromDbResponse.json<UserModel>();

        bmCtx.current.onSetUser(userSet);
      } else if (userFromDbResponse.status === 404) {
        const response = await ky.post("/api/user", {
          json: { name: nameSession, email: emailSession },
          timeout: 20000,
        });

        userSet = await response.json();
        bmCtx.current.onSetUser(userSet);
      }

      if (userSet) {
        router.push(`/${userSet.id?.toString()}`);
      }
    };

    const hasEmail = emailSession && emailSession.length > 0;
    const hasId = userIdFromContext && userIdFromContext.length > 0;
    if (hasEmail && !hasId) {
      setUser();
    }
  }, [emailSession, nameSession, userIdFromContext, router]);

  if (!session) {
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
