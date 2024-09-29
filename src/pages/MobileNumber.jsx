import { useState, useEffect, useRef } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import SearchBarDropdown from "../components/SearchBarDropdown";
import TableComponent from "../components/TableComponent";
import ModalComponent from "../components/ModalComponent";
import { blockMob, unblockMob } from "../utils/mobileNumber"; // updated import
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ButtonHeader from "../components/ButtonHeader";
import PhoneInputComponent from "../components/PhoneInputComponent";
import phoneData from "../utils/phoneInput.json";
import Dropdown from "../components/Dropdown";
import GetHelpButton from "../components/GetHelpButton";
import VideoTutorialComponent from "../components/VideoTutorialComponent";

const MobileNumber = ({
  result = false,
  BlockedData,
  pid,
  title = "Mobile Number Blocklist",
}) => {
  const [mobs, setMobs] = useState([]);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [filter, setFilter] = useState({ showName: "All", name: null });
  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchBy, setSearchBy] = useState({
    showName: "Mobile Number",
    name: "mob",
  });
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const [cid, setCid] = useState([]);
  const modalRef = useRef(null);

  const handleBlockMob = async (e) => {
    let formData;
    if (e.formData) {
      formData = e.formData;
    } else {
      const form = e.target;
      formData = new FormData(form);
      formData = Object.fromEntries(formData.entries());
    }
    const mob =
      formData.domainLevel == "mobileCode"
        ? formData.phoneCode
        : `${formData.phoneCode} ${formData.phone}`;
    const mobArray = Array.isArray(mob) ? mob : [mob];
    formData.mobs = mobArray;
    formData.type = [formData.domainLevel];
    formData.pid = pid;
    try {
      const response = await blockMob(formData);

      setFetchRefresh(!fetchRefresh);
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to block mobile number:", error);
    }
  };

  const handleUnblockMob = async (mob) => {
    try {
      const response = await unblockMob({ mobs: [mob], pid });
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Failed to unblock mobile number:", error);
    }
  };

  const handleUnblockMobBulk = async (mob) => {
    try {
      const response = await unblockMob({ mobs: mob, pid, selectAll });
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Failed to unblock mobile number:", error);
    }
  };

  const columns = [
    {
      label: "Mobile Number",
      key: "Mob",
      render: (entry) => <div>+{entry.Mob}</div>,
    },
    {
      label: "Type",
      key: "domainLevel",
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
            onClick={() => handleUnblockMob(entry._id)}
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
  const [showPhoneError, setShowPhoneError] = useState(false);
  const [dialingCode, setDialingCode] = useState("91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryData, setSelectedCountryData] = useState("");

  const handleCountryChange = (event) => {
    const { value } = event.target;
    const selectedCountryDataTemp = phoneData.find(
      (country) => country.code === value
    );

    if (selectedCountryDataTemp) {
      setSelectedCountryData(selectedCountryDataTemp);
      setDialingCode(selectedCountryDataTemp.dialingCode);
    }
  };

  const handlePhoneNumberChange = (event) => {
    if (/\D/.test(event.target.value)) {
      return;
    }

    setPhoneNumber(event.target.value);
  };
  const [domain, setDomain] = useState({
    showName: "Mobile Number",
    name: "mobileNumber",
  });
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className="mobile-management-container">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="mobileNumber"
        />
      )}
      {!result && (
        <div className="d-flex justify-content-between flex-wrap mb-2">
          <h2>{title}</h2>
          <div className="d-flex gap-2">
            <SearchBarDropdown
              searchType={searchType}
              searchBy={searchBy}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setSearchType={setSearchType}
              setSearchBy={setSearchBy}
              searchByList={[{ showName: "Mobile Number", name: "Mob" }]}
              onlyOne={true}
              DropdownItems={[{ showName: "Mobile Number", name: "mob" }]}
            />
            <ButtonHeader
              onClick={() =>
                navigate(
                  pid ? "/bulk-project-mobile-upload" : "/bulk-mobile-upload",
                  { state: { pid } }
                )
              }
              text="Upload Bulk Numbers"
              icon="upload"
            />
            <ButtonHeader
              onClick={() => setShowAddModal(true)}
              text="Add Number"
            />
            <Dropdown
              name="search"
              SummaryChild={
                <h5 className="p-0 m-0">Type: {filter.showName}</h5>
              }
              dropdownList={[
                { showName: "All", name: null },
                { showName: "Mobile Number", name: "mobileNumber" },
                { showName: "Mobile Code", name: "mobileCode" },
              ]}
              commonFunction={setFilter}
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
        isOpen={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSubmit={handleBlockMob}
        title="Block Mobile Number"
        modalRef={modalRef}
        footerButtons={[
          {
            onClick: () => setShowAddModal(false),
            className: "btn-light",
            label: "Cancel",
          },
          {
            onClick: handleBlockMob,
            className: "btn-primary",
            label: "Block",
            type: "submit",
          },
        ]}
      >
        <div className="">
          <Dropdown
            name="search"
            SummaryChild={<h5 className="p-0 m-0">{domain.showName}</h5>}
            dropdownList={[
              { showName: "Mobile Number", name: "mobileNumber" },
              { showName: "Mobile Code", name: "mobileCode" },
            ]}
            commonFunction={setDomain}
          />
          <input type="text" name="domainLevel" value={domain.name} hidden />
          <br />
          <br />
          <label
            className="font-weight-bold d-flex gap-3 align-items-center"
            htmlFor="mob"
          >
            <p className="p-0 m-0">Mobile Number</p>
            <PhoneInputComponent
              selectedCountryData={selectedCountryData}
              preferredCountry={["in", "us", "ae"]}
              phoneNumber={phoneNumber}
              handleCountryChange={handleCountryChange}
              handlePhoneNumberChange={handlePhoneNumberChange}
              showError={showPhoneError}
              hideMobileNumber={domain.name == "mobileCode"}
            />
          </label>
        </div>
      </ModalComponent>
      <TableComponent
        checkbox={!result}
        columns={result ? columns.splice(0, 3) : columns}
        data={mobs}
        route="mob"
        n={n}
        p={p}
        setP={setP}
        noDataMessage="No Mobile Numbers available"
        PaginationEnabled={true}
        setPage={setPage}
        setperPage={setPerPage}
        perPage={perPage}
        setN={setN}
        page={page}
        totalPages={totalPages}
        DeleteFun={handleUnblockMobBulk}
        setTotalPages={setTotalPages}
        fetchRefresh={fetchRefresh}
        searchBy={searchBy.name}
        searchType={searchType.name}
        searchValue={searchValue}
        icon="lock_open"
        routeLogic={`domainLevel=${filter.name}&${pid && `pid=${pid}`}`}
        setcid={setCid}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />
    </div>
  );
};

export default MobileNumber;
