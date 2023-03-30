import { FilterState } from "@/components/UI/UITagEntry";
import { Constants } from "@/constants/constants";

export const useFilterTagsFromStorage = () => {
  let filterState: FilterState = { filter: [] };
  if (typeof window !== "undefined") {
    const filterStr = localStorage.getItem(
      Constants.LocalStorageKeys.FilterTags
    );
    if (filterStr && filterStr.length > 0) {
      filterState = JSON.parse(filterStr) as FilterState;
    }
  }

  return filterState;
};
