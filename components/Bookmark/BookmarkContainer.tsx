import React, { useContext, useEffect, useState } from "react";
import ky from "ky";
import { toast } from "react-toastify";

import FilterByTags from "../Filter/FilterByTags";
import Bookmark from "./Bookmark";
import { BookmarkModel } from "@/models/Bookmark";
import BookmarksContext from "@/store/bookmarks-context";
import { useUserFromStorage } from "@/hooks/useUserFromStorage";
import { useFilterTagsFromStorage } from "@/hooks/useFilterTagsFromStorage";
import FilterByText from "../Filter/FilterByText";
import { useFilterTextFromStorage } from "@/hooks/useFilterTextFromStorage";

const BookmarkContainer = () => {
  const [allBookmarks, setAllBookmarks] = useState<BookmarkModel[]>([]);
  const [bookmarksToShow, setBookmarksToShow] = useState<BookmarkModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bmCtx = useContext(BookmarksContext);
  const { id: user_id } = useUserFromStorage();
  const { filter: currentTags } = useFilterTagsFromStorage();
  const currentTextFilter = useFilterTextFromStorage();
  const { shouldRetrieveBookmarks } = bmCtx;

  useEffect(() => {
    const getBookmarks = async () => {
      setIsLoading(true);
      toast("Loading Bookmarks...");
      const bookmarksFromDbResponse = await ky.get(
        `/api/bookmarks?user_id=${user_id || ""}`,
        {
          timeout: 40000,
          throwHttpErrors: false,
        }
      );

      const bookmarks = await bookmarksFromDbResponse.json<{
        status: string;
        bookmarks: BookmarkModel[];
      }>();
      toast.dismiss();
      setIsLoading(false);
      return bookmarks;
    };

    if (shouldRetrieveBookmarks && user_id && user_id.length > 0) {
      bmCtx.onSetShouldRetrieveBookmarks(false);
      getBookmarks().then((value) => {
        setAllBookmarks(value.bookmarks);
        bmCtx.onBookmarksRetrieved(value.bookmarks);
      });
    } else if (!shouldRetrieveBookmarks) {
      setAllBookmarks(bmCtx.bookmarks);
    }
  }, [user_id, shouldRetrieveBookmarks]);

  useEffect(() => {
    console.log('allBookmarks', allBookmarks);
    if (allBookmarks && allBookmarks.length > 0) {
      doFilter(currentTags, currentTextFilter);
    }
  }, [allBookmarks]);

  const handleFilterChange = (tags: string[]) => {
    doFilter(tags, currentTextFilter);
  };

  const handleTextChange = (text: string) => {
    doFilter(currentTags, text);
  };

  const doFilter = (tags: string[], text: string) => {
    let newFilteredBookmarks = allBookmarks.filter((bm) => {
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

    if (text?.length > 0) {
      newFilteredBookmarks = newFilteredBookmarks.filter((bm) => {
        return bm.link.toLowerCase().includes(text.toLowerCase()) || bm.text.toLowerCase().includes(text.toLowerCase());
      });
    }

    setBookmarksToShow(newFilteredBookmarks);
  };

  return (
    <>
      <div className="text-center grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <FilterByTags onTagsChanged={handleFilterChange} />
        </div>
        <div>
          <FilterByText onTextChanged={handleTextChange} />
        </div>
      </div>

      {bookmarksToShow?.length > 0 ? (
        <div className="text-center grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {bookmarksToShow.map((bm) => (
            <Bookmark {...bm} key={bm.id} />
          ))}
        </div>
      ) : (
        <h1 className="text-xl font-bold text-center">
          {!isLoading && <p>No bookmarks to show.</p>}
        </h1>
      )}
    </>
  );
};

export default BookmarkContainer;
