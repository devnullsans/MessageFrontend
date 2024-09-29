import axios from "axios";

export const fetchAWS = async (id = "") => {
  try {
    const response = await axios.get(`/aws${id ? `/${id}` : ""}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AWS configuration:", error);
    throw error;
  }
};

export const createAWS = async (awsData) => {
  try {
    const response = await axios.post("/aws", awsData);
    return response.data;
  } catch (error) {
    console.error("Error creating AWS configuration:", error);
    throw error;
  }
};

export const updateAWS = async (id, awsData) => {
  try {
    const response = await axios.put(`/aws/${id}`, awsData);
    return response.data;
  } catch (error) {
    console.error("Error updating AWS configuration:", error);
    throw error;
  }
};

export const setDefaultAWS = async (awsId) => {
  try {
    const response = await axios.put(`/aws/set-default/${awsId}`);
    return response.data;
  } catch (error) {
    console.error("Error setting default AWS configuration:", error);
    throw error;
  }
};

export const deleteAWS = async (id) => {
  try {
    const response = await axios.delete(`/aws/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting AWS configuration:", error);
    throw error;
  }
};
