import { MongoClient, ServerApiVersion } from "mongodb";

import { Constants } from "@/constants/constants";
import { BookmarkModel } from "@/models";

export async function getAllBookmarksForUser(userid: string) {
  const client = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();

  const bookmarks = await client
    .db(Constants.DatabaseName)
    .collection<BookmarkModel>(Constants.CollectionNames.bookmarks)
    .find({ user_id: userid })
    .toArray();

  client.close();

  const bookmarkArray: BookmarkModel[] = bookmarks.map((bm) => {
    return {
      id: bm._id.toString(),
      link: bm.link,
      text: bm.text,
      tags: bm.tags,
      user_id: bm.user_id,
    };
  });

  return bookmarkArray;
}
