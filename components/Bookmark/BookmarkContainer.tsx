import { BookmarkModel } from "@/models/Bookmark";
import React from "react";

import Bookmark from "./Bookmark";

const BookmarkContainer = (props: { bookmarks: BookmarkModel[] }) => {
  let bookmarksToShow = null;

  if (props.bookmarks && props.bookmarks.length > 0) {
    return (
      <div className="text-center grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {props.bookmarks.map((bm) => (
          <Bookmark {...bm} key={bm.id} />
        ))}
      </div>
    );
  }

  return (bookmarksToShow = (
    <h1 className="text-xl font-bold">
      No bookmarks to show. Create with the Add button above.
    </h1>
  ));
};

export default BookmarkContainer;
