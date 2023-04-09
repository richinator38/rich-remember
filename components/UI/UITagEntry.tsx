import { useContext, useEffect, useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { mdiTagMultipleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import BookmarksContext from "@/store/bookmarks-context";
import { uniq } from "lodash-es";

export interface FilterState {
  filter: string[];
}

export interface UITagEntryProps {
  initialTags?: string[];
  onTagsChanged: (tags: string[]) => void;
}

export const UITagEntry = (props: UITagEntryProps) => {
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const [currentTags, setCurrentTags] = useState<FilterState>({
    filter: props.initialTags || [],
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const bmCtx = useContext(BookmarksContext);
  const { bookmarks: allBookmarks } = bmCtx;

  const handleTagCloudClick = (e: any) => {
    e.preventDefault();

    const newTags = currentTags.filter || [];
    newTags.push(e.target.textContent);
    tagsChanged(newTags);

    setShowAllTags(false);
  };

  useEffect(() => {
    const allTagsNew = uniq(
      allBookmarks.flatMap((bm) => {
        const lowercaseTags: string[] = [];
        bm.tags.forEach((t) => lowercaseTags.push(t.toLowerCase()));
        return lowercaseTags;
      })
    ).sort();

    setAllTags(allTagsNew);
    tagsChanged(currentTags.filter);
  }, [allBookmarks]);

  const handleTagsChange = (tags: string[]) => {
    tagsChanged(tags);
  };

  const tagsChanged = (tags: string[]) => {
    setCurrentTags({ filter: tags });
    props.onTagsChanged(tags);
  };

  const handleShowAllTags = (e: any) => {
    e.preventDefault();

    setShowAllTags(!showAllTags);
  };

  return (
    <div className="flex mb-3">
      <TagsInput
        className="react-tagsinput grow"
        value={currentTags.filter}
        onChange={handleTagsChange}
        inputProps={{
          className: "react-tagsinput-input",
          placeholder: "Filter tags",
        }}
        onlyUnique={true}
      />
      <button className="flex-none w-7" onClick={handleShowAllTags}>
        <Icon path={mdiTagMultipleOutline} title="Show All Tags" size={1} />
      </button>
      {showAllTags && allTags && allTags.length > 0 && (
        <p className="absolute top-28 z-50 bg-blue-300 text-white w-52 h-2/3 overflow-auto scroll-auto">
          {allTags &&
            allTags.map((tag) => (
              <button
                key={tag}
                className="pr-1 w-full p-2"
                onClick={handleTagCloudClick}
              >
                {tag}
              </button>
            ))}
        </p>
      )}
    </div>
  );
};
