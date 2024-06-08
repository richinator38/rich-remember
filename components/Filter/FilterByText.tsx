import { Constants } from "@/constants/constants";
import { useFilterTextFromStorage } from "@/hooks/useFilterTextFromStorage";
import { ChangeEvent, useEffect, useState } from "react";

export interface FilterByTextProps {
  onTextChanged: (text: string) => void;
}

const FilterByText = (props: FilterByTextProps) => {
  const currentTextFilter = useFilterTextFromStorage();
  const [filterText, setFilterText] = useState<string>(currentTextFilter);

  useEffect(() => {
    props.onTextChanged(filterText);
  }, [filterText]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem(
      Constants.LocalStorageKeys.FilterText,
      e.target.value
    );

    setFilterText(e.target.value);
  };

  return (
    <div>
      <input
        className="h-12 p-1 border border-zinc-300"
        style={{ width: "100%" }}
        type="text"
        id="filter_text"
        placeholder="Filter bookmarks by text"
        onChange={handleFilterChange}
        value={filterText}
        maxLength={100}
      />
    </div>
  );
};

export default FilterByText;
