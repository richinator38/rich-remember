import React, { useState } from "react";

import { StoreModel } from "@/models/Store";
import { BookmarkModel } from "@/models/Bookmark";

const BookmarksContext = React.createContext<StoreModel>({
  bookmarks: [],
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => {},
});

export const BookmarksContextProvider = (props: React.PropsWithChildren) => {
  const [bookmarks, setBookmarks] = useState<BookmarkModel[]>([]);

  const handleBookmarksRetrieved = (bookmarks: BookmarkModel[]) => {
    setBookmarks(bookmarks);
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks: bookmarks,
        onBookmarksRetrieved: handleBookmarksRetrieved,
      }}
    >
      {props.children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContext;
