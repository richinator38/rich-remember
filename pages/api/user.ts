import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { UserModel } from "@/models";
import { Constants } from "@/constants/constants";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "PUT") {
    const userBody = req.body;
    const client = new MongoClient(process.env.MONGO_URI || "", {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const result = await client
      .db(Constants.DatabaseName)
      .collection<UserModel>(Constants.CollectionNames.users)
      .updateOne(
        {
          _id: new ObjectId(userBody.id),
        },
        {
          $set: {
            name: userBody.name,
            email: userBody.email,
          },
        }
      );

    client.close();

    const statusCode = result.modifiedCount === 1 ? 200 : 500;
    const statusText = statusCode === 200 ? "OK" : "Internal Server Error";
    res.status(statusCode).json({ status: statusText });
  } else if (req.method === "POST") {
    const userBody = req.body;
    const client = new MongoClient(process.env.MONGO_URI || "", {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const userInserted: UserModel = {
      id: "",
      name: userBody.name,
      email: userBody.email,
    };

    const result = await client
      .db(Constants.DatabaseName)
      .collection<UserModel>(Constants.CollectionNames.users)
      .insertOne(userInserted);

    client.close();

    userInserted.id = result.insertedId.toString();
    const statusCode = result.insertedId != null ? 200 : 500;
    res.status(statusCode).json(userInserted);
  } else if (req.method === "GET") {
    const email = req.query.email;

    if (!email || email.length === 0) {
      res.status(400).json({ status: "Email is required" });
      return;
    }
    const client = new MongoClient(process.env.MONGO_URI || "", {
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();

    const result = await client
      .db(Constants.DatabaseName)
      .collection<UserModel>(Constants.CollectionNames.users)
      .findOne({
        email: email,
      });

    client.close();

    const statusCode = result?._id != null ? 200 : 404;
    if (statusCode === 200) {
      const userRetrieved: UserModel = {
        id: result?._id.toString(),
        name: result?.name || "",
        email: result?.email || "",
      };
      res.status(statusCode).json(userRetrieved);
    } else {
      res.status(statusCode).json({ status: "Not found" });
    }
  } else {
    res.status(500).json({ status: "Error" });
  }
};

export default handler;
