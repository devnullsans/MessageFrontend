import axios from "axios";

export const fetchSmtp = async (id = "") => {
  try {
    const response = await axios.get(`/smtps${id ? `/${id}` : ""}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    throw error;
  }
};

export const createSmtp = async (smtpData) => {
  try {
    const response = await axios.post("/smtps", smtpData);
    return response.data;
  } catch (error) {
    console.error("Error creating SMTP configuration:", error);
    throw error;
  }
};

export const updateSmtp = async (id, smtpData) => {
  try {
    const response = await axios.put(`/smtps/${id}`, smtpData);
    return response.data;
  } catch (error) {
    console.error("Error updating SMTP configuration:", error);
    throw error;
  }
};

export const setDefaultSmtp = async (smtpId) => {
  try {
    const response = await axios.put(`/smtps/set-default/${smtpId}`);
    return response.data;
  } catch (error) {
    console.error("Error setting default SMTP configuration:", error);
    throw error;
  }
};

export const verifySmtp = async (id) => {
  try {
    const response = await axios.get(`/smtps/verify/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying SMTP configuration:", error);
    throw error;
  }
};

export const deleteSmtp = async (id) => {
  try {
    const response = await axios.delete(`/smtps/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting SMTP configuration:", error);
    throw error;
  }
};
