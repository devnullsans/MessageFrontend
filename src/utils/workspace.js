import axios from "axios";

export const fetchWorkspaceDetails = async (WorkspaceId) => {
  try {
    const response = await axios.get(`/company/Workspace/${WorkspaceId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching Workspace details for ${WorkspaceId}:`,
      error
    );
    throw error;
  }
};

export const addWorkspace = async (WorkspaceData) => {
  try {
    const response = await axios.post(`/company/Workspace`, WorkspaceData);
    return response.data;
  } catch (error) {
    console.error("Error adding Workspace:", error);
    throw error;
  }
};

export const updateWorkspaceDetails = async (WorkspaceId, WorkspaceData) => {
  try {
    const response = await axios.put(
      `/company/Workspace/${WorkspaceId}`,
      WorkspaceData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating Workspace details for ${WorkspaceId}:`,
      error
    );
    throw error;
  }
};
export const deleteWorkspace = async (WorkspaceId) => {
  try {
    const response = await axios.delete(`/company/Workspace/${WorkspaceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting Workspace for ${WorkspaceId}:`, error);
    throw error;
  }
};
