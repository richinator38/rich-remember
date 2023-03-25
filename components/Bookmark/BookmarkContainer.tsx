import { BookmarkModel } from "@/models/Bookmark";
import { uniq } from "lodash-es";
import React, { useState } from "react";
import FilterByTags from "../Filter/FilterByTags";

import Bookmark from "./Bookmark";

const BookmarkContainer = (props: { bookmarks: BookmarkModel[] }) => {
  const [bookmarksToShow, setBookmarksToShow] = useState<BookmarkModel[]>(
    props.bookmarks
  );

  const allTags = uniq(props.bookmarks.flatMap((bm) => bm.tags)).sort();

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
      <FilterByTags onFilterChange={handleFilterChange} allTags={allTags} />
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
