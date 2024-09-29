import axios from "axios";
import toast from "react-hot-toast";

// Function to block a mobile number
export const blockMob = async (mobData) => {
  try {
    const response = await axios.post(`/mobblock`, mobData);
    return response.data;
  } catch (error) {
    console.error("Error Blocking Mobile Number:", error);
    throw error;
  }
};

// Function to unblock a mobile number
export const unblockMob = async (mobData) => {
  try {
    const response = await axios.post(`/mobunblock`, mobData);
    return response.data;
  } catch (error) {
    console.error("Error Unblocking Mobile Number:", error);
    throw error;
  }
};
