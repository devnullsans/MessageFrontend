import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { fetchSmtp, createSmtp, updateSmtp, setDefaultSmtp, deleteSmtp } from "../utils/smtp"; // Adjust the import path as needed
import TableComponent from "./TableComponent";
import Dropdown from "./Dropdown";
import { GlobalContext } from "../GlobalContext";
import { updateSettings } from "../utils/settings";
import { render } from "react-dom";

const SMTP = ({ settings, fetchSettingsData }) => {
  const [dropdownList, setDropdownList] = useState({
    showName: "None",
    name: "None",
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10 per page");
  const [totalPages, setTotalPages] = useState(0);
  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [verify, setVerify] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState("");

  // Define missing state variables
  const [smtpList, setSmtpList] = useState([]); // State to store the list of SMTP settings
  const [fetchRefresh, setFetchRefresh] = useState(false); // Example state for refreshing data
  const [searchValue, setSearchValue] = useState(""); // Example state for search value
  const GetDetail = async (id) => {
    try {
      const response = await fetchSmtp(id);
      setEditData(response);
      switch (response.secure) {
        case "STARTTLS":
          setDropdownList({ showName: "STARTTLS", name: "starttls" });
          break;
        case "SSL":
          setDropdownList({ showName: "SSL", name: "SSL" });
          break;
        case "TLS":
          setDropdownList({ showName: "TLS", name: "TLS" });
          break;
        default:
          setDropdownList({ showName: "None", name: "None" });
          break;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching SMTP configuration:", error);
    }
  };
  const PostDataServer = async (id = "", e) => {
    const formElement = e.target.closest("form");
    const formData = new FormData(formElement);

    try {
      if (id) {
        await updateSmtp(id, formData);
      } else {
        await createSmtp(formData);
      }
      setFetchRefresh(!fetchRefresh); // Refresh the list after creating/updating
      setEditData("");
      formElement.reset();
      setDropdownList({ showName: "None", name: "None" });
    } catch (error) {
      console.error("Error posting SMTP data:", error);
    }
  };

  const UpdateSettings = async (bool) => {
    try {
      const response = await updateSettings({
        ...settings[0],
        defaultSMTPServer: {
          ...settings[0].defaultSMTPServer,
          isGlobal: bool,
        },
      });

      fetchSettingsData();

      // Handle the verification result here (e.g., show a success message)
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const columns = [
    { label: "SMTP Name", key: "name" },
    { label: "SMTP Server", key: "host" },
    { label: "Port", key: "port" },
    { label: "Encryption", key: "secure" },
    { label: "From", key: "fromEmail" },

    { label: "From Name", key: "fromName" },
    {
      label: "Verified",
      key: "isVerified",
      render: (entry) => (entry.isVerified ? "Yes" : "No"),
    },
    {
      label: "Default",
      key: "default",
      stopProp: true,
      nosort: true,

      render: (entry) => {
        return (
          <div className="">
            <label onClick={(e) => e.stopPropagation()} htmlFor="def">
              <input
                type="radio"
                checked={entry.default}
                onChange={(e) => {
                  e.stopPropagation();
                  setDefaultSmtp(entry._id);
                  setFetchRefresh(!fetchRefresh);
                }}
              />
            </label>
          </div>
        );
      },
    },
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
      align: "end ",
      nosort: true,
      stopProp: true,
      render: (entry) => (
        <div className="text-end d-flex justify-content-end">
          <span
            onClick={(e) => {
              setEdit(true);
              GetDetail(entry._id);
              // No need to setFormData here
            }}
            className="material-symbols-outlined p-0 m-0 "
            style={{ cursor: "pointer" }}
          >
            edit
          </span>
          <span style={{ transform: "rotate(90deg)" }} className="material-symbols-outlined">
            horizontal_rule
          </span>
          <span
            onClick={(e) => {
              // Implement delete logic here
              deleteSmtp(entry._id).then(() => setFetchRefresh(!fetchRefresh));
            }}
            className="material-symbols-outlined p-0 m-0"
            style={{ cursor: "pointer" }}
          >
            delete
          </span>
        </div>
      ),
    },
  ];
  const [cid, setcid] = useState("");

  return (
    <div style={{ minHeight: 710 }} className="col-12 d-flex flex-wrap grid-margin stretch-card transparent">
      <div style={{ minHeight: 710 }} className="col-lg-12 col-md-12 gap-3 grid-margin stretch-card mt-3 transparent">
        <div className="card shadow p-0 m-0 h-100">
          <div className="card p-0 m-0 h-100">
            <h3
              style={{ borderRadius: "10px 10px 0 0" }}
              className="font-weight-bold d-flex bg-blue colorw p-0 m-0 pt-2 pb-2"
            >
              <p className="m-1 mt-2 pl-2 h3">Email Settings</p>
            </h3>

            <div className="card-body">
              <form onSubmit={(e) => PostDataServer(editData?._id, e)} className="p-4 bg-light border rounded">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mb-3">
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        defaultValue={editData.name}
                        name="name"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Host"
                        defaultValue={editData.host}
                        name="host"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <input
                        required
                        type="number"
                        className="form-control"
                        placeholder="Port"
                        defaultValue={editData.port}
                        name="port"
                      />
                    </div>

                    <input type="hidden" name="secure" defaultValue={editData.secure} value={dropdownList.name} />

                    <div className="form-group mb-3 d-flex gap-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        <h3 className="p-0 m-0">Security: </h3>
                        <Dropdown
                          name="security"
                          SummaryChild={<h5 className="p-0 m-0">{dropdownList.showName}</h5>}
                          dropdownList={[
                            { showName: "None", name: "None" },
                            { showName: "SSL", name: "SSL" },
                            { showName: "TLS", name: "TLS" },
                            { showName: "STARTTLS", name: "STARTTLS" },
                          ]}
                          commonFunction={setDropdownList}
                        />
                      </label>
                    </div>

                    <div className="form-group mb-3">
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        defaultValue={editData.userName}
                        name="userName"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <input
                        required
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        defaultValue={editData.password}
                        name="password"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <input
                        required
                        type="email"
                        className="form-control"
                        placeholder="From Email ID"
                        defaultValue={editData.fromEmail}
                        name="fromEmail"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="From Name"
                        defaultValue={editData.fromName}
                        name="fromName"
                      />
                    </div>

                    <div className="d-flex justify-content-start gap-3 mt-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          PostDataServer("", e);
                        }}
                      >
                        New SMTP Settings
                      </button>

                      {edit && (
                        <button type="submit" className="btn btn-primary">
                          Update SMTP Settings
                        </button>
                      )}

                      <button
                        type="reset"
                        className="btn btn-danger"
                        // Uncomment to handle the cancel button
                        onClick={() => {
                          setEdit(false);
                          setDropdownList({ showName: "None", name: "None" });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="toggle-radio-container d-flex gap-3">
              <label
                htmlFor="global"
                className={`radio-label ps-3 ${settings[0]?.defaultSMTPServer?.isGlobal ? "active" : ""}`}
              >
                <input
                  type="radio"
                  id="global"
                  name="settings"
                  value="true"
                  className="mx-2"
                  checked={settings[0]?.defaultSMTPServer?.isGlobal === true}
                  onChange={() => UpdateSettings(true)}
                />
                Global
              </label>
              <label
                htmlFor="local"
                className={`radio-label ${!settings[0]?.defaultSMTPServer?.isGlobal ? "active" : ""}`}
              >
                <input
                  type="radio"
                  id="local"
                  name="settings"
                  value="false"
                  className="mx-2"
                  checked={settings[0]?.defaultSMTPServer?.isGlobal === false}
                  onChange={() => UpdateSettings(false)}
                />
                Local
              </label>
            </div>
          </div>
          <div className="mx-3">
            <TableComponent
              route={"smtps"}
              icon={false}
              columns={columns}
              data={smtpList}
              page={page}
              perPage={perPage}
              totalPages={totalPages}
              setPage={setPage}
              setPerPage={setPerPage}
              setTotalPages={setTotalPages}
              setN={setN}
              fetchRefresh={fetchRefresh}
              setFetchRefresh={setFetchRefresh}
              setcid={setcid}
              n={n}
              p={p}
              setP={setP}
              noDataMessage="No emails available"
              PaginationEnabled={true}
              setperPage={setPerPage}
            />
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default SMTP;
