import { Constants } from "@/constants/constants";
import BookmarksContext from "@/store/bookmarks-context";
import { useContext, useEffect } from "react";

export const useUserFromStorage = () => {
  const bmCtx = useContext(BookmarksContext);
  let userIdFromContext = bmCtx.user?.id || "";

  useEffect(() => {
    if (!userIdFromContext || userIdFromContext.length === 0) {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem(Constants.LocalStorageKeys.User);
        if (userStr && userStr.length > 0) {
          console.log("User set from local storage.");
          const user = JSON.parse(userStr);
          bmCtx.onSetUser(user);
        }
      }
    }
  }, [userIdFromContext]);

  return bmCtx.user;
};
