import Head from "next/head";
import { MongoClient, ServerApiVersion } from "mongodb";

import { BookmarkModel } from "@/models/Bookmark";
import BookmarkContainer from "@/components/Bookmark/BookmarkContainer";
import { useContext, useEffect } from "react";
import BookmarksContext from "@/store/bookmarks-context";

export default function Home(props: { bookmarks: BookmarkModel[] }) {
  const bmCtx = useContext(BookmarksContext);
  const { bookmarks } = props;

  useEffect(() => {
    bmCtx.onBookmarksRetrieved(bookmarks);
  }, [bookmarks]);

  return (
    <>
      <Head>
        <title>I Remember</title>
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

export async function getStaticProps() {
  // fetch data from an API
  const uri =
    "mongodb+srv://rfranz:IsDkRxOlb5oJbPUY@bookmarks.mu319t2.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();

  const bookmarks = await client
    .db("bookmarks")
    .collection("bookmarks")
    .find()
    .toArray();

  client.close();

  return {
    props: {
      bookmarks: bookmarks.map((bm) => ({
        text: bm.text,
        link: bm.link,
        tags: bm.tags,
        id: bm._id.toString(),
      })),
    },
    revalidate: 1,
  };
}
