import axios from "axios";

export const generateApi = async () => {
  try {
    const response = await axios.get(`/api-generate`);
    return response.data;
  } catch (error) {
    console.error(`Error generating api:`, error);
    throw error;
  }
};

export const getKeys = async () => {
  try {
    const response = await axios.get(`/api-keys`);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

export const updateApiKeyDetails = async (apiId, employeeData) => {
  try {
    const response = await axios.put(`/api-keys/${apiId}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee details for ${apiId}:`, error);
    throw error;
  }
};
export const deleteApiKey = async (data) => {
  try {
    const response = await axios.delete(`/api-keys`, { data });
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee for ${data}:`, error);
    throw error;
  }
};
