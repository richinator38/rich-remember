import { BookmarkModel } from "@/models/Bookmark";
import BookmarksContext from "@/store/bookmarks-context";
import { uniq } from "lodash-es";
import React, { useContext, useEffect, useState } from "react";
import FilterByTags from "../Filter/FilterByTags";

import Bookmark from "./Bookmark";

const BookmarkContainer = (props: { bookmarks: BookmarkModel[] }) => {
  const { bookmarks } = props;
  const [bookmarksToShow, setBookmarksToShow] =
    useState<BookmarkModel[]>(bookmarks);
  const bmCtx = useContext(BookmarksContext);

  useEffect(() => {
    const allTags = uniq(
      bookmarks.flatMap((bm) => {
        const lowercaseTags: string[] = [];
        bm.tags.forEach((t) => lowercaseTags.push(t.toLowerCase()));
        return lowercaseTags;
      })
    ).sort();

    bmCtx.onSetAllTags(allTags);
  }, [bookmarks]);

  const handleFilterChange = (tags: string[]) => {
    const newFilteredBookmarks = props.bookmarks.filter((bm) => {
      if (tags?.length > 0) {
        return (
          bm.tags?.findIndex(
            (tag) =>
              tags.findIndex((t) => t.toLowerCase() === tag.toLowerCase()) >= 0
          ) >= 0
        );
      }

      return true;
    });

    setBookmarksToShow(newFilteredBookmarks);
  };

  return (
    <>
      <FilterByTags
        onTagsChanged={handleFilterChange}
        allTags={bmCtx.allTags}
      />
      <div className="text-center grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {bookmarksToShow?.length > 0 ? (
          bookmarksToShow.map((bm) => <Bookmark {...bm} key={bm.id} />)
        ) : (
          <h1 className="text-xl font-bold">No bookmarks to show.</h1>
        )}
      </div>
    </>
  );
};

export default BookmarkContainer;
