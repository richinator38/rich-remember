import { useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { mdiTagMultipleOutline } from "@mdi/js";
import Icon from "@mdi/react";

export interface FilterState {
  filter: string[];
}

export interface UITagEntryProps {
  allTags?: string[];
  initialTags?: string[];
  onTagsChanged: (tags: string[]) => void;
}

export const UITagEntry = (props: UITagEntryProps) => {
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const [currentTags, setCurrentTags] = useState<FilterState>({
    filter: props.initialTags || [],
  });

  const handleTagCloudClick = (e: any) => {
    e.preventDefault();

    const newTags = currentTags.filter || [];
    newTags.push(e.target.textContent);
    tagsChanged(newTags);

    setShowAllTags(false);
  };

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
      {showAllTags && props.allTags && props.allTags.length > 0 && (
        <p className="absolute top-28 z-50 bg-blue-300 text-white w-52 h-2/3 overflow-auto scroll-auto">
          {props.allTags &&
            props.allTags.map((tag) => (
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
