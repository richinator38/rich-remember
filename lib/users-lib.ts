import { MongoClient, ServerApiVersion } from "mongodb";

import { Constants } from "@/constants/constants";
import { UserModel } from "@/models";

export async function getAllUsers() {
  const client = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();

  const users = await client
    .db(Constants.DatabaseName)
    .collection<UserModel>(Constants.CollectionNames.users)
    .find()
    .toArray();

  client.close();

  const userArray: UserModel[] = users.map((u) => {
    return {
      id: u._id.toString(),
      name: u.name,
      email: u.email,
    };
  });

  return userArray;
}
