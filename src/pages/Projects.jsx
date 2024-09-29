import React, { useEffect, useState } from "react";
import moment from "moment";
import TableComponent from "../components/TableComponent";
import {
  addProject,
  deleteProject,
  fetchProjectDetails,
  updateProjectDetails,
} from "../utils/projects";
import SearchBarDropdown from "../components/SearchBarDropdown";
import ModalComponent from "../components/ModalComponent";
import { useNavigate } from "react-router-dom";
import ButtonHeader from "../components/ButtonHeader";
import GetHelpButton from "../components/GetHelpButton";
import VideoTutorialComponent from "../components/VideoTutorialComponent";

const Projects = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState([]);
  const [n, setN] = useState(10);
  const [p, setP] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("10 per page");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const [fetchRefresh, setFetchRefresh] = useState(false);
  const [cid, setCid] = useState(false);

  useEffect(() => {
    // Call your data fetch function here if needed
    // loadProjects();
  }, [fetchRefresh]);

  const handleProjectDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteProject({ id: deleteSelected });
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setFetchRefresh(!fetchRefresh);
      setDeleteSelected(null);
    }
  };
  const handleProjectDeleteBulk = async (Projectarray) => {
    try {
      await deleteProject({ id: Projectarray, selectAll });
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setFetchRefresh(!fetchRefresh);
      setDeleteSelected(null);
    }
  };

  const handleProjectSelect = async (projectId) => {
    setDeleteSelected(null);
    try {
      const data = await fetchProjectDetails(projectId);
      setSelectedProject(data.data);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  };

  const handleAddProject = async (e) => {
    // e.preventDefault();
    const formData = new FormData(e.target);
    const newProject = {};

    formData.forEach((value, key) => {
      newProject[key] = value;
    });

    try {
      await addProject(newProject);
      e.target.reset(); // Reset the form fields
      setFetchRefresh(!fetchRefresh);
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const handleUpdateProject = async (e) => {
    if (!selectedProject) return;

    const formData = new FormData(e.target);
    const updatedProject = {};

    formData.forEach((value, key) => {
      updatedProject[key] = value;
    });

    try {
      await updateProjectDetails(selectedProject._id, updatedProject);
      setFetchRefresh(!fetchRefresh);
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const columns = [
    { label: "Name", key: "name" },
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
      alignValues: "end",
      nosort: true,
      stopProp: true,
      render: (entry) => (
        <div>
          <span
            onClick={() =>
              navigate(`/project`, { state: { id: entry._id, pid: entry._id } })
            }
            className="material-symbols-outlined"
          >
            visibility
          </span>
          <span
            style={{ transform: "rotate(90deg)" }}
            className="material-symbols-outlined"
          >
            horizontal_rule
          </span>
          <span
            onClick={() => handleProjectSelect(entry._id)}
            className="material-symbols-outlined"
          >
            edit
          </span>
          <span
            style={{ transform: "rotate(90deg)" }}
            className="material-symbols-outlined"
          >
            horizontal_rule
          </span>
          <span
            onClick={() => {
              setDeleteSelected(entry._id);
              setSelectedProject(null);
            }}
            className="material-symbols-outlined"
          >
            delete
          </span>
        </div>
      ),
    },
  ];

  const handleCancel = () => {
    setSelectedProject(null);
  };

  const handleDeleteCancel = () => {
    setDeleteSelected(null);
  };

  const [searchType, setSearchType] = useState({
    showName: "Like",
    name: "like",
  });
  const [searchBy, setSearchBy] = useState({ showName: "Name", name: "name" });
  const [searchValue, setSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const handleClose = () => setShowAddModal(false);
  const [selectAll, setSelectAll] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className="projects-container">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="projects"
        />
      )}
      <div className="d-flex flex-wrap justify-content-between mb-2">
        <h2 id="ProjectTitle">Projects</h2>
        <div className="d-flex gap-3 flex-wrap">
          <SearchBarDropdown
            searchType={searchType}
            setSearchType={setSearchType}
            name="search"
            setSearchValue={setSearchValue}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            searchByList={[{ showName: "Name", name: "name" }]}
            onlyOne={true}
          />
          <ButtonHeader
            onClick={() => setShowAddModal(true)}
            text="Add Project"
          />
          <GetHelpButton
            toggle={toggle}
            settoggle={settoggle}
            videoInfoError={videoInfoError}
          />
        </div>
      </div>
      {/* Add Project Form */}
      <ModalComponent
        isOpen={showAddModal}
        handleClose={handleClose}
        handleSubmit={handleAddProject}
        title="Add Project"
        footerButtons={[
          {
            onClick: handleClose,
            className: "btn-light",
            type: "button",
            label: "Cancel",
          },
          {
            onClick: handleAddProject,
            className: "btn-primary",
            label: "Add",
            type: "submit",
          },
        ]}
      >
        <label className="font-weight-bold" htmlFor="name">
          Project Name
          <input
            className="form-control border-primary "
            type="text"
            name="name"
            placeholder="Project Name"
            required
          />
        </label>
      </ModalComponent>

      {/* Project List */}
      <TableComponent
        columns={columns}
        route="projects"
        dataRoute="data"
        searchBy={searchBy.name} // Adjust searchBy as per your need
        searchType={searchType.name} // Adjust searchType as per your need
        searchValue={searchValue}
        fetchRefresh={fetchRefresh} // Adjust fetchRefresh as per your need
        setFetchRefresh={setFetchRefresh} // Implement fetchRefresh logic here
        setP={setP}
        n={n} // Adjust limit as per your need
        p={p} // Adjust currentPage as per your need
        keyProp="name" // Adjust keyProp as per your need
        value="" // Adjust value as per your need
        noDataMessage="No data available"
        PaginationEnabled={true} // Adjust pagination logic here
        setPage={setPage} // Implement pagination logic here
        setperPage={setPerPage} // Implement pagination logic here
        perPage={perPage} // Adjust perPage as per your need
        setN={setN} // Implement pagination logic here
        page={page} // Adjust page as per your need
        totalPages={totalPages} // Adjust totalPages as per your need
        setTotalPages={setTotalPages} // Implement pagination logic here
        setcid={setCid} // Implement setCid logic here
        DeleteFun={handleProjectDeleteBulk} // Implement delete logic here
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />

      {/* Edit Project Modal */}
      <ModalComponent
        isOpen={!!selectedProject}
        handleClose={handleCancel}
        handleSubmit={handleUpdateProject}
        title="Edit Project"
        footerButtons={[
          {
            onClick: handleCancel,
            className: "btn-light",
            label: "Cancel",
          },
          {
            onClick: handleUpdateProject,
            className: "btn-primary",
            label: "Update",
            type: "submit",
          },
        ]}
      >
        <label className="font-weight-bold" htmlFor="name">
          Update Name
          <input
            className="form-control border-primary"
            defaultValue={selectedProject?.name}
            type="text"
            name="name"
            placeholder="Update Name"
            required
          />
        </label>
      </ModalComponent>

      {/* Delete Project Modal */}
      <ModalComponent
        isOpen={!!deleteSelected}
        handleClose={handleDeleteCancel}
        handleSubmit={handleProjectDelete}
        title="Delete Project"
        footerButtons={[
          {
            onClick: handleDeleteCancel,
            className: "btn-light",
            label: "Cancel",
          },
          {
            onClick: handleProjectDelete,
            className: "btn-danger",
            label: "Delete",
            type: "submit",
          },
        ]}
      >
        <div>
          <p>Are you sure you want to delete this project?</p>
        </div>
      </ModalComponent>
    </div>
  );
};

export default Projects;
