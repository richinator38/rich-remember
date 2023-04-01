import { useContext, useEffect, useRef } from "react";
import Head from "next/head";

import { BookmarkModel } from "@/models/Bookmark";
import BookmarkContainer from "@/components/Bookmark/BookmarkContainer";
import BookmarksContext from "@/store/bookmarks-context";
import { GetServerSideProps, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getAllUsers } from "@/lib/users-lib";
import { getAllBookmarksForUser } from "@/lib/bookmarks-lib";
import { sortBy } from "lodash-es";

export default function BookmarksPage(props: { bookmarks: BookmarkModel[] }) {
  let { bookmarks } = props;
  const bmCtx = useRef(useContext(BookmarksContext));

  useEffect(() => {
    bmCtx.current.onBookmarksRetrieved(bookmarks);
  }, [bookmarks]);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user_id } = context.params as IParams;

  // fetch data from an API
  let bookmarks = await getAllBookmarksForUser(user_id);
  bookmarks = sortBy(bookmarks, function (b) {
    return b.text.toLowerCase();
  });

  return {
    props: {
      bookmarks,
    },
  };
};
