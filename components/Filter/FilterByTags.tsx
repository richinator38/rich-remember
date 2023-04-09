import { Constants } from "@/constants/constants";
import { useFilterTagsFromStorage } from "@/hooks/useFilterTagsFromStorage";
import { useEffect } from "react";
import { UITagEntry, UITagEntryProps } from "../UI/UITagEntry";

const FilterByTags = (props: UITagEntryProps) => {
  const filterState = useFilterTagsFromStorage();

  const handleTagsChange = (tags: string[]) => {
    localStorage.setItem(
      Constants.LocalStorageKeys.FilterTags,
      JSON.stringify({ filter: tags })
    );

    if (props.onTagsChanged) {
      props.onTagsChanged(tags);
    }
  };

  useEffect(() => {
    // If we have a filter from state, make sure to handle it so we see the filtering.
    if (filterState?.filter?.length > 0) {
      handleTagsChange(filterState.filter);
    }
  }, []);

  return (
    <UITagEntry
      onTagsChanged={handleTagsChange}
      initialTags={filterState.filter}
    />
  );
};

export default FilterByTags;
