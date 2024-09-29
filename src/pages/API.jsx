import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { deleteApiKey, generateApi } from "../utils/generateApi";
import SearchBarDropdown from "../components/SearchBarDropdown";
import TableComponent from "../components/TableComponent";
import ModalComponent from "../components/ModalComponent";
import ButtonHeader from "../components/ButtonHeader";
import toast from "react-hot-toast";
import VideoTutorialComponent from "../components/VideoTutorialComponent";
import GetHelpButton from "../components/GetHelpButton";

const API = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cid, setcid] = useState("");

  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchBy, setSearchBy] = useState({
    showName: "API Key",
    name: "APIKey",
  });
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10 per page");
  const [totalPages, setTotalPages] = useState(0);

  const handleGenerateApi = async (e) => {
    e.preventDefault();
    try {
      const response = await generateApi();
      if (response.data.ApiKey) {
        setShowAddModal(response.data.ApiKey);
        setFetchRefresh(!fetchRefresh);
      }
    } catch (error) {
      console.error("Failed to generate API key:", error);
    }
  };

  const handleApiKeySelect = (apiKeyId) => {
    setDeleteSelected(null);
    setSelectedApiKey(apiKeys.find((key) => key._id === apiKeyId));
  };

  const handleUpdateApiKey = async (e) => {
    e.preventDefault();
    if (!selectedApiKey) return;
    const formData = new FormData(e.target);
    const updatedApiKey = Object.fromEntries(formData.entries());

    try {
      await updateApiKeyDetails(selectedApiKey._id, updatedApiKey);
      setFetchRefresh(!fetchRefresh);
      setSelectedApiKey(null);
    } catch (error) {
      console.error("Failed to update API key:", error);
    }
  };

  const handleApiKeyDelete = async () => {
    try {
      await deleteApiKey({ id: deleteSelected });
      setFetchRefresh(!fetchRefresh);
      setDeleteSelected(null);
    } catch (error) {
      console.error("Failed to delete API key:", error);
    }
  };
  const handleApiKeyDeleteBulk = async (data) => {
    try {
      await deleteApiKey({ id: data, selectAll });
      setFetchRefresh(!fetchRefresh);
      setDeleteSelected(null);
    } catch (error) {
      console.error("Failed to delete API key:", error);
    }
  };

  const columns = [
    { label: "API Key", key: "APIKey" },
    {
      label: "Created At",
      key: "createdAt",
      render: (entry) => moment(entry.createdAt).format("MM/DD/YYYY LT"),
    },
    {
      label: "Updated At",
      key: "updatedAt",
      render: (entry) => moment(entry.updatedAt).format("MM/DD/YYYY LT"),
    },
    {
      label: "Actions",
      key: "action",
      align: "end",
      nosort: true,
      stopProp: true,
      render: (entry) => (
        <div className="d-flex justify-content-end">
          <span
            onClick={() => setDeleteSelected(entry._id)}
            className="material-symbols-outlined"
          >
            delete
          </span>
        </div>
      ),
    },
  ];

  const handleCancel = () => setSelectedApiKey(null);
  const handleDeleteCancel = () => setDeleteSelected(null);
  const handleClose = () => setShowAddModal(false);
  const [selectAll, setSelectAll] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className="api-keys-container">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="api"
        />
      )}
      <div className="d-flex flex-wrap justify-content-between mb-2">
        <h2>API Keys</h2>
        <div className="d-flex gap-2 flex-wrap">
          {/* Search Bar */}
          <SearchBarDropdown
            searchType={searchType}
            searchBy={searchBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setSearchType={setSearchType}
            setSearchBy={setSearchBy}
            // searchByList={[
            //   { showName: "API Key", name: "APIKey" },
            //   { showName: "Created At", name: "createdAt" },
            //   { showName: "Updated At", name: "updatedAt" },
            // ]}
            onlyOne={true}
            DropdownItems={[
              { showName: "Like", name: "like" },
              { showName: "Exact", name: "exact" },
            ]}
          />
          <ButtonHeader
            onClick={() => setShowAddModal(true)}
            text="Generate API"
          />
          <GetHelpButton
            toggle={toggle}
            settoggle={settoggle}
            videoInfoError={videoInfoError}
          />
        </div>
      </div>

      {/* API Keys List with Pagination */}
      <TableComponent
        columns={columns}
        data={apiKeys}
        route={"api-keys"}
        setcid={setcid}
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
        DeleteFun={handleApiKeyDeleteBulk}
        setTotalPages={setTotalPages}
        searchBy={searchBy.name}
        searchType={searchType.name}
        searchValue={searchValue}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />

      {/* Add API Key Modal */}
      <ModalComponent
        isOpen={!!showAddModal}
        handleClose={handleClose}
        handleSubmit={
          showAddModal?.length === 24 ? handleClose : handleGenerateApi
        }
        title="Generate API Key"
        footerButtons={[
          showAddModal?.length !== 24 && {
            onClick: handleClose,
            className: "btn-light",
            type: "button",
            label: "Cancel",
          },
          {
            onClick:
              showAddModal?.length === 24 ? handleClose : handleGenerateApi,
            className: "btn-primary",
            label: showAddModal?.length === 24 ? "Close" : "Generate",
            type: "submit",
          },
        ]}
      >
        {showAddModal?.length === 24 ? (
          <div>
            <p>API key generated successfully!</p>

            <div
              style={{
                width: "100%",
                border: "1px solid gray",
                borderRadius: 15,
                padding: 5,
              }}
              onClick={() => {
                navigator.clipboard.writeText(showAddModal);
                toast.success("Copied to clipboard");
              }}
              className="d-flex align-items-center justify-content-between px-3 my-3"
            >
              <input
                type="text"
                value={showAddModal}
                readOnly
                style={{
                  border: "none",
                  minWidth: 250,
                  minHeight: 48,
                }}
              />

              <span
                className="material-symbols-outlined ml-2 p-0 m-0"
                role="button"
              >
                content_copy
              </span>
            </div>
            <p className="text-warning">
              Copy this key as it won't be visible again.
            </p>
          </div>
        ) : (
          <p>Click "Generate" to create a new API key.</p>
        )}
      </ModalComponent>

      {/* Edit API Key Modal */}
      <ModalComponent
        isOpen={!!selectedApiKey}
        handleClose={handleCancel}
        handleSubmit={handleUpdateApiKey}
        title="Edit API Key"
        footerButtons={[
          { onClick: handleCancel, className: "btn-light", label: "Cancel" },
          {
            onClick: handleUpdateApiKey,
            className: "btn-primary",
            label: "Update",
            type: "submit",
          },
        ]}
      >
        <input
          type="text"
          name="name"
          placeholder="Update API Key Name"
          defaultValue={selectedApiKey?.name}
          required
        />
      </ModalComponent>

      {/* Delete API Key Modal */}
      <ModalComponent
        isOpen={!!deleteSelected}
        handleClose={handleDeleteCancel}
        handleSubmit={handleApiKeyDelete}
        title="Delete API Key"
        footerButtons={[
          {
            onClick: handleDeleteCancel,
            className: "btn-light",
            label: "Cancel",
          },
          {
            onClick: handleApiKeyDelete,
            className: "btn-danger",
            label: "Delete",
            type: "submit",
          },
        ]}
      >
        <p>Are you sure you want to delete this API key?</p>
      </ModalComponent>
    </div>
  );
};

export default API;
