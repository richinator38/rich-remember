import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import ky from "ky";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import UIButton from "@/components/UI/UIButton";
import UIForm from "@/components/UI/UIForm";
import BookmarksContext from "@/store/bookmarks-context";
import { useUserFromStorage } from "@/hooks/useUserFromStorage";

const BookmarkDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const bmCtx = useContext(BookmarksContext);
  const bookmark = bmCtx.bookmarks.find((b) => b.id === id);
  const userFromStorage = useUserFromStorage();

  const [descriptionState, setDescriptionState] = useState(bookmark?.text);
  const [linkState, setLinkState] = useState(bookmark?.link);
  const [tagsState, setTagsState] = useState(bookmark?.tags || []);

  const handleSave = async (e: any) => {
    e.preventDefault();

    if (bookmark) {
      const bm = bmCtx.bookmarks.find((b) => b.id === id);
      if (bm) {
        bm.link = linkState || "";
        bm.text = descriptionState || "";
        bm.user_id = userFromStorage.id || "";
        bm.tags = tagsState || [];
        const response = await ky
          .put("/api/bookmarks", {
            json: bm,
            timeout: 20000,
          })
          .json();

        const responseReval = await ky
          .get(
            `/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}&userid=${userFromStorage.id}`
          )
          .json();
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

  const handleTagsChange = (tags: string[]) => {
    setTagsState(tags);
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
            <label aria-label="Tags" className="mt-4">
              Tags
            </label>
            <TagsInput value={tagsState} onChange={handleTagsChange} />
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

export default BookmarkDetail;
