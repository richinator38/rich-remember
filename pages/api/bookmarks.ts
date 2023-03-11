// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { BookmarkModel } from "@/models/Bookmark";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "PUT") {
    const bookmarkBody = req.body;
    const uri =
      "mongodb+srv://rfranz:IsDkRxOlb5oJbPUY@bookmarks.mu319t2.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const result = await client
      .db("bookmarks")
      .collection<BookmarkModel>("bookmarks")
      .updateOne(
        {
          _id: new ObjectId(bookmarkBody.id),
        },
        {
          $set: {
            link: bookmarkBody.link,
            text: bookmarkBody.text,
            tags: bookmarkBody.tags,
          },
        }
      );

    client.close();

    const statusCode = result.modifiedCount === 1 ? 200 : 500;
    res.status(statusCode).json({ status: "OK" });
  } else {
    res.status(500).json({ status: "Error" });
  }
};

export default handler;
