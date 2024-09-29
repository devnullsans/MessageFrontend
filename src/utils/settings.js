import axios from "axios";

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`/settings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    throw error;
  }
};

export const updateSettings = async (data) => {
  try {
    const response = await axios.put(`/settings`, { data });
    return response.data;
  } catch (error) {
    console.error("Error updating Settings configuration:", error);
    throw error;
  }
};
