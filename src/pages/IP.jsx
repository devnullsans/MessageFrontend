import { useState, useEffect, useRef } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import SearchBarDropdown from "../components/SearchBarDropdown";
import TableComponent from "../components/TableComponent";
import ModalComponent from "../components/ModalComponent";
import { blockIP, unblockIP } from "../utils/ip";
import { render } from "react-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ButtonHeader from "../components/ButtonHeader";
import GetHelpButton from "../components/GetHelpButton";
import VideoTutorialComponent from "../components/VideoTutorialComponent";

const IP = ({ result = false, BlockedData }) => {
  const [ips, setIps] = useState([]);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [filter, setFilter] = useState({ showName: "All", name: null });
  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchBy, setSearchBy] = useState({
    showName: "IP Address",
    name: "IPAddress",
  });
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIps, setSelectedIps] = useState([]);
  const [bulkIpData, setBulkIpData] = useState([]);
  const [correctIps, setCorrectIps] = useState([]);
  const [errorIps, setErrorIps] = useState([]);
  const [cid, setCid] = useState([]);
  const [cid2, setCid2] = useState([]);
  const modalRef = useRef(null);

  // Handle IP Blocking
  const createFormAndSubmit = (ip, e) => {
    // Create FormData and append the IP address
    const formData = new FormData();
    formData.append("ip", ip);

    // Pass the FormData directly to handleBlockIp
    handleBlockIp(formData);
  };

  const handleBlockIp = async (e) => {
    // Convert FormData to a plain object
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
    const ip = formData.ip;

    const ipArray = Array.isArray(ip) ? ip : [ip];
    formData.ips = ipArray;

    try {
      const response = await blockIP(formData);
      // Display appropriate messages based on response
      i;
      setFetchRefresh(!fetchRefresh);
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to block IP:", error);
    }
  };

  // Handle IP Unblocking
  const handleUnblockIp = async (ip) => {
    try {
      const response = await unblockIP({ ips: [ip] });
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Failed to unblock IP:", error);
    }
  };
  const handleUnblockIpBulk = async (ip) => {
    try {
      const response = await unblockIP({ ips: ip, selectAll });
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Failed to unblock IP:", error);
    }
  };
  // Handle File Upload for Bulk IPs
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const allIps = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const ips = jsonData.slice(1).map((row) => ({ ip: row[0] }));
        allIps.push(...ips);
        if (i === files.length - 1) {
          setBulkIpData(allIps);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Process Bulk IPs
  const processBulkIps = () => {
    // Example validation function for IP addresses
    const validateIpFormat = (ip) => {
      const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
      return ipRegex.test(ip);
    };

    const validatedIps = bulkIpData.reduce(
      (acc, item, index) => {
        const { ip } = item;
        const reason = validateIpFormat(ip) ? "" : ip ? "Invalid IP format" : "required";
        if (!validateIpFormat(ip)) {
          acc.errors.push({ ipInfo: { ip, reason } });
        } else {
          acc.correct.push({ _id: ip, ...item });
        }
        return acc;
      },
      { correct: [], errors: [] }
    );

    setCorrectIps(validatedIps.correct);
    setErrorIps(validatedIps.errors);
  };

  useEffect(() => {
    processBulkIps();
  }, [bulkIpData]);

  const columns = [
    {
      label: "IP Address",
      key: "ip",
      render: (entry) => (
        <div className={`${BlockedData && BlockedData.includes(entry.ip) && "text-success"}`}>
          {BlockedData && BlockedData.includes(entry.ip) ? `${entry.ip} (Recently Added)` : entry.ip}
        </div>
      ),
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
      align: "end",
      nosort: true,
      stopProp: true,
      render: (entry) => (
        <div className="text-end">
          <span
            onClick={() => handleUnblockIp(entry._id)}
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
          >
            lock_open
          </span>
        </div>
      ),
    },
  ];
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className="ip-management-container">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="ip"
        />
      )}
      {!result && (
        <div className="d-flex justify-content-between flex-wrap mb-2">
          <h2>IP Management</h2>
          <div className="d-flex gap-2">
            <SearchBarDropdown
              searchType={searchType}
              searchBy={searchBy}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setSearchType={setSearchType}
              setSearchBy={setSearchBy}
              searchByList={[{ showName: "IP Address", name: "IPAddress" }]}
              DropdownItems={[{ showName: "IP Address", name: "IPAddress" }]}
              onlyOne={true}
            />
            <ButtonHeader onClick={() => navigate("/bulk-ip-upload")} text="Upload Bulk IPs" icon="upload" />
            <ButtonHeader onClick={() => setShowAddModal(true)} text=" Add IP" />
            <GetHelpButton toggle={toggle} settoggle={settoggle} videoInfoError={videoInfoError} />
          </div>
        </div>
      )}
      <ModalComponent
        isOpen={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSubmit={handleBlockIp}
        title="Block IP "
        modalRef={modalRef}
        footerButtons={[
          {
            onClick: () => setShowAddModal(false),
            className: "btn-light",
            type: "clear",
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
            IP Address or IP Range(CIDR Notation)
            <input
              className="form-control border-primary"
              type="text"
              name="ip"
              placeholder="IP Address or IP Range(CIDR Notation)"
              required
            />
          </label>
        </div>
      </ModalComponent>
      <TableComponent
        checkbox={!result}
        columns={result ? columns.splice(0, 3) : columns}
        data={ips}
        route="ip"
        n={n}
        p={p}
        setP={setP}
        noDataMessage="No IPs available"
        PaginationEnabled={true}
        setPage={setPage}
        setperPage={setPerPage}
        perPage={perPage}
        setN={setN}
        page={page}
        totalPages={totalPages}
        DeleteFun={handleUnblockIpBulk}
        setTotalPages={setTotalPages}
        fetchRefresh={fetchRefresh}
        searchBy={searchBy.name}
        searchType={searchType.name}
        searchValue={searchValue}
        icon="lock_open"
        routeLogic={`status=${filter.name}`}
        setcid={setCid}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />
    </div>
  );
};

export default IP;
