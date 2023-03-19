// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { BookmarkModel } from "@/models/Bookmark";
import { Constants } from "@/constants/constants";

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
  } else {
    res.status(500).json({ status: "Error" });
  }
};

export default handler;
