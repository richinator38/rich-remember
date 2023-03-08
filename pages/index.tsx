import Head from "next/head";
import { MongoClient } from "mongodb";

export default function Home() {
  return (
    <>
      <Head>
        <title>I Remember</title>
        <meta
          name="description"
          content="Bookmark app for those with less than ideal memories"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

export async function getStaticProps() {
  // fetch data from an API
  const uri =
    "mongodb+srv://rfranz:<password>@bookmarks.mu319t2.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  client.connect((err: any) => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
  });

  return {
    props: {
      // meetups: meetups.map((meetup) => ({
      //   title: meetup.title,
      //   address: meetup.address,
      //   image: meetup.image,
      //   id: meetup._id.toString(),
      // })),
    },
    revalidate: 1,
  };
}
