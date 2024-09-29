import axios from "axios";

export const fetchProjectDetails = async (projectId) => {
  try {
    const response = await axios.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project details for ${projectId}:`, error);
    throw error;
  }
};

export const addProject = async (projectData) => {
  try {
    const response = await axios.post(`/projects`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

export const updateProjectDetails = async (id, projectData) => {
  try {
    const response = await axios.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project details for ${id}:`, error);
    throw error;
  }
};
export const deleteProject = async (data) => {
  try {
    const response = await axios.delete(`/projects`, { data });
    return response.data;
  } catch (error) {
    console.error(`Error deleting project for ${id}:`, error);
    throw error;
  }
};
