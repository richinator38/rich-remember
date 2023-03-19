import { MongoClient, ServerApiVersion, WithId } from "mongodb";
import { useSession } from "next-auth/react";
import ky from "ky";
import { useContext, useEffect } from "react";
import Head from "next/head";

import { Constants } from "@/constants/constants";
import { BookmarkModel } from "@/models/Bookmark";
import BookmarkContainer from "@/components/Bookmark/BookmarkContainer";
import BookmarksContext from "@/store/bookmarks-context";
import { UserModel } from "@/models";
import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

export default function BookmarksPage(props: { bookmarks: BookmarkModel[] }) {
  const { bookmarks } = props;
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const bmCtx = useContext(BookmarksContext);

  useEffect(() => {
    bmCtx.onBookmarksRetrieved(bookmarks);
  }, [bookmarks, bmCtx]);

  useEffect(() => {
    const setUser = async () => {
      const userFromDbResponse = await ky.get(`/api/user?email=${email}`, {
        timeout: 20000,
        throwHttpErrors: false,
      });
      console.log("userFromDbResponse", userFromDbResponse);

      if (userFromDbResponse.status === 200) {
        const userFromDb = await userFromDbResponse.json<UserModel>();

        bmCtx.onSetUser(userFromDb);
      } else if (userFromDbResponse.status === 404) {
        const response = await ky.post("/api/user", {
          json: session?.user,
          timeout: 20000,
        });

        bmCtx.onSetUser(await response.json());
      }
    };

    const hasEmail = email && email.length > 0;
    const hasId = bmCtx.user?.id && bmCtx.user?.id.length > 0;
    if (hasEmail && !hasId) {
      setUser();
    }
  }, [email, bmCtx]);

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
      <BookmarkContainer bookmarks={props.bookmarks} />
    </>
  );
}

interface IParams extends ParsedUrlQuery {
  user_id: string;
}
export async function getStaticPaths() {
  const client = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();

  const users = await client
    .db(Constants.DatabaseName)
    .collection<UserModel>(Constants.CollectionNames.users)
    .find()
    .toArray();

  client.close();

  const userArray = users.map((u) => {
    return { params: { user_id: u._id.toString() } };
  });

  return {
    paths: userArray,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { user_id } = context.params as IParams;

  // fetch data from an API
  const client = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();

  const bookmarks = await client
    .db(Constants.DatabaseName)
    .collection<BookmarkModel>(Constants.CollectionNames.bookmarks)
    .find({ user_id: user_id })
    .toArray();

  client.close();

  return {
    props: {
      bookmarks: bookmarks.map((bm) => ({
        text: bm.text,
        link: bm.link,
        tags: bm.tags,
        user_id: bm.user_id,
        id: bm._id.toString(),
      })),
    },
    revalidate: 1,
  };
};
