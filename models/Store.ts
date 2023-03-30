import { BookmarkModel } from "./Bookmark";
import { UserModel } from "./User";

export interface StoreModel {
  user: UserModel;
  bookmarks: BookmarkModel[];
  allTags: string[];
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => void;
  onSetUser: (user: UserModel) => void;
  onSetAllTags: (tags: string[]) => void;
}
