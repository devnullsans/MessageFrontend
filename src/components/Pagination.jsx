import { useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";

const Pagination = ({
  totalPages,
  setTotalPages,
  setP,
  perPage,
  p,
  setperPage,
  setN,
}) => {
  useEffect(() => {
    if (!p) {
      setP(1);
    }
    if (!totalPages) {
      setTotalPages(1);
    }
  }, []);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 10;
    let startPage = Math.max(1, p - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
    if (totalPages <= maxPageNumbers) {
      startPage = 1;
      endPage = totalPages;
    } else if (p <= Math.floor(maxPageNumbers / 2)) {
      endPage = maxPageNumbers;
    } else if (p + Math.floor(maxPageNumbers / 2) >= totalPages) {
      startPage = totalPages - maxPageNumbers + 1;
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${p === i ? "active" : ""}`}>
          <button
            style={{ zIndex: 0 }}
            className="page-link"
            onClick={() => setP(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };
  const handlePreviousClick = () => {
    if (p > 1) {
      setP(p - 1);
    }
  };
  const handleNextClick = () => {
    if (p < totalPages) {
      setP(p + 1);
    }
  };
  // const modalRef = useRef();
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {

  //       // setPage(
  //       //   !(modalRef.current && !modalRef.current.contains(event.target))
  //       // );
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const handleToggle = (event) => {
    // The event.detail property indicates the number of times the <details> element has been opened.
    // If it is 0, it means it is closing, otherwise it is opening.
    setOpen(event.target.open);
  };
  const [open, setOpen] = useState(false);
  const handleItemClick = (label, limit) => {
    setperPage(label);
    setN(limit);
    setP(1);
    setOpen(false); // Close the dropdown state
  };
  const [pageDropdown, setPageDropdown] = useState({
    showName: "10 Item Per Page",
    name: 10,
  });
  useEffect(() => {
    setN(pageDropdown.name);
    setP(1);
  }, [pageDropdown]);
  return (
    <>
      <div className=" ">
        <h3 className="font-weight-bold">
          <div className="col-md-12 mt-4 justify-content-center">
            <div className="text-center">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button
                      className="page-link"
                      aria-label="Previous"
                      onClick={handlePreviousClick}
                    >
                      <span aria-hidden="true">
                        <b>« Prev</b>
                      </span>
                    </button>
                  </li>
                  {renderPageNumbers()}
                  <li className="page-item">
                    <button
                      className="page-link"
                      aria-label="Next"
                      onClick={handleNextClick}
                    >
                      <span aria-hidden="true">
                        <b>Next »</b>
                      </span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="d-flex col-md-12 justify-content-between p-0 m-0">
            <div
              style={{
                position: "relative",
              }}
              className=""
            >
              <Dropdown
                name="search"
                SummaryChild={
                  <h5 style={{ width: "max-content" }} className="m-0">
                    {pageDropdown.showName}
                  </h5>
                }
                dropdownList={[
                  {
                    showName: "1 Item Per Page",
                    name: 1,
                  },
                  {
                    showName: "5 Item Per Page",
                    name: 5,
                  },
                  {
                    showName: "10 Item Per Page",
                    name: 10,
                  },
                  {
                    showName: "15 Item Per Page",
                    name: 15,
                  },
                  {
                    showName: "20 Item Per Page",
                    name: 20,
                  },
                ]}
                commonFunction={setPageDropdown}
                borderRadius={"15px"}
              />
            </div>
            <div className="text-end mt-3">
              <p className="h5 pe-2">
                Page {p} of {totalPages}
              </p>
            </div>
          </div>
        </h3>
      </div>
    </>
  );
};
export default Pagination;
