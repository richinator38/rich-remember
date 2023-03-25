import { Constants } from "@/constants/constants";
import { useFilterTagsFromStorage } from "@/hooks/useFilterTagsFromStorage";
import { useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

export interface FilterState {
  filter: string[];
}
export interface FilterByTagsProps {
  onFilterChange: (tags: string[]) => void;
}

const FilterByTags = (props: FilterByTagsProps) => {
  const filterState = useFilterTagsFromStorage();
  const [currentTags, setCurrentTags] = useState<FilterState>(filterState);

  const handleTagsChange = (tags: string[]) => {
    setCurrentTags({ filter: tags });

    localStorage.setItem(
      Constants.LocalStorageKeys.FilterTags,
      JSON.stringify({ filter: tags })
    );

    props.onFilterChange(tags);
  };

  const handleValidate = (value: string) => value?.length > 0;

  return (
    <TagsInput
      value={currentTags.filter}
      onChange={handleTagsChange}
      inputProps={{
        className: "react-tagsinput-input",
        placeholder: "Filter tags",
      }}
      onlyUnique={true}
      addOnBlur={true}
      validate={handleValidate}
    />
  );
};

export default FilterByTags;
