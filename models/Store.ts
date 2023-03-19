import { BookmarkModel } from "./Bookmark";
import { UserModel } from "./User";

export interface StoreModel {
  user: UserModel;
  bookmarks: BookmarkModel[];
  onBookmarksRetrieved: (bookmarks: BookmarkModel[]) => void;
  onSetUser: (user: UserModel) => void;
}
