import { Constants } from "@/constants/constants";
import { useFilterTagsFromStorage } from "@/hooks/useFilterTagsFromStorage";
import { mdiTagMultipleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

export interface FilterState {
  filter: string[];
}
export interface FilterByTagsProps {
  allTags?: string[];
  onFilterChange: (tags: string[]) => void;
}

const FilterByTags = (props: FilterByTagsProps) => {
  const filterState = useFilterTagsFromStorage();
  const [currentTags, setCurrentTags] = useState<FilterState>(filterState);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  const handleTagsChange = (tags: string[]) => {
    setCurrentTags({ filter: tags });

    localStorage.setItem(
      Constants.LocalStorageKeys.FilterTags,
      JSON.stringify({ filter: tags })
    );

    props.onFilterChange(tags);
  };

  const handleTagCloudClick = (e: any) => {
    e.preventDefault();

    const newTags = [...currentTags.filter];
    newTags.push(e.target.textContent);
    handleTagsChange(newTags);
    setShowAllTags(false);
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
        <p className="absolute top-28 z-50 bg-blue-300 text-white w-52 h-auto scroll-auto">
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

export default FilterByTags;
