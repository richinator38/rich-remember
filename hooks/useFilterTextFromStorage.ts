import { Constants } from "@/constants/constants";

export const useFilterTextFromStorage = () => {
  let filterState: string = '';

  if (typeof window !== "undefined") {
    const filterStr = localStorage.getItem(
      Constants.LocalStorageKeys.FilterText
    );
    if (filterStr && filterStr.length > 0) {
      filterState = filterStr;
    }
  }

  return filterState;
};
