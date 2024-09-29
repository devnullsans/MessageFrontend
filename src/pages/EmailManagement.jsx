import React, { useState, useRef, useContext } from "react";
import moment from "moment";
import * as XLSX from "xlsx"; // Import XLSX for Excel file parsing
import TableComponent from "../components/TableComponent";
import { sendEmail, blockEmail, unblockEmail } from "../utils/emailApi";
import SearchBarDropdown from "../components/SearchBarDropdown";
import ModalComponent from "../components/ModalComponent";
import { GlobalContext } from "../GlobalContext";
import Dropdown from "../components/Dropdown";
import { render } from "react-dom";
import toast from "react-hot-toast";
import ButtonHeader from "../components/ButtonHeader";
import { useNavigate } from "react-router-dom";
import GetHelpButton from "../components/GetHelpButton";
import VideoTutorialComponent from "../components/VideoTutorialComponent";

const EmailManagement = ({ result = false, BlockedData }) => {
  const navigate = useNavigate();
  const { companyData } = useContext(GlobalContext);
  const [emails, setEmails] = useState([]);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [filter, setFilter] = useState({
    showName: "All",
    name: null,
  });
  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchBy, setSearchBy] = useState({
    showName: "Email ID",
    name: "email",
  });
  const [domain, setDomain] = useState({
    showName: "Email ID",
    name: "email",
  });
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10 per page");
  const [totalPages, setTotalPages] = useState(0);
  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [isBlockEmailModalOpen, setIsBlockEmailModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [bulkEmailData, setBulkEmailData] = useState([]);
  const [correctEmails, setCorrectEmails] = useState([]);
  const [errorEmails, setErrorEmails] = useState([]);
  const [count, setCount] = useState(0);
  const [cid, setcid] = useState("");

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

  const handleUnblockEmail = async (email, multipe) => {
    try {
      const response = await unblockEmail({
        email: multipe ? email : [email],
        selectAll,
      });
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Failed to unblock email:", error);
    }
  };

  const processBulkEmails = () => {
    // Define valid domain values
    const validDomains = ["email", "domain", "TLD"];

    // Function to validate email format
    const validateEmailFormat = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Function to validate domain value
    const validateDomain = (domain) => {
      return validDomains.includes(domain);
    };

    // Process bulk data
    const validatedEmails = bulkEmailData.reduce(
      (acc, item, index) => {
        const { email, domain } = item;

        // Default reason to "required" if not provided
        const reasonEmail = validateEmailFormat(email)
          ? ""
          : email
            ? "Invalid email format"
            : "required";
        const reasonDomain = validateDomain(domain)
          ? ""
          : domain
            ? "Invalid domain value"
            : "required";

        if (!validateEmailFormat(email) || !validateDomain(domain)) {
          acc.errors.push({
            emailInfo: { email, reason: reasonEmail },
            domainInfo: { domain, reason: reasonDomain },
          });
        } else {
          acc.correct.push({ _id: index, ...item });
        }
        return acc;
      },
      { correct: [], errors: [] }
    );

    // Set state for correct and error emails
    setCorrectEmails(validatedEmails.correct);
    setCount(validatedEmails.correct.length);
    setErrorEmails(validatedEmails.errors);
  };

  React.useEffect(() => {
    processBulkEmails();
  }, [bulkEmailData]);
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
          {companyData?.email !== entry.email &&
            (entry.status === "blocked" ? (
              <span
                onClick={
                  entry.status === "blocked"
                    ? () => handleUnblockEmail(entry._id)
                    : null
                }
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
  const getPattern = (domainName) => {
    switch (domainName) {
      case "email":
        return "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; // Email
      case "domain":
        return "^[a-zA-Z0-9-]+.[a-zA-Z]{2,}$"; // Domain
      case "TLD":
        return "^[a-zA-Z]{2,}$"; // TLD
      default:
        return "";
    }
  };

  const getTitle = (domainName) => {
    switch (domainName) {
      case "email":
        return "Example: john.doe@my.com"; // Email example
      case "domain":
        return "Example: mycompany.com"; // Domain example
      case "TLD":
        return "Example: com"; // TLD example
      default:
        return "";
    }
  };
  const [selectAll, setSelectAll] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className="email-management-container">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="email"
        />
      )}
      {!result && (
        <div className="d-flex justify-content-between flex-wrap mb-2">
          <h2>Email Blocklist</h2>
          <div className="d-flex flex-wrap gap-3 ">
            {/* Search Bar */}
            <SearchBarDropdown
              searchType={searchType}
              searchBy={searchBy}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setSearchType={setSearchType}
              setSearchBy={setSearchBy}
              searchByList={[
                { showName: "Email ID", name: "email" },
                { showName: "Domain", name: "domainLevel" },
              ]}
              DropdownItems={[
                { showName: "Email", name: "email" },
                { showName: "Status", name: "status" },
                { showName: "Created At", name: "createdAt" },
                { showName: "Updated At", name: "updatedAt" },
              ]}
            />
            {/* File Upload */}

            <div className="d-flex gap-3 flex-wrap">
              <ButtonHeader
                onClick={() => navigate("/bulk-email-upload")}
                text="Upload Bulk Email"
                icon="upload"
              />

              <ButtonHeader
                onClick={() => setIsBlockEmailModalOpen(true)}
                text="Add Email ID"
              />
            </div>

            <GetHelpButton
              toggle={toggle}
              settoggle={settoggle}
              videoInfoError={videoInfoError}
            />
            {/* <div className="d-flex gap-3 ">
              <Dropdown
              name="search"
              SummaryChild={
                <h5 className="p-0 m-0">Status: {filter.showName}</h5>
                }
                dropdownList={[
                  { showName: "All", name: null },
                  { showName: "Blocked", name: "blocked" },
                  { showName: "Bounced", name: "bounced" },
                ]}
                commonFunction={setFilter}
              />
            </div> */}
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
        <label className="font-weight-bold" htmlFor={domain.name}>
          {domain.showName}
          <input
            id={`input-${domain.name}`}
            className="form-control border-primary"
            type={domain.name === "email" ? "email" : "text"}
            name="email"
            pattern={getPattern(domain.name)}
            placeholder={domain.showName}
            title={getTitle(domain.name)}
            required
            onInvalid={(event) => {
              event.preventDefault(); // Prevent default browser validation message
              toast.error(
                `${event.target.validationMessage}\n${event.target.title}`
              );
            }}
          />
        </label>

        <input type="text" name="domainLevel" value={domain.name} hidden />
      </ModalComponent>

      <TableComponent
        checkbox={!result}
        columns={result ? columns.splice(0, 5) : columns}
        data={emails}
        route="emails"
        setcid={setcid}
        n={n}
        p={p}
        setP={setP}
        noDataMessage="No emails available"
        PaginationEnabled={true}
        setPage={setPage}
        setperPage={setPerPage}
        perPage={perPage}
        setN={setN}
        page={page}
        totalPages={totalPages}
        DeleteFun={handleUnblockEmail}
        setTotalPages={setTotalPages}
        fetchRefresh={fetchRefresh}
        setFetchRefresh={setFetchRefresh}
        searchBy={searchBy.name}
        searchType={searchType.name}
        searchValue={searchValue}
        icon="lock_open"
        routeLogic={`status=${filter.name}`}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />

      {/* Bulk Emails Tables */}
    </div>
  );
};

export default EmailManagement;
