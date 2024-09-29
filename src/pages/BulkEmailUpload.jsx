import { useEffect, useState } from "react";
import "../UploadFile.css";
import * as XLSX from "xlsx";
import UploadFile from "../components/UploadFile";
import Tracker from "../components/Tracker";
import BulkValidation from "../components/BulkValidation";
import { blockEmail } from "../utils/emailApi";
import EmailManagement from "./EmailManagement";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { blockIP } from "../utils/ip";
import IP from "./IP";
import Project from "./Project";
import TableComponent from "../components/TableComponent";
import { render } from "react-dom";
import { blockMob } from "../utils/mobileNumber";
import moment from "moment";
import MobileValidation from "../utils/MobileValidation";

const BulkEmailUpload = () => {
  const location = useLocation();
  const pid = location?.state?.pid;
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [bulkData, setBulkData] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [BlockedData, setBlockedData] = useState([]);
  const [count, setCount] = useState(0);
  const isEmail =
    location.pathname === "/bulk-email-upload" ||
    location.pathname === "/bulk-project-email-upload"
      ? 0
      : location.pathname === "/bulk-ip-upload" ||
          location.pathname === "/bulk-project-ip-upload"
        ? 1
        : 2;
  const columns =
    isEmail === 0
      ? [
          {
            label: "Email ID",
            key: "email",
            nosort: true,
          },
          {
            label: "Domain",
            key: "domainLevel",
            nosort: true,
            align: "start",
            render: (entry) => (
              <div className="text-start">
                <span className="text-capitalize">{entry.domain}</span>
              </div>
            ),
          },
        ]
      : isEmail === 1
        ? [
            {
              label: "IP",
              key: "ip",
              nosort: true,
            },
          ]
        : [
            {
              label: "Mobile Number",
              key: "mob",
              render: (entry) => (
                <div>
                  +{entry?.mob}
                </div>
              ),
            },
            {
              label: "Type",
              key: "domainLevel",
              render: (entry) => (
                <div className="">
                  {entry.type == "mobileNumber"
                    ? "Mobile Number"
                    : "Mobile Code"}
                </div>
              ),
            },
          ];
  const handleFileUpload = (event) => {
    const files = event.target.files;
    const allEmails = [];
    let fileCount = 0; // Track how many files have been processed

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const emails =
          isEmail === 0
            ? jsonData.slice(0).map((row) => ({
                email: row[0],
                domain: row[1],
              }))
            : isEmail === 1
              ? jsonData.slice(0).map((row) => ({
                  ip: row[0],
                }))
              : jsonData.slice(0).map((row) => ({
                  mob: row[0],
                  type: row[1],
                }));

        allEmails.push(...emails);
        fileCount += 1;

        if (fileCount === files.length) {
          setBulkData(allEmails); // Update state with all emails once all files are processed
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const processBulkEmails = () => {
    const validDomains = ["email", "domain", "TLD"];

    // Regex patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const domainRegex =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const TLDRegex = /^[a-zA-Z]{2,}$/; // TLDs are alphabetic and at least 2 characters long

    const validateEmailFormat = (email) => emailRegex.test(email);

    const validateDomain = (domain) =>
      validDomains.includes(domain.toLowerCase());

    const extractTLD = (email) => {
      if (typeof email !== "string") {
        return false; // or handle the error as needed
      }
      const match = email.match(/\.[a-zA-Z]{2,}$/);
      return match ? match[0] : false; // Extract TLD from the domain part of the email
    };

    const validatedEmails = bulkData.reduce(
      (acc, item, index) => {
        const { email, domain } = item;
        const tld = extractTLD(email);

        let isEmailValid = true;
        let isDomainValid = true;
        let isTLDValid = true;

        // Conditional validation based on the domain type
        if (domain === "email") {
          isEmailValid = validateEmailFormat(email);
          isDomainValid = true; // Domain check is not needed for "email"
          isTLDValid = true; // TLD check is not needed for "email"
        } else if (domain === "domain") {
          isEmailValid = true; // Email check is not needed for "domain"
          isDomainValid = domainRegex.test(email);
          isTLDValid = true; // TLD check is not needed for "domain"
        } else if (domain === "TLD") {
          isEmailValid = true; // Email check is not needed for "TLD"
          isDomainValid = true; // Domain check is not needed for "TLD"
          isTLDValid = TLDRegex.test(tld);
        } else {
          // Handle invalid domain types
          isEmailValid = false;
          isDomainValid = false;
          isTLDValid = false;
        }

        const reasonEmail = isEmailValid
          ? ""
          : email
            ? "Invalid email format"
            : "Required";
        const reasonDomain = isDomainValid
          ? ""
          : domain
            ? "Invalid domain value"
            : "Required";
        const reasonTLD = isTLDValid ? "" : "Invalid TLD";

        if (
          !isEmailValid ||
          !isDomainValid ||
          (domain === "TLD" && !isTLDValid)
        ) {
          acc.errors.push({
            emailInfo: { email, reason: reasonEmail },
            domainInfo: { domain, reason: reasonDomain },
            tldInfo: { tld, reason: reasonTLD },
          });
        } else {
          acc.correct.push({ _id: index, ...item });
        }
        return acc;
      },
      { correct: [], errors: [] }
    );

    setCorrect(validatedEmails.correct);
    setCount(validatedEmails.correct.length);
  };
  const processBulkIps = () => {
    // Example validation function for IP addresses
    const validateIpFormat = (ip) => {
      const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
      return ipRegex.test(ip);
    };

    const validatedIps = bulkData.reduce(
      (acc, item, index) => {
        const { ip } = item;
        const reason = validateIpFormat(ip)
          ? ""
          : ip
            ? "Invalid IP format"
            : "required";
        if (!validateIpFormat(ip)) {
          acc.errors.push({ ipInfo: { ip, reason } });
        } else {
          acc.correct.push({ _id: ip, ...item });
        }
        return acc;
      },
      { correct: [], errors: [] }
    );

    setCorrect(validatedIps.correct);
    setCount(validatedIps.correct.length);
  };
  const processBulkMob = () => {
    // Example validation function for mobile numbers

    const validatedMobiles = bulkData.reduce(
      (acc, item, index) => {
        const { mob, type } = item;
        let formattedMobileNumber = "";

        const mobileCode =
          type === "mobileNumber" ? mob.split(" ")[0] : `${mob}`;
        const mobileNumber = type === "mobileNumber" ? mob.split(" ")[1] : null;
        const info = MobileValidation(mobileCode, mobileNumber);
        const reason = info.reason
          ? ""
          : mob
            ? "Invalid mobile format"
            : "required";

        if (!info.isValid) {
          acc.errors.push({ mobileInfo: { mob, reason } });
        } else {
          acc.correct.push({ _id: formattedMobileNumber, ...item });
        }

        return acc;
      },
      { correct: [], errors: [] }
    );
    setCorrect(validatedMobiles.correct);
    setCount(validatedMobiles.correct.length);
  };


  useEffect(() => {
    if (bulkData.length > 0) {
      isEmail === 0
        ? processBulkEmails()
        : isEmail === 1
          ? processBulkIps()
          : processBulkMob();
    }
  }, [bulkData]);
  const createFormAndSubmit = (email) => {
    // Directly create FormData
    const formData = new FormData();
    formData.append("email", email.email);
    formData.append("domain", email.domain);

    // Pass the FormData to handleBlockEmail
    handleBlockEmail({ formData });
  };
  const handleBlockIp = async (formData) => {
    const ips = correct.map((item) => item.ip);

    try {
      const response = await blockIP({ ips, pid });
      setBlockedData(response?.blocked);

      // Display appropriate messages based on response
    } catch (error) {
      console.error("Failed to block IP:", error);
    }
  };
  const handleBlockMob = async (formData) => {
    const mobs = correct.map((item) => item.mob);
    const type = correct.map((item) => item.type);

    try {
      const response = await blockMob({ mobs, type, pid });
      setBlockedData(response?.blocked);
    } catch (error) {
      console.error("Failed to block IP:", error);
    }
  };
  const createFormAndSubmitIP = (ip, e) => {
    // Create FormData and append the IP address
    const formData = new FormData();
    formData.append("ip", ip);

    // Pass the FormData directly to handleBlockIp
    handleBlockIp(formData);
  };
  const createFormAndSubmitMob = (mob, e) => {
    // Create FormData and append the IP address
    const formData = new FormData();
    formData.append("mob", mob);

    // Pass the FormData directly to handleBlockIp
    handleBlockMob(formData);
  };
  const handleBlockEmail = async (e) => {
    const emails = correct.map((item) => item.email);
    const domainLevel = correct.map((item) => item.domain);

    try {
      const response = await blockEmail({ emails, domainLevel, pid });
      setBlockedData(response?.blocked);
      
    } catch (error) {
      console.error("Failed to block email:", error);
    }
  };
  const routeToComponent = {
    "/bulk-email-upload": (
      <div>
        <h3>Recently Added</h3>
        <TableComponent
          checkbox={false}
          nosort={true}
          n={BlockedData.length ? BlockedData.length : 5}
          columns={[
            {
              label: "Email",
              key: "email",
              nosort: true,
            },
            {
              label: "Domain",
              key: "domainLevel",
              nosort: true,

              render: (entry) => (
                <div className="text-capitalize">{entry.domainLevel}</div>
              ),
            },
          ]}
          dataAll={BlockedData}
        />
      </div>
    ),
    "/bulk-project-email-upload": (
      <div>
        <h3>Recently Added</h3>
        <TableComponent
          checkbox={false}
          nosort={true}
          n={BlockedData.length ? BlockedData.length : 5}
          columns={[
            {
              label: "Email",
              key: "email",
              nosort: true,
            },
            {
              label: "Domain",
              key: "domainLevel",
              nosort: true,

              render: (entry) => (
                <div className="text-capitalize">{entry.domainLevel}</div>
              ),
            },
          ]}
          dataAll={BlockedData}
        />
      </div>
    ),
    "/bulk-mobile-upload": (
      <div>
        <h3>Recently Added</h3>
        <TableComponent
          nosort={true}
          checkbox={false}
          n={BlockedData.length ? BlockedData.length : 5}
          columns={[
            {
              label: "Mobile Number",
              key: "Mob",
              nosort: true,

              render: (entry) => <div>+{entry.Mob}</div>,
            },
            {
              label: "Type",
              key: "domainLevel",
              nosort: true,

              render: (entry) => (
                <div className="">
                  {entry.domainLevel == "mobileNumber"
                    ? "Mobile Number"
                    : "Mobile Code"}
                </div>
              ),
            },
            {
              label: "Created At",
              nosort: true,

              key: "createdAt",
              render: (entry) =>
                moment(entry.createdAt).format("MM/DD/YYYY LT"),
            },
            {
              label: "Updated At",
              nosort: true,

              key: "updatedAt",
              render: (entry) =>
                moment(entry.updatedAt).format("MM/DD/YYYY LT"),
            },
          ]}
          dataAll={BlockedData}
        />
      </div>
    ),
    "/bulk-project-mobile-upload": (
      <div>
        <h3>Recently Added</h3>
        <TableComponent
          nosort={true}
          checkbox={false}
          n={BlockedData.length ? BlockedData.length : 5}
          columns={[
            {
              nosort: true,

              label: "Mobile Number",
              key: "Mob",
              render: (entry) => <div>+{entry.Mob}</div>,
            },
            {
              label: "Type",
              key: "domainLevel",
              nosort: true,

              render: (entry) => (
                <div className="">
                  {entry.domainLevel == "mobileNumber"
                    ? "Mobile Number"
                    : "Mobile Code"}
                </div>
              ),
            },
            {
              label: "Created At",
              key: "createdAt",
              nosort: true,

              render: (entry) =>
                moment(entry.createdAt).format("MM/DD/YYYY LT"),
            },
            {
              label: "Updated At",
              key: "updatedAt",
              nosort: true,

              render: (entry) =>
                moment(entry.updatedAt).format("MM/DD/YYYY LT"),
            },
          ]}
          dataAll={BlockedData}
        />
      </div>
    ),
    "/bulk-ip-upload": (
      <div>
        <h3>Recently Added</h3>
        <TableComponent
          nosort={true}
          checkbox={false}
          n={BlockedData.length ? BlockedData.length : 5}
          columns={[
            {
              nosort: true,

              label: "IP",
              key: "ip",
              render: (entry) => <div>{entry.ip}</div>,
            },
          ]}
          dataAll={BlockedData}
        />
      </div>
    ),
    "/bulk-project-ip-upload": (
      <div>
        <h3>Recently Added</h3>
        <TableComponent
          nosort={true}
          checkbox={false}
          n={BlockedData.length ? BlockedData.length : 5}
          columns={[
            {
              label: "IP",
              key: "ip",
              nosort: true,

              render: (entry) => <div>{entry.ip}</div>,
            },
          ]}
          dataAll={BlockedData}
        />
      </div>
    ),
  };
  const page = {
    0: (
      <UploadFile
        file={file}
        setFile={setFile}
        handleFileUpload={handleFileUpload}
      />
    ),
    1: (
      <BulkValidation
        file={file}
        setFile={setFile}
        columns={columns}
        correctValues={correct}
        createFormAndSubmit={createFormAndSubmit}
        noDataMessage={"No data found"}
      />
    ),
    2: routeToComponent[location.pathname],
  };
  const navigate = useNavigate();
  return (
    <div className="">
      <h2 className="ms-3">Bulk Upload</h2>
      <div className="col-12 py-4 m-0">
        <Tracker currentStep={currentStep} isEmail={isEmail} />
      </div>
      <div className="col-12 py-4 ">{page[currentStep]}</div>

      <div className="col-12 d-flex align-items-center justify-content-between gap-2">
        <button
          className="btn btn-danger font-weight-bold"
          onClick={() => {
            if (currentStep == 0) {
              navigate(-1, { state: { pid: pid } });
            }
            currentStep <= 1
              ? setCurrentStep(currentStep - 1)
              : isEmail === 0
                ? location.pathname === "/bulk-email-upload"
                  ? navigate("/email")
                  : navigate("/project", { state: { pid: pid } })
                : isEmail === 1
                  ? location.pathname === "/bulk-ip-upload"
                    ? navigate("/ip")
                    : navigate("/project", { state: { pid: pid } })
                  : location.pathname === "/bulk-mobile-upload"
                    ? navigate("/mob")
                    : navigate("/project", { state: { pid: pid } });
          }}
        >
          {currentStep == 1
            ? "Back"
            : currentStep == 2
              ? `Back to ${isEmail == 0 ? (location.pathname === "/bulk-email-upload" ? "Email" : "Project") : isEmail == 1 ? (location.pathname === "/bulk-ip-upload" ? "IP" : "Project") : location.pathname === "/bulk-mobile-upload" ? "Mobile Number" : "Project"}`
              : "Back"}
        </button>
        {file && (
          <button
            className="btn btn-primary font-weight-bold"
            onClick={() => {
              if (currentStep) {
                setCurrentStep(currentStep + 1);
                isEmail === 0
                  ? createFormAndSubmit(correct)
                  : isEmail == 1
                    ? createFormAndSubmitIP(correct)
                    : createFormAndSubmitMob(correct);
                if (currentStep == 2) navigate("/dashboard", { replace: true });
              } else setCurrentStep(currentStep + 1);
            }}
          >
            {currentStep == 1
              ? "Save"
              : currentStep == 2
                ? "Dashboard"
                : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BulkEmailUpload;
