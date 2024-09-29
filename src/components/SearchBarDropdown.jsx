import React from "react";
import Dropdown from "./Dropdown";

function SearchBarDropdown({
  searchType,
  setSearchType,
  name,
  setSearchValue,
  searchBy,
  setSearchBy,
  searchByList,
  onlyOne = false,
}) {
  return (
    <div className="d-flex ">
      <Dropdown
        name="search"
        SummaryChild={
          <h5 style={{ width: "max-content" }} className="m-0">
            {searchType.showName}
          </h5>
        }
        dropdownList={[
          { showName: "Like", name: "like" },
          { showName: "Equal", name: "equal" },
          { showName: "Not Equal", name: "notEqual" },
        ]}
        commonFunction={setSearchType}
        borderRadius={"15px 0px 0px 15px"}
      />

      <div style={{ maxWidth: 200 }} className="input-icons w-100 p-0 m-0">
        <i className="icon-search icon"></i>
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          placeholder="Search"
          className="input-field"
          style={{ borderRadius: onlyOne ? "0 15px 15px 0" : "0px" }}
        />
      </div>

      {!onlyOne && (
        <Dropdown
          name="search"
          SummaryChild={
            <h5 style={{ width: "max-content" }} className="m-0">
              {searchBy.showName}
            </h5>
          }
          dropdownList={searchByList}
          commonFunction={setSearchBy}
          borderRadius={"0 15px 15px 0"}
        />
      )}
    </div>
  );
}

export default SearchBarDropdown;
