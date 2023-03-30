import React, { useState } from "react";

import { StoreModel } from "@/models/Store";
import { BookmarkModel } from "@/models/Bookmark";
import { Constants } from "@/constants/constants";
import { UserModel } from "@/models";

const BookmarksContext = React.createContext<StoreModel>({
  user: { id: "", email: "", name: "" },
  bookmarks: [],
  allTags: [],
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => {},
  onSetUser: (user: UserModel) => {},
  onSetAllTags: (tags: string[]) => {},
});

export const BookmarksContextProvider = (props: React.PropsWithChildren) => {
  const [bookmarks, setBookmarks] = useState<BookmarkModel[]>([]);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const handleBookmarksRetrieved = (bookmarks: BookmarkModel[]) => {
    setBookmarks(bookmarks);
  };

  const handleSetUser = (user: UserModel) => {
    // Store this guy so a refresh doesn't lose it.
    localStorage.setItem(Constants.LocalStorageKeys.User, JSON.stringify(user));

    setCurrentUser({
      name: user?.name || currentUser?.name || "",
      email: user?.email || currentUser?.email || Constants.DefaultEmail,
      id: user?.id || currentUser?.id || "",
    });
  };

  const handleSetAllTags = (tags: string[]) => {
    setAllTags(tags);
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
        allTags: allTags,
        onBookmarksRetrieved: handleBookmarksRetrieved,
        onSetUser: handleSetUser,
        onSetAllTags: handleSetAllTags,
      }}
    >
      {props.children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContext;
