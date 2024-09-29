import React, { useEffect, useRef } from "react";

function Dropdown({
  name,
  SummaryChild,
  dropdownList,
  commonFunction,
  borderRadius = 15,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.removeAttribute("open");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <details ref={dropdownRef} name={name} className="dropdown">
      <summary
        className="btn btn-primary w-100 d-flex justify-content-between gap-3 align-items-center p-0 m-0 px-3"
        style={{
          height: "48px",
          width: "fit-content",
          borderRadius: borderRadius,
        }}
      >
        {SummaryChild}
        <span className="material-symbols-outlined">expand_more</span>
      </summary>
      <ul
        style={{ borderRadius: 15, marginTop: 5, overflow: "hidden" }}
        className="dropdown-menu"
      >
        {dropdownList?.map((item, index) => (
          <li
            key={index}
            onClick={(e) => {
              item.seperateFunction
                ? item.seperateFunction()
                : commonFunction(item);
              e.currentTarget.closest("details").removeAttribute("open");
            }}
            className="dropdown-item"
          >
            {item.showName}
          </li>
        ))}
      </ul>
    </details>
  );
}

export default Dropdown;
