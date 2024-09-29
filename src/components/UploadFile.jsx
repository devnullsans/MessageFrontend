import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tracker from "./Tracker";
import "../UploadFile.css";
// import { Container, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";

const UploadFile = ({ file, setFile, handleFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleDownload = () => {
    // Sample data to write in the XLSX file
    const sampleData = [
      ["john@example.com", "email"],
      ["example.com", "domain"],
      ["com", "TLD"],
      // Add more rows as needed
    ];

    // Create a new worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(sampleData);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EmailSampleData");

    // Create a blob from the workbook and download it
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert binary string to array buffer
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };

    // Create a Blob from the array buffer
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a link element, trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "EmailSampleData.xlsx"; // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after download
  };
  return (
    <div className="row  justify-content-center">
      <div className="col-md-6 stretch-card grid-margin">
        <div className="card">
          <h3
            style={{ borderRadius: "10px 10px 0 0" }}
            className="font-weight-bold d-flex align-items-center justify-content-start bg-blue colorw w-100 pt-2 pb-2"
          >
            <span className="ml-2">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9984 2.3999C15.3788 2.3999 17.2964 4.7075 17.5748 7.4951H17.6588C19.8368 7.4951 21.5984 9.3095 21.5984 11.5475C21.5984 11.6615 21.5936 11.7755 21.5852 11.8871C20.7238 10.8111 19.5598 10.0177 18.2433 9.60925C16.9268 9.20081 15.5181 9.19604 14.1989 9.59554C12.8797 9.99504 11.7103 10.7805 10.8416 11.8507C9.97288 12.9209 9.44459 14.2267 9.32484 15.5999H6.33684C4.16124 15.5999 2.39844 13.7855 2.39844 11.5475C2.39844 9.3095 4.16244 7.4951 6.33684 7.4951H6.42204C6.70284 4.6895 8.61804 2.3999 11.9984 2.3999ZM16.1984 21.5999C14.7663 21.5999 13.3928 21.031 12.3801 20.0183C11.3674 19.0056 10.7984 17.6321 10.7984 16.1999C10.7984 14.7677 11.3674 13.3942 12.3801 12.3815C13.3928 11.3688 14.7663 10.7999 16.1984 10.7999C17.6306 10.7999 19.0041 11.3688 20.0168 12.3815C21.0295 13.3942 21.5984 14.7677 21.5984 16.1999C21.5984 17.6321 21.0295 19.0056 20.0168 20.0183C19.0041 21.031 17.6306 21.5999 16.1984 21.5999ZM18.1208 15.7223L16.7984 17.0447V13.7999C16.7984 13.6408 16.7352 13.4882 16.6227 13.3756C16.5102 13.2631 16.3576 13.1999 16.1984 13.1999C16.0393 13.1999 15.8867 13.2631 15.7742 13.3756C15.6617 13.4882 15.5984 13.6408 15.5984 13.7999V17.0447L14.276 15.7223C14.1494 15.5956 13.9776 15.5245 13.7984 15.5245C13.6193 15.5245 13.4475 15.5956 13.3208 15.7223C13.1942 15.849 13.123 16.0208 13.123 16.1999C13.123 16.379 13.1942 16.5508 13.3208 16.6775L15.7208 19.0775C15.9848 19.3415 16.412 19.3415 16.676 19.0775L19.076 16.6775C19.2027 16.5508 19.2739 16.379 19.2739 16.1999C19.2739 16.0208 19.2027 15.849 19.076 15.7223C18.9494 15.5956 18.7776 15.5245 18.5984 15.5245C18.4193 15.5245 18.2475 15.5956 18.1208 15.7223Z"
                  fill="white"
                />
              </svg>
            </span>
            <p className="m-1 pl-2 font-weight-bold h3">Upload File</p>
          </h3>
          <div className="card-body">
            <div className="col-12 d-flex  px-0  flex-wrap justify-content-center align-items-center ">
              <div className="col-12 d-flex align-items-center justify-content-between">
                {" "}
                <strong>Upload XLSX File Format Only</strong>{" "}
                <strong onClick={handleDownload} style={{ color: "#2563EB" }}>
                  {" "}
                  <u>Download Sample</u>
                </strong>
              </div>
              <div className="col-12  m-0">
                {" "}
                <label
                  htmlFor="file-input"
                  className={`drop-zone d-flex align-items-center justify-content-center ${
                    dragActive ? "active" : ""
                  } col-12 p-2 my-2 mx-0 align-center `}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onChange={handleFileUpload}
                  style={{
                    height: "200px",
                    border: "1px dotted #2563EB",
                    borderRadius: "10px ",
                    cursor: "pointer",
                  }}
                >
                  <div className="  d-flex flex-column align-items-center justify-content-center">
                    {" "}
                    <span
                      className="material-symbols-outlined p-0 m-0"
                      style={{ color: "black", fontSize: "50px" }}
                    >
                      cloud_download
                    </span>
                    <div>
                      <input
                        type="file"
                        id="file-input"
                        className="file-input"
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />
                      <label
                        style={{
                          cursor: "pointer",
                        }}
                        htmlFor="file-input"
                        className="file-label"
                      >
                        {file ? (
                          `File selected: ${file.name}`
                        ) : (
                          <span style={{ color: "gray" }}>
                            Drag & Drop a file here or click to{" "}
                            <strong style={{ color: "#2563EB" }}>
                              select a file
                            </strong>
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                </label>
              </div>
              <div className="col-12 d-flex align-items-center justify-content-end ">
                {/* <strong style={{ color: "gray" }}>Maximum size: 5MB</strong> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 stretch-card grid-margin">
        <div className="card">
          <div className="m-2 p-2">
            <p
              className="p-0 m-0 font-weight-bold"
              style={{ fontSize: "20px" }}
            >
              Steps to Import a file
            </p>
            <br />
            <br />
            {/* <p
                  className="p-0 mt-3 font-weight-bold"
                  style={{ fontSize: "16px" }}
                >
                  See a video on how to import here.
                </p> */}

            <div className="list-group " style={{ borderRadius: "10px" }}>
              <li className="list-group-item">1. Upload XLSX file</li>
              <li className="list-group-item">2. Check Validation.</li>
              <li className="list-group-item">3. Click "Block".</li>
              <li className="list-group-item">
                4. Once its done, blocking will be started.
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
