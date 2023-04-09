import React, { useState } from "react";

import { StoreModel } from "@/models/Store";
import { BookmarkModel } from "@/models/Bookmark";
import { Constants } from "@/constants/constants";
import { UserModel } from "@/models";

const BookmarksContext = React.createContext<StoreModel>({
  user: { id: "", email: "", name: "" },
  bookmarks: [],
  shouldRetrieveBookmarks: true,
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => {},
  onSetUser: (user: UserModel) => {},
  onSetShouldRetrieveBookmarks: (value: boolean) => {},
});

export const BookmarksContextProvider = (props: React.PropsWithChildren) => {
  const [bookmarks, setBookmarks] = useState<BookmarkModel[]>([]);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [shouldRetrieveBookmarks, setShouldRetrieveBookmarks] =
    useState<boolean>(true);

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

  const handleSetShouldRetrieveBookmarks = (value: boolean) => {
    setShouldRetrieveBookmarks(value);
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
        shouldRetrieveBookmarks: shouldRetrieveBookmarks,
        onBookmarksRetrieved: handleBookmarksRetrieved,
        onSetUser: handleSetUser,
        onSetShouldRetrieveBookmarks: handleSetShouldRetrieveBookmarks,
      }}
    >
      {props.children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContext;
