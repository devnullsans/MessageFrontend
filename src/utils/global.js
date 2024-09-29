import axios from "axios";

export const fetchGlobal = async () => {
  try {
    const response = await axios.get(`/global`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    throw error;
  }
};
