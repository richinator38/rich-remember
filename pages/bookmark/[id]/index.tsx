import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import ky from "ky";

// import { GetServerSideProps } from "next/types";
// import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import UIButton from "@/components/UI/UIButton";
import UIForm from "@/components/UI/UIForm";
import BookmarksContext from "@/store/bookmarks-context";

const BookmarkDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const bmCtx = useContext(BookmarksContext);
  const bookmark = bmCtx.bookmarks.find((b) => b.id === id);

  const [descriptionState, setDescriptionState] = useState(bookmark?.text);
  const [linkState, setLinkState] = useState(bookmark?.link);

  const handleSave = async (e: any) => {
    e.preventDefault();

    if (bookmark) {
      const bm = bmCtx.bookmarks.find((b) => b.id === id);
      if (bm) {
        bm.link = linkState || "";
        bm.text = descriptionState || "";
        const response = await ky
          .put("/api/bookmarks", {
            json: bm,
            timeout: 20000,
          })
          .json();
        console.log("response", response);
      }
    }
    router.push(`/`);
  };

  const handleCancel = (e: any) => {
    e.preventDefault();

    router.push(`/`);
  };

  const handleDescChange = (e: any) => {
    setDescriptionState(e.target.value);
  };

  const handleLinkChange = (e: any) => {
    setLinkState(e.target.value);
  };

  return (
    <>
      {bookmark ? (
        <>
          <Head>
            <title>Bookmark Details</title>
          </Head>
          <UIForm title="Bookmark Details">
            <label htmlFor="description" aria-label="Description">
              Description
            </label>
            <input
              className="rounded-md h-10 p-1"
              type="text"
              id="description"
              onChange={handleDescChange}
              value={descriptionState}
            />
            <label htmlFor="link" aria-label="Link" className="mt-4">
              Link
            </label>
            <input
              className="rounded-md h-10 p-1"
              type="text"
              id="link"
              onChange={handleLinkChange}
              value={linkState}
            />
            <UIButton onClick={handleSave} text="Save" />
            <UIButton onClick={handleCancel} text="Cancel" />
          </UIForm>
        </>
      ) : (
        <h1 className="font-bold text-2xl text-center mb-6">
          Bookmark not found
        </h1>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   const bookmarkId = context.params.id as string;
//   const uri =
//     "mongodb+srv://rfranz:IsDkRxOlb5oJbPUY@bookmarks.mu319t2.mongodb.net/?retryWrites=true&w=majority";
//   const client = new MongoClient(uri, {
//     serverApi: ServerApiVersion.v1,
//   });
//   await client.connect();

//   const bookmark = await client
//     .db("bookmarks")
//     .collection("bookmarks")
//     .findOne({
//       _id: new ObjectId(bookmarkId),
//     });

//   client.close();

//   if (bookmark == null) {
//     return {
//       props: { bookmark: null },
//     };
//   }

//   return {
//     props: {
//       bookmark: {
//         id: bookmark?._id.toString(),
//         text: bookmark?.text,
//         link: bookmark?.link,
//         tags: bookmark?.tags,
//       },
//     },
//   };
// };

export default BookmarkDetail;
