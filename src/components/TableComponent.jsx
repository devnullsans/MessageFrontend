import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import {
  fetchExportAllData,
  fetchExportData,
} from "../utils/TableComponentApi";
import moment from "moment";
import ModalComponent from "./ModalComponent";

function TableComponent({
  apicall = true,
  checkbox = true,
  Bulk,
  columns,
  route,
  n,
  p,
  setN,
  keyProp,
  value,
  noDataMessage = "No data available",
  fetchRefresh,
  PaginationEnabled = false,
  totalPages,
  setPage,
  perPage,
  setperPage,
  setP,
  page,
  setTotalPages,
  Dashboard,
  routeLogic,
  tableSticky = false,
  DeleteFun,
  setcid,
  dataRoute = false,
  icon = "delete",
  sort = true,
  searchType,
  searchBy,
  searchValue,
  dataAll = false,
  selectAll,
  setSelectAll,
}) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [load, setLoad] = useState(false);
  const [checkboxArray, setCheckboxArray] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [order, setOrder] = useState("");
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetchExportData(
        route,
        sortBy,
        order,
        n,
        p,
        searchType,
        searchBy,
        searchValue,
        routeLogic
      );
      setData(response.data);
      setCount(response.totalCount);
      setTotalPages(Math.floor(response.totalCount / n) || 1);
      setCheckboxArray([]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      dataAll ? setData(dataAll) : fetchData();
      dataAll ? setCount(dataAll.length) : setCount(count);
    }, 300); // Adjust the delay (300ms) as needed

    return () => clearTimeout(debounceTimeout);
  }, [
    p,
    n,
    routeLogic,
    keyProp,
    fetchRefresh,
    sortBy,
    order,
    searchType,
    searchBy,
    searchValue,
    dataAll,
  ]);

  const downloadDataView = () => {
    const selectedData =
      route === "apikey"
        ? checkboxArray.flatMap((checkboxid) =>
            data.filter((item) => item.APIs._id === checkboxid)
          )
        : checkboxArray.flatMap((checkboxid) =>
            data.filter(({ _id }) => _id === checkboxid)
          );

    const headers = Object.keys(flattenObject(selectedData[0]));
    let csvContent = headers.join(",") + "\n";
    selectedData.forEach((row) => {
      const flattenedRow = flattenObject(row);
      const values = headers.map((header) =>
        typeof flattenedRow[header] === "boolean"
          ? flattenedRow[header]
            ? "Yes"
            : "No"
          : flattenedRow[header] || ""
      );
      csvContent += values.join(",") + "\n";
    });

    downloadCSV(csvContent, `view_all_${route}_details.xlsx`);
  };

  const downloadDataAll = async () => {
    try {
      const dataExportAll = await fetchExportAllData(route);
      const headers = Object.keys(flattenObject(dataExportAll.data[0]));
      let csvContent = headers.join(",") + "\n";
      dataExportAll.data.forEach((row) => {
        const flattenedRow = flattenObject(row);
        const values = headers.map((header) => flattenedRow[header] || "");
        csvContent += values.join(",") + "\n";
      });

      downloadCSV(csvContent, `view_all_${route}_details.xlsx`);
    } catch (error) {
      console.error("Error exporting all data:", error);
    }
  };

  const flattenObject = (obj) => {
    let flattened = {};
    function recurse(current, parentKey) {
      for (let key in current) {
        let newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof current[key] === "object" && current[key] !== null) {
          recurse(current[key], newKey);
        } else {
          flattened[newKey] = current[key];
        }
      }
    }
    recurse(obj);
    return flattened;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    DeleteFun(checkboxArray, true);
    setCheckboxArray([]);
    setIsDeleteModalOpen(false);
  };
  return (
    <div>
      {checkboxArray.length > 0 && (
        <div className="col-md-12 my-2 stretch-card p-0">
          <div
            style={{
              backgroundColor: "#d8e3fb",
              borderRadius: 5,
            }}
            className="card  "
          >
            <div className="card-body p-0 py-2 d-flex  col-md-12 col-12 col-sm-12 flex-column flex-md-row justify-content-end align-items-center">
              {checkboxArray.length == data.length && data.length !== 0 && (
                <div
                  style={{ flex: 1.5 }}
                  className=" col-md-12 col-12 col-sm-12  justify-content-custom align-items-center p-0 "
                >
                  {!selectAll && checkboxArray.length !== count && (
                    <p className="p-0 m-0">
                      &nbsp;&nbsp;Data ({checkboxArray.length}) on this page is
                      selected.&nbsp;&nbsp;
                    </p>
                  )}
                  {!selectAll && checkboxArray.length !== count ? (
                    <a
                      onClick={() => {
                        setSelectAll(true);
                        // selectAll &&
                        setCheckboxArray(data.map((item) => item._id));
                      }}
                      className="p-0 m-0"
                    >
                      {`Select all ${count} data `}
                    </a>
                  ) : (
                    <p className="p-0 m-0">Selected All ({count}) data.</p>
                  )}
                </div>
              )}
              <div
                style={{ flex: 1 }}
                className="d-flex col-md-12 col-12 col-sm-12  justify-content-between align-items-center "
              >
                <a
                  onClick={() => {
                    setSelectAll(!selectAll);
                    setCheckboxArray([]);
                  }}
                  className=""
                >
                  Clear all
                </a>
                <div className="d-flex">
                  <strong
                    style={{ textDecoration: "underline" }}
                    className="hover-text p-0 m-0 hover"
                  >
                    <span
                      onClick={() =>
                        selectAll ? downloadDataAll() : downloadDataView()
                      }
                      className="material-symbols-outlined"
                    >
                      upgrade
                    </span>
                  </strong>

                  {icon && (
                    <span
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="material-symbols-outlined"
                    >
                      {icon}
                    </span>
                  )}

                  <ModalComponent
                    isOpen={isDeleteModalOpen}
                    handleClose={() => setIsDeleteModalOpen(false)}
                    handleSubmit={handleDelete}
                    title="Confirm Deletion"
                    footerButtons={[
                      {
                        onClick: () => setIsDeleteModalOpen(false),
                        className: "btn-light",
                        label: "Cancel",
                      },
                      {
                        onClick: handleDelete,
                        className: "btn-danger", // Changed to indicate danger action
                        label: "Delete",
                        type: "submit",
                      },
                    ]}
                  >
                    <div>
                      <p>
                        Are you sure you want to{" "}
                        {`${icon == false ? "delete" : "unblock"}`} the selected
                        items?
                      </p>
                    </div>
                  </ModalComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="col-md-12  stretch-card px-0">
        <div className="card">
          <div className="card-body p-0 m-0">
            <div
              style={{ borderRadius: "10px", maxHeight: tableSticky }}
              className="table-responsive"
            >
              <table className={`table`}>
                <thead
                  style={{
                    position: "sticky",
                    zIndex: 1,
                    top: 0,
                  }}
                  className="bg-primary "
                >
                  <tr className="bg-primary">
                    {checkbox && (
                      <th>
                        <input
                          type="checkbox"
                          className="p-0 m-0"
                          checked={
                            data && count
                              ? checkboxArray.length === data.length
                              : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCheckboxArray(data.map((item) => item._id));
                            } else {
                              setCheckboxArray([]);
                              setSelectAll(false);
                            }
                          }}
                        />
                      </th>
                    )}

                    {columns.map((col, index) => (
                      <th
                        onClick={(e) => {
                          if (col.nosort) return;
                          if (sort) {
                            setOrder(order === "asc" ? "desc" : "asc");
                            setSortBy(col.key);
                          }
                        }}
                        key={index}
                        className={`${!col.nosort && "hover"}  text-${
                          load || col.align ? col.align : "left"
                        } `}
                      >
                        <span
                          className={`d-flex align-items-center gap-2 justify-content-${
                            col.align ? col.align : "start"
                          }`}
                        >
                          <p className="fs-5 p-0 m-0">{col.label}</p>
                          {!col.nosort && (
                            <span
                              style={{
                                opacity: col.key === sortBy ? 1 : 0.5,
                              }}
                              className="material-symbols-outlined"
                            >
                              {order === "asc"
                                ? "arrow_downward"
                                : "arrow_upward"}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                {data && data.length > 0 && !load ? (
                  <tbody>
                    {data.map((entry, i) => (
                      <tr
                        onClick={(e) => {
                          const id =
                            route == "apikey" ? entry.APIs._id : entry._id;
                          !checkboxArray.includes(id)
                            ? setCheckboxArray([...checkboxArray, id])
                            : setCheckboxArray(
                                checkboxArray.filter((id) => id !== id)
                              );
                          !checkboxArray.includes(id) && setSelectAll(false);
                        }}
                        key={i}
                      >
                        {checkbox && (
                          <td>
                            <input
                              type="checkbox"
                              checked={checkboxArray.includes(entry._id)}
                              onChange={(e) => {
                                const APIId = entry._id;
                                e.stopPropagation();
                                e.target.checked
                                  ? setCheckboxArray([...checkboxArray, APIId])
                                  : setCheckboxArray(
                                      checkboxArray.filter((id) => id !== APIId)
                                    );
                                !e.target.checked && setSelectAll(false);
                              }}
                            />
                          </td>
                        )}

                        {columns.map((col, index) => (
                          <td
                            key={index}
                            className={`text-${
                              col.alignValues ? col.alignValues : "left"
                            }`}
                            onClick={(e) => {
                              col.stopProp && e.stopPropagation();
                            }}
                          >
                            {col.render
                              ? col.render(entry)
                              : col.key
                                  .split(".")
                                  .reduce((obj, key) => obj[key], entry)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    {Array.from({ length: n }).map((_, index) =>
                      load ? (
                        <tr key={index} className="p-0 m-0">
                          <td className="">{/* <Skeleton height={27} /> */}</td>

                          {columns.map((col, colIndex) => (
                            <td key={colIndex}>
                              {/* <Skeleton height={27} /> */}
                            </td>
                          ))}
                        </tr>
                      ) : (
                        <tr key={index}>
                          <td
                            style={{ border: "none" }}
                            colSpan={columns.length + 1}
                            className="text-center"
                          >
                            {index === Math.floor(n / 2) && (
                              <button
                                className="btn btn-outline-primary"
                                disabled
                              >
                                {load ? "Loading..." : noDataMessage}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                )}
              </table>
            </div>
            <div className="totals-section">
              <div className="totals-row gap-3">
                <div className="d-flex gap-1">
                  <div className="totals-label">Total :</div>
                  <div className="totals-value">{count ? count : 0}</div>
                </div>
              </div>
              {/* Add more totals as needed */}
            </div>
          </div>
        </div>
      </div>

      {PaginationEnabled && !Dashboard && (
        <Pagination
          totalPages={totalPages}
          p={p}
          setP={setP}
          setPage={setPage}
          perPage={perPage}
          setperPage={setperPage}
          setN={setN}
          page={page}
          setTotalPages={setTotalPages}
        />
      )}
    </div>
  );
}

export default TableComponent;
