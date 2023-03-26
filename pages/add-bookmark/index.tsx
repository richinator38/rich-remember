import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ky from "ky";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import UIButton from "@/components/UI/UIButton";
import UIForm from "@/components/UI/UIForm";
import { BookmarkModel } from "@/models/Bookmark";
import { useSession } from "next-auth/react";
import { useUserFromStorage } from "@/hooks/useUserFromStorage";
import { isEmpty } from "lodash-es";

const BookmarkAdd = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userFromStorage = useUserFromStorage();
  const bookmark: BookmarkModel = {
    id: "",
    user_id: userFromStorage.id || "",
    link: "",
    text: "",
    tags: [],
  };

  const [descriptionState, setDescriptionState] = useState(bookmark?.text);
  const [linkState, setLinkState] = useState(bookmark?.link);
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

    if (bookmark && session) {
      bookmark.link = linkState || "";
      bookmark.text = descriptionState || "";
      bookmark.tags = tagsState || [];
      const response = await ky
        .post("/api/bookmarks", {
          json: bookmark,
          timeout: 20000,
        })
        .json<BookmarkModel>();
      if (response && response.id.length > 0) {
        const responseReval = await ky
          .get(
            `/api/revalidate?secret=${
              process.env.NEXT_PUBLIC_REVALIDATE_SECRET
            }&userid=${response.user_id}&ts=${new Date().toISOString()}`
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

  return (
    <>
      <Head>
        <title>Add Bookmark</title>
      </Head>
      <UIForm title="Add Bookmark">
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
        />
        {!formInputsValidity.link && (
          <p className="text-red-600 font-bold">Link is required</p>
        )}
        <label aria-label="Tags" className="mt-4">
          Tags
        </label>
        <TagsInput value={tagsState} onChange={handleTagsChange} />
        <UIButton onClick={handleSave} text="Save" />
        <UIButton onClick={handleCancel} text="Cancel" />
      </UIForm>
    </>
  );
};

export default BookmarkAdd;
