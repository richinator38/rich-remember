import React, { useState } from "react";

import { StoreModel } from "@/models/Store";
import { BookmarkModel } from "@/models/Bookmark";
import { Constants } from "@/constants/constants";
import { UserModel } from "@/models";

const BookmarksContext = React.createContext<StoreModel>({
  user: { id: "", email: "", name: "" },
  bookmarks: [],
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => {},
  onSetUser: (user: UserModel) => {},
});

export const BookmarksContextProvider = (props: React.PropsWithChildren) => {
  const [bookmarks, setBookmarks] = useState<BookmarkModel[]>([]);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);

  const handleBookmarksRetrieved = (bookmarks: BookmarkModel[]) => {
    setBookmarks(bookmarks);
  };

  const handleSetUser = (user: UserModel) => {
    setCurrentUser({
      name: user?.name || "",
      email: user?.email || Constants.DefaultEmail,
      id: user?.id,
    });
  };

  return (
    <BookmarksContext.Provider
      value={{
        user: {
          name: currentUser?.name || "",
          email: currentUser?.email || Constants.DefaultEmail,
          id: currentUser?.id || "",
        },
        bookmarks: bookmarks,
        onBookmarksRetrieved: handleBookmarksRetrieved,
        onSetUser: handleSetUser,
      }}
    >
      {props.children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContext;
