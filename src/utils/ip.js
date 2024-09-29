import axios from "axios";
import toast from "react-hot-toast";

// Function to send an email

// Function to block an email
export const blockIP = async (ipData) => {
  try {
    const response = await axios.post(`/ipblock`, ipData);
    return response.data;
  } catch (error) {
    console.error("Error blocking ip:", error);

    throw error;
  }
};

// Function to unblock an email
export const unblockIP = async (ipData) => {
  try {
    const response = await axios.post(`/ipunblock`, ipData);
    return response.data;
  } catch (error) {
    console.error("Error unblocking ip:", error);
    throw error;
  }
};
