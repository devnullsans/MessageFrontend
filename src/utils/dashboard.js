import axios from "axios";

export const dashboard = async () => {
  try {
    const response = await axios.get(`/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    throw error;
  }
};
