import React, { useEffect, useState, useRef, useContext } from "react";
import moment from "moment";
import * as XLSX from "xlsx"; // Import XLSX for Excel file parsing

import TableComponent from "../components/TableComponent";
import { blockEmail, unblockEmail, sendEmail } from "../utils/emailApi";
import SearchBarDropdown from "../components/SearchBarDropdown";
import ModalComponent from "../components/ModalComponent";
import Dropdown from "../components/Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";
import toast from "react-hot-toast";
import { blockIP, unblockIP } from "../utils/ip";
import ButtonHeader from "../components/ButtonHeader";
import MobileNumber from "./MobileNumber";
import VideoTutorialComponent from "../components/VideoTutorialComponent";
import GetHelpButton from "../components/GetHelpButton";

const Project = ({ isEmail, isIp, BlockedData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pid } = location.state;

  const [searchBy, setSearchBy] = useState({
    showName: "Email ID",
    name: "email",
  });
  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isBlockEmailModalOpen, setIsBlockEmailModalOpen] = useState(false);

  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [domain, setDomain] = useState({
    showName: "Email ID",
    name: "email",
  });

  const modalRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [count, setCount] = useState(0);
  const [cid, setcid] = useState("");
  const [isBlockIpModalOpen, setIsBlockIpModalOpen] = useState(false);

  const [fetchRefresh2, setFetchRefresh2] = useState(false);

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

    // Ensure that email is an array if it's not already
    const emailArray = Array.isArray(email) ? email : [email];
    formData.emails = emailArray;
    formData.pid = pid;

    try {
      const response = await blockEmail(formData);

      setFetchRefresh(!fetchRefresh);
      setIsBlockEmailModalOpen(false);
    } catch (error) {
      console.error("Failed to block email:", error);
    }
  };

  const handleUnblockEmail = async (email) => {
    try {
      // Convert email to an array
      const emailArray = Array.isArray(email) ? email : [email];

      const response = await unblockEmail({
        email: emailArray,
        pid: pid,
        selectAll,
      });
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Failed to unblock email:", error);
    }
  };

  const { companyData } = useContext(GlobalContext);

  const columns = [
    {
      label: "Email ID",
      key: "email",
      render: (entry) => (
        <div
          className={`${BlockedData && BlockedData.includes(entry.email) && "text-success"}`}
        >
          {BlockedData && BlockedData.includes(entry.email)
            ? `${entry.email} (Recently Added)`
            : entry.email}
        </div>
      ),
    },
    {
      label: "Domain",
      key: "domainLevel",
      render: (entry) => (
        <div className="text-capitalize">{entry.domainLevel}</div>
      ),
    },
    {
      label: "Blocked At",
      key: "createdAt",
      render: (entry) => moment(entry.createdAt).format("MM/DD/YYYY LT"),
    },
    {
      label: "Actions",
      key: "action",
      align: "end",
      nosort: true,
      isProp: true,
      render: (entry) => (
        <div className="text-end">
          {companyData?.email !== entry.email &&
            (entry.status === "blocked" ? (
              <span
                onClick={() => handleUnblockEmail(entry._id)}
                className="material-symbols-outlined"
                style={{ cursor: "pointer" }}
              >
                {entry.status === "blocked" ? "lock_open" : "lock_open"}
              </span>
            ) : (
              <span className="text-success text-end">Admin</span>
            ))}
        </div>
      ),
    },
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when items per page changes
  };
  const handleItemsPerPageChange2 = (event) => {
    setItemsPerPage2(parseInt(event.target.value, 10));
    setCurrentPage2(1); // Reset to first page when items per page changes
  };
  const handleBlockIp = async (e) => {
    let formData;

    if (e.formData) {
      formData = e.formData;
    } else {
      const form = e.target;
      formData = new FormData(form);
      formData = Object.fromEntries(formData.entries());
    }

    const ip = formData.ip;

    const ipArray = Array.isArray(ip) ? ip : [ip];
    formData.ips = ipArray;
    formData.pid = pid;

    try {
      const response = await blockIP(formData);

      setFetchRefresh2(!fetchRefresh2);
      setIsBlockIpModalOpen(false);
    } catch (error) {
      console.error("Failed to block IP:", error);
    }
  };
  const handleUnblockIp = async (ip) => {
    try {
      const ipArray = Array.isArray(ip) ? ip : [ip];

      const response = await unblockIP({
        ips: ipArray,
        selectAll: selectAll2,
        pid,
      });
      setFetchRefresh2(!fetchRefresh2);
    } catch (error) {
      console.error("Failed to unblock IP:", error);
    }
  };

  const columnsIP = [
    {
      label: "IP",
      key: "ip",
      render: (entry) => (
        <div
          className={`${BlockedData && BlockedData.includes(entry.ip) && "text-success"}`}
        >
          {BlockedData && BlockedData.includes(entry.ip)
            ? `${entry.ip} (Recently Added)`
            : entry.ip}
        </div>
      ),
    },
    {
      label: "Blocked At",
      key: "createdAt",
      render: (entry) => moment(entry.createdAt).format("MM/DD/YYYY LT"),
    },
    {
      label: "Actions",
      key: "action",
      align: "end",
      nosort: true,
      render: (entry) => (
        <div className="text-end">
          <span
            onClick={() => handleUnblockIp(entry._id)}
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
          >
            {entry.status === "blocked" ? "lock_open" : "lock_open"}
          </span>
        </div>
      ),
    },
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [selectAll2, setSelectAll2] = useState(false);
  const [searchBy2, setSearchBy2] = useState({
    showName: "IP",
    name: "ip",
  });
  const [searchType2, setSearchType2] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchValue2, setSearchValue2] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const [itemsPerPage2, setItemsPerPage2] = useState(5);
  const [totalPages2, setTotalPages2] = useState(1);
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className="blocklist-container">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="project"
        />
      )}
      {!(isIp || isEmail) && (
        <div className="d-flex flex-wrap mb-2 justify-content-between">
          <h2>Project Level Email Blocklist</h2>
          <div className="d-flex flex-wrap gap-2">
            <SearchBarDropdown
              searchType={searchType}
              setSearchType={setSearchType}
              name="search"
              setSearchValue={setSearchValue}
              searchBy={searchBy}
              setSearchBy={setSearchBy}
              searchByList={[{ showName: "Email", name: "email" }]}
              onlyOne={true}
            />
            <ButtonHeader
              onClick={() =>
                navigate("/bulk-project-email-upload", {
                  state: { pid: pid },
                })
              }
              text="Upload Bulk Email IDs"
              icon="upload"
            />
            <ButtonHeader
              onClick={() => setIsBlockEmailModalOpen(true)}
              text="Add Email ID"
            />
            <GetHelpButton
              toggle={toggle}
              settoggle={settoggle}
              videoInfoError={videoInfoError}
            />
          </div>
        </div>
      )}
      <ModalComponent
        isOpen={isBlockEmailModalOpen}
        handleClose={() => setIsBlockEmailModalOpen(false)}
        handleSubmit={handleBlockEmail}
        title="Block Email"
        modalRef={modalRef}
        footerButtons={[
          {
            onClick: () => setIsBlockEmailModalOpen(false),
            className: "btn-light",
            label: "Cancel",
          },
          {
            onClick: handleBlockEmail,
            className: "btn-primary",
            label: "Block",
            type: "submit",
          },
        ]}
      >
        <div>
          <Dropdown
            name="search"
            SummaryChild={<h5 className="p-0 m-0">{domain.showName}</h5>}
            dropdownList={[
              { showName: "Email ID", name: "email" },
              { showName: "Domain", name: "domain" },
              { showName: "TLD", name: "TLD" },
            ]}
            commonFunction={setDomain}
          />
          <label className="font-weight-bold" htmlFor="email">
            Email ID
            <input
              className="form-control border-primary "
              type="email"
              name="email"
              placeholder="Email ID"
              required
            />
          </label>

          <input type="text" name="domainLevel" value={domain.name} hidden />

          {/* <input type="text" name="reason" placeholder="Reason" /> */}
        </div>
      </ModalComponent>
      {/* Email Blocklist Table */}
      {!isIp && (
        <TableComponent
          checkbox={!isEmail}
          columns={isEmail ? columns.splice(0, 2) : columns}
          searchBy={searchBy.name}
          route={"emails"}
          searchType={searchType.name}
          searchValue={searchValue}
          fetchRefresh={fetchRefresh}
          setFetchRefresh={setFetchRefresh}
          noDataMessage="No data available"
          PaginationEnabled={true}
          n={itemsPerPage}
          p={currentPage}
          setN={setItemsPerPage}
          setP={setCurrentPage}
          keyProp="name"
          value=""
          setPage={handlePageChange}
          setPerPage={handleItemsPerPageChange}
          perPage={itemsPerPage}
          page={currentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          DeleteFun={handleUnblockEmail} // Implement delete logic if needed
          setcid={setcid} // Implement setCid logic if needed
          routeLogic={`pid=${pid}`}
          icon="lock_open"
          selectAll={selectAll}
          setSelectAll={setSelectAll}
        />
      )}
      <br />
      {/* File Upload */}
      {!(isIp || isEmail) && (
        <div className="d-flex flex-wrap my-2 justify-content-between">
          <h2>Project Level IP Blocklist</h2>
          <div className="d-flex flex-wrap gap-2">
            <SearchBarDropdown
              searchType={searchType2}
              setSearchType={setSearchType2}
              name="search"
              setSearchValue={setSearchValue2}
              searchBy={searchBy2}
              setSearchBy={setSearchBy2}
              searchByList={[{ showName: "IP", name: "ip" }]}
              onlyOne={true}
            />
            <ButtonHeader
              onClick={() =>
                navigate("/bulk-project-ip-upload", { state: { pid: pid } })
              }
              text="Upload Bulk Ips"
              icon="upload"
            />
            <ButtonHeader
              onClick={() => setIsBlockIpModalOpen(true)}
              text="Add IP"
            />
          </div>
        </div>
      )}
      <ModalComponent
        isOpen={isBlockIpModalOpen}
        handleClose={() => setIsBlockIpModalOpen(false)}
        handleSubmit={handleBlockIp}
        title="Block IP"
        modalRef={modalRef}
        footerButtons={[
          {
            onClick: () => setIsBlockIpModalOpen(false),
            className: "btn-light",
            label: "Cancel",
          },
          {
            onClick: handleBlockIp,
            className: "btn-primary",
            label: "Block",
            type: "submit",
          },
        ]}
      >
        <div>
          <label className="font-weight-bold" htmlFor="ip">
            IP Address
            <input
              className="form-control border-primary "
              type="text"
              name="ip"
              placeholder="IP Address"
              required
            />
          </label>
        </div>
      </ModalComponent>
      {!isEmail && (
        <TableComponent
          checkbox={!isIp}
          columns={isIp ? columnsIP.splice(0, 2) : columnsIP}
          route={"ip"} // Update route for IPs
          searchBy={searchBy2.name}
          searchType={searchType2.name}
          searchValue={searchValue2}
          fetchRefresh={fetchRefresh2}
          setFetchRefresh={setFetchRefresh2}
          n={itemsPerPage2}
          p={currentPage2}
          setN={setItemsPerPage2}
          setP={setCurrentPage2}
          setPage={setCurrentPage2}
          setPerPage={handleItemsPerPageChange2}
          perPage={itemsPerPage2}
          page={currentPage2}
          totalPages={totalPages2}
          setTotalPages={setTotalPages2}
          noDataMessage="No data available"
          PaginationEnabled={true}
          keyProp="ip" // Update keyProp for IPs
          value=""
          DeleteFun={handleUnblockIp} // Implement delete logic if needed
          setcid={setcid} // Implement setCid logic if needed
          routeLogic={`pid=${pid}`}
          icon="lock_open" // Or another icon if appropriate
          selectAll={selectAll2}
          setSelectAll={setSelectAll2}
        />
      )}
      <MobileNumber pid={pid} title={"Project Level Mobile Number Blocklist"} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Project;
