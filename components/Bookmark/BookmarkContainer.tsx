import { BookmarkModel } from "@/models/Bookmark";
import React from "react";

import Bookmark from "./Bookmark";

const BookmarkContainer = (props: { bookmarks: BookmarkModel[] }) => {
  return (
    <div className="text-center grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {props.bookmarks.map((bm) => (
        <Bookmark {...bm} key={bm.id} />
      ))}
    </div>
  );
};

export default BookmarkContainer;
