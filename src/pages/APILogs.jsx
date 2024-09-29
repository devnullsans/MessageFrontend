import React, { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import moment from "moment";
import SearchBarDropdown from "../components/SearchBarDropdown";
import ModalComponent from "../components/ModalComponent";
import VideoTutorialComponent from "../components/VideoTutorialComponent";
import GetHelpButton from "../components/GetHelpButton";

function APILogs() {
  const [isBlockEmailModalOpen, setIsBlockEmailModalOpen] = useState(false);

  // Define states
  const [cid, setCid] = useState(null);
  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState({
    showName: "All",
    name: null,
  });
  // Assuming `searchBy` and `searchType` are defined as part of some logic elsewhere

  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchBy, setSearchBy] = useState({
    showName: "Method",
    name: "method",
  });
  const handleBlockEmail = async (e) => {
    let formData;
    if (e.formData) {
      // If formData is passed in the event object, use it
      formData = e.formData;
    } else {
      // Otherwise, create FormData from the form element
      const form = e.target;
      formData = new FormData(form);

      // Convert FormData to a plain object
      formData = Object.fromEntries(formData.entries());
    }

    const email = formData.email;
    if (
      domain.name === "domain" &&
      !/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
        formData.email
      )
    ) {
      toast.error("Please match the format.\n Example: domain.com");
      return;
    }

    // Ensure that email is an array if it's not already
    const emailArray = Array.isArray(email) ? email : [email];
    formData.emails = emailArray;

    try {
      const response = await blockEmail(formData);

      setFetchRefresh(!fetchRefresh);
      setIsBlockEmailModalOpen(false);
    } catch (error) {
      console.error("Failed to block email:", error);
    }
  };
  // Columns for the TableComponent
  const columns = [
    // { label: "Company ID", key: "companyId" },
    {
      label: "Key",

      key: "key",
    },
    {
      label: "Request From",
      key: "browser",
    },
    { label: "Endpoint", key: "endpoint" },
    { label: "Method", key: "method" },
    { label: "IP", key: "ip" },
    // { label: "Status", key: "status" },
    // { label: "Error", key: "error" },
    {
      label: "Response",
      key: "response",
      alignValues: "left align-top p-0",

      stopProp: true,
      nosort: true,
      render: (entry, index) => (
        <div key={index}>
          <button
            type="button"
            className="btn btn-inverse-primary mt-1"
            data-bs-toggle="modal"
            data-bs-target={`#exampleModal${index}`} // Unique ID for each modal
            onClick={() => setIsBlockEmailModalOpen(true)}
          >
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              {entry.response || "N/A"}
            </div>
          </button>
          <ModalComponent
            isOpen={isBlockEmailModalOpen}
            handleClose={() => setIsBlockEmailModalOpen(false)}
            handleSubmit={() => {
              if (entry?.response) {
                // Copy the response to the clipboard
                navigator.clipboard
                  .writeText(
                    JSON.stringify(JSON.parse(entry.response), null, 2)
                  )
                  .then(() => {
                    toast.success("Response copied to clipboard.");
                  })
                  .catch((err) => {
                    console.error("Could not copy text: ", err);
                    toast.error("Could not copy text: ", err);
                  });
              }

              setIsBlockEmailModalOpen(false);
            }}
            title="Response"
            footerButtons={[
              {
                onClick: () => {
                  setIsBlockEmailModalOpen(false);
                },
                className: "btn-light",
                label: "Cancel",
              },
              {
                onClick: () => {
                  if (entry?.response) {
                    // Copy the response to the clipboard
                    navigator.clipboard
                      .writeText(
                        JSON.stringify(JSON.parse(entry.response), null, 2)
                      )
                      .then(() => {
                        toast.success("Response copied to clipboard.");
                      })
                      .catch((err) => {
                        console.error("Could not copy text: ", err);
                        toast.error("Could not copy text: ", err);
                      });
                  }

                  setIsBlockEmailModalOpen(false);
                },
                className: "btn-primary",
                label: "Copy",
                type: "submit",
              },
            ]}
          >
            {entry.response ? (
              <pre>
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(entry.response), null, 2);
                  } catch (error) {
                    return invalidJsonFormat;
                  }
                })()}
              </pre>
            ) : (
              "N/A"
            )}
          </ModalComponent>
        </div>
      ),
    },

    {
      label: "Updated At",
      key: "updatedAt",
      render: (entry) => moment(entry.updatedAt).format("MM/DD/YYYY LT"),
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (entry) => moment(entry.createdAt).format("MM/DD/YYYY LT"),
    },
  ];
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div>
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="apilogs"
        />
      )}
      <div className="d-flex flex-wrap justify-content-between mb-2">
        <h2>API Logs</h2>
        <div className="d-flex gap-2 flex-wrap">
          <SearchBarDropdown
            searchType={searchType}
            searchBy={searchBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setSearchType={setSearchType}
            setSearchBy={setSearchBy}
            searchByList={[
              { showName: "Method", name: "method" },
              { showName: "Endpoint", name: "endpoint" },
              { showName: "IP", name: "ip" },
            ]}
            DropdownItems={[
              { showName: "Like", name: "like" },
              { showName: "Exact", name: "exact" },
            ]}
          />
          <GetHelpButton
            toggle={toggle}
            settoggle={settoggle}
            videoInfoError={videoInfoError}
          />
        </div>
      </div>

      <TableComponent
        icon={false}
        columns={columns}
        route={"api-logs"}
        setcid={setCid}
        setN={setN}
        setP={setP}
        n={n}
        p={p}
        PaginationEnabled={true}
        noDataMessage="No API keys available"
        setPage={setPage}
        setperPage={setPerPage}
        perPage={perPage}
        page={page}
        fetchRefresh={fetchRefresh}
        setFetchRefresh={setFetchRefresh}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        searchBy={searchBy.name}
        searchType={searchType.name}
        searchValue={searchValue}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        routeLogic={`status=${filter.name}`}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default APILogs;
