import React, { useContext, useEffect, useState } from "react";
import { uniq } from "lodash-es";
import ky from "ky";

import FilterByTags from "../Filter/FilterByTags";
import Bookmark from "./Bookmark";
import { BookmarkModel } from "@/models/Bookmark";
import BookmarksContext from "@/store/bookmarks-context";
import { useUserFromStorage } from "@/hooks/useUserFromStorage";
import { useFilterTagsFromStorage } from "@/hooks/useFilterTagsFromStorage";

const BookmarkContainer = () => {
  const [allBookmarks, setAllBookmarks] = useState<BookmarkModel[]>([]);
  const [bookmarksToShow, setBookmarksToShow] = useState<BookmarkModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bmCtx = useContext(BookmarksContext);
  const { id: user_id } = useUserFromStorage();
  const { filter: tagsToFilterBy } = useFilterTagsFromStorage();

  useEffect(() => {
    const getBookmarks = async () => {
      setIsLoading(true);
      const bookmarksFromDbResponse = await ky.get(
        `/api/bookmarks?user_id=${user_id || ""}`,
        {
          timeout: 20000,
          throwHttpErrors: false,
        }
      );

      const bookmarks = await bookmarksFromDbResponse.json<{
        status: string;
        bookmarks: BookmarkModel[];
      }>();
      setIsLoading(false);
      return bookmarks;
    };

    if (user_id && user_id.length > 0) {
      getBookmarks().then((value) => {
        setAllBookmarks(value.bookmarks);
        bmCtx.onBookmarksRetrieved(value.bookmarks);
      });
    }
  }, [user_id]);

  useEffect(() => {
    const allTags = uniq(
      allBookmarks.flatMap((bm) => {
        const lowercaseTags: string[] = [];
        bm.tags.forEach((t) => lowercaseTags.push(t.toLowerCase()));
        return lowercaseTags;
      })
    ).sort();

    bmCtx.onSetAllTags(allTags);
    handleFilterChange(tagsToFilterBy);
  }, [allBookmarks]);

  const handleFilterChange = (tags: string[]) => {
    const newFilteredBookmarks = allBookmarks.filter((bm) => {
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
          <h1 className="text-xl font-bold">
            {isLoading ? (
              <p>Loading Bookmarks...</p>
            ) : (
              <p>No bookmarks to show.</p>
            )}
          </h1>
        )}
      </div>
    </>
  );
};

export default BookmarkContainer;
