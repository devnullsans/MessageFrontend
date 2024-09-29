import React, { useEffect, useState } from "react";
import VideoTutorialComponent from "./VideoTutorialComponent";
import TableComponent from "./TableComponent";
import Loader from "./Loader";
import {
  fetchAWS,
  createAWS,
  updateAWS,
  deleteAWS,
  setDefaultAWS,
} from "../utils/aws"; // Adjust import paths as needed

const AWSComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    awsRegion: "",
    awsBucket: "",
    awsAccess: "",
    awsSecret: "",
  });
  const [editId, setEditId] = useState("");
  const [edit, setEdit] = useState(false);
  const [awsList, setAwsList] = useState([]);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(false);
  const [perPage, setPerPage] = useState("20 Items Per Page");
  const [toggleNotification, setToggleNotification] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    awsRegion: "",
    awsBucket: "",
    awsAccess: "",
    awsSecret: "",
  });
  const [load, setLoad] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleRadioChange = async (entryId) => {
    try {
      setLoad(true);
      await setDefaultAWS(entryId);
      setFetchRefresh(!fetchRefresh);
    } catch (error) {
      console.error("Error setting default AWS:", error);
    } finally {
      setLoad(false);
    }
  };

  const validation = () => {
    const error = {
      name: "",
      awsRegion: "",
      awsBucket: "",
      awsAccess: "",
      awsSecret: "",
    };
    let err = false;

    if (!formData.awsSecret) {
      error.awsSecret = "AWS Secret is required.";
      err = true;
    }
    if (!formData.awsAccess) {
      error.awsAccess = "AWS Access Key is required.";
      err = true;
    }
    if (!formData.awsBucket) {
      error.awsBucket = "AWS Bucket is required.";
      err = true;
    }
    if (!formData.awsRegion) {
      error.awsRegion = "AWS Region is required.";
      err = true;
    }
    if (!formData.name) {
      error.name = "AWS Name is required.";
      err = true;
    }

    setErrors(error);
    return err;
  };

  const PostDataAWS = async (id) => {
    try {
      setLoad(true);
      if (id) {
        await updateAWS(id, formData);
      } else {
        await createAWS(formData);
      }
      setFetchRefresh(!fetchRefresh);
      setEdit(false);
      setEditId("");
      setFormData({
        name: "",
        awsRegion: "",
        awsBucket: "",
        awsAccess: "",
        awsSecret: "",
      });
    } catch (error) {
      console.error("Error posting AWS data:", error);
    } finally {
      setLoad(false);
    }
  };

  const DeleteData = async (id) => {
    try {
      setLoad(true);
      await deleteAWS(id);
      setFetchRefresh(!fetchRefresh);
      setToggleNotification(false);
    } catch (error) {
      console.error("Error deleting AWS data:", error);
    } finally {
      setLoad(false);
    }
  };

  const columns = [
    { label: "AWS Name", key: "name" },
    {
      label: "Default",
      key: "_id",
      nosort: true,
      stopProp: true,
      align: "center",
      render: (entry) => (
        <div className="text-center">
          <input
            type="radio"
            name="defaultAWSServer"
            className="text-center"
            checked={entry.default}
            onChange={() => handleRadioChange(entry._id)}
          />
        </div>
      ),
    },
    {
      label: "Action",
      key: "action",
      nosort: true,
      stopProp: true,
      render: (entry) => (
        <div>
          <span
            onClick={() => {
              setFormData(entry);
              setEdit(true);
              setEditId(entry._id);
            }}
            className="material-symbols-outlined"
          >
            edit
          </span>
          <span className="material-symbols-outlined rotate no-hover">
            horizontal_rule
          </span>
          <span
            onClick={() => DeleteData(entry._id)}
            className="material-symbols-outlined"
          >
            delete
          </span>
        </div>
      ),
    },
  ];

  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);

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
  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [cid, setcid] = useState("");

  return (
    <div className="col-12 grid-margin transparent">
      {videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="aws"
        />
      )}

      <div
        style={{ minHeight: 610 }}
        className="col-lg-12 col-md-12 gap-3 grid-margin mt-3 transparent"
      >
        <div className="grid-margin stretch-card mt-3">
          <div className="card shadow p-0 m-0 h-100">
            <div className="card p-0 m-0 h-100">
              <h3
                style={{ borderRadius: "10px 10px 0 0" }}
                className="font-weight-bold d-flex bg-blue colorw p-0 m-0 pt-2 pb-2"
              >
                <p className="m-1 mt-2 pl-2 h3">AWS Settings</p>
              </h3>
              <div className="card-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    !validation() && PostDataAWS(editId);
                  }}
                  className="p-4 bg-light border rounded"
                >
                  <div className="row">
                    <div className="">
                      <div className="form-group mb-3">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="AWS Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="AWS Region"
                          name="awsRegion"
                          value={formData.awsRegion}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="AWS Bucket"
                          name="awsBucket"
                          value={formData.awsBucket}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="AWS Access Key"
                          name="awsAccess"
                          value={formData.awsAccess}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="AWS Secret Key"
                          name="awsSecret"
                          value={formData.awsSecret}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        {edit ? "Update" : "Add"} AWS
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="mx-3">
                <TableComponent
                  icon={false}
                  title="AWS Accounts"
                  columns={columns}
                  route="aws"
                  data={awsList}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                  page={page}
                  setPage={setPage}
                  selectAll={selectAll}
                  setTotalPages={setTotalPages}
                  setSelectAll={setSelectAll}
                  fetchRefresh={fetchRefresh}
                  setFetchRefresh={setFetchRefresh}
                  n={n}
                  p={p}
                  setP={setP}
                  PaginationEnabled={true}
                  setperPage={setPerPage}
                  setN={setN}
                  searchBy={searchBy.name}
                  searchType={searchType.name}
                  searchValue={searchValue}
                  routeLogic={`status=${filter.name}`}
                  DeleteFun={DeleteData}
                  setcid={setcid}
                />
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
      {load && <Loader />}
    </div>
  );
};

export default AWSComponent;
