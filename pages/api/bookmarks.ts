// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { BookmarkModel } from "@/models/Bookmark";
import { Constants } from "@/constants/constants";
import { sortBy } from "lodash-es";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "PUT") {
    const bookmarkBody = req.body;
    const client = new MongoClient(process.env.MONGO_URI || "", {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const result = await client
      .db(Constants.DatabaseName)
      .collection<BookmarkModel>(Constants.CollectionNames.bookmarks)
      .updateOne(
        {
          _id: new ObjectId(bookmarkBody.id),
        },
        {
          $set: {
            user_id: bookmarkBody.user_id,
            link: bookmarkBody.link,
            text: bookmarkBody.text,
            tags: bookmarkBody.tags,
          },
        }
      );

    client.close();

    const statusCode = result.modifiedCount === 1 ? 200 : 500;
    res.status(statusCode).json({ status: "OK" });
  } else if (req.method === "POST") {
    const bookmarkBody = req.body;
    const client = new MongoClient(process.env.MONGO_URI || "", {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const bookmarkInserted: BookmarkModel = {
      id: "",
      user_id: bookmarkBody.user_id,
      link: bookmarkBody.link,
      text: bookmarkBody.text,
      tags: bookmarkBody.tags,
    };

    const result = await client
      .db(Constants.DatabaseName)
      .collection<BookmarkModel>(Constants.CollectionNames.bookmarks)
      .insertOne(bookmarkInserted);

    client.close();

    bookmarkInserted.id = result.insertedId.toString();
    const statusCode = result.insertedId != null ? 200 : 500;
    res.status(statusCode).json(bookmarkInserted);
  } else if (req.method === "DELETE") {
    const bookmarkId = req.query.bookmark_id as string;
    const client = new MongoClient(process.env.MONGO_URI || "", {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const result = await client
      .db(Constants.DatabaseName)
      .collection<BookmarkModel>(Constants.CollectionNames.bookmarks)
      .deleteOne({
        _id: new ObjectId(bookmarkId),
      });

    client.close();

    const statusCode = result.deletedCount === 1 ? 200 : 500;
    const statusText = statusCode === 200 ? "DELETED" : "ERROR";
    res.status(statusCode).json({ status: statusText });
  } else {
    const userid = req.query.user_id as string;
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
    const bookmarksSorted = sortBy(bookmarkArray, function (b) {
      return b.text.toLowerCase();
    });

    const statusCode = bookmarks != null ? 200 : 500;
    const statusText = statusCode === 200 ? "OK" : "ERROR";
    res
      .status(statusCode)
      .json({ status: statusText, bookmarks: bookmarksSorted });
  }
};

export default handler;
