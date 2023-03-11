import { BookmarkModel } from "./Bookmark";

export interface StoreModel {
  bookmarks: BookmarkModel[];
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => void;
}
