import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import ky from "ky";

import UIButton from "@/components/UI/UIButton";
import UIForm from "@/components/UI/UIForm";
import BookmarksContext from "@/store/bookmarks-context";
import { useUserFromStorage } from "@/hooks/useUserFromStorage";
import { isEmpty } from "lodash-es";
import { UITagEntry } from "@/components/UI/UITagEntry";

const BookmarkDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const bmCtx = useContext(BookmarksContext);
  const bookmark = bmCtx.bookmarks.find((b) => b.id === id);
  const userFromStorage = useUserFromStorage();

  const [descriptionState, setDescriptionState] = useState(
    bookmark?.text || ""
  );
  const [linkState, setLinkState] = useState(bookmark?.link || "");
  const [tagsState, setTagsState] = useState(bookmark?.tags || []);
  const [formInputsValidity, setFormInputsValidity] = useState({
    text: true,
    link: true,
  });

  const handleSave = async (e: any) => {
    e.preventDefault();

    if (!updateFieldsValidity(descriptionState, linkState)) {
      return;
    }

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
        bmCtx.onSetShouldRetrieveBookmarks(true);
      }
    }

    router.push(`/`);
  };

  const handleCancel = (e: any) => {
    e.preventDefault();

    router.push(`/`);
  };

  const updateFieldsValidity = (text: string, link: string): boolean => {
    const textIsValid = !isEmpty(text);
    const linkIsValid = !isEmpty(link);

    const validityObj = {
      text: formInputsValidity.text,
      link: formInputsValidity.link,
    };

    validityObj.text = textIsValid;
    validityObj.link = linkIsValid;

    setFormInputsValidity(validityObj);

    const formIsValid = textIsValid && linkIsValid;
    return formIsValid;
  };

  const handleDescChange = (e: any) => {
    const descValue = e.target.value;
    setDescriptionState(descValue);

    updateFieldsValidity(descValue, linkState);
  };

  const handleLinkChange = (e: any) => {
    const linkValue = e.target.value;
    setLinkState(linkValue);

    updateFieldsValidity(descriptionState, linkValue);
  };

  const handleTagsChange = (tags: string[]) => {
    setTagsState(tags);
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    if (bookmark) {
      const response = await ky
        .delete(`/api/bookmarks?bookmark_id=${bookmark.id}`, {
          timeout: 20000,
        })
        .json();
      bmCtx.onSetShouldRetrieveBookmarks(true);
    }

    router.push(`/`);
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
              maxLength={500}
            />
            {!formInputsValidity.text && (
              <p className="text-red-600 font-bold">Description is required</p>
            )}
            <label htmlFor="link" aria-label="Link" className="mt-4">
              Link
            </label>
            <input
              className="rounded-md h-10 p-1"
              type="text"
              id="link"
              onChange={handleLinkChange}
              value={linkState}
              maxLength={2000}
            />
            {!formInputsValidity.link && (
              <p className="text-red-600 font-bold">Link is required</p>
            )}
            <label aria-label="Tags" className="mt-4">
              Tags
            </label>
            <UITagEntry
              onTagsChanged={handleTagsChange}
              initialTags={tagsState}
            />
            <UIButton onClick={handleSave} text="Save" className="mt-6" />
            <UIButton onClick={handleCancel} text="Cancel" />
            <UIButton onClick={handleDelete} text="Delete" />
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
