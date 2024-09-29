import axios from "axios";
import toast from "react-hot-toast";

// Function to send an email
export const sendEmail = async (emailData) => {
  try {
    const response = await axios.post(`/send`, emailData);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Function to block an email
export const blockEmail = async (emailData) => {
  try {
    const response = await axios.post(`/block`, emailData);
    return response.data;
  } catch (error) {
    console.error("Error blocking email:", error);

    throw error;
  }
};

// Function to unblock an email
export const unblockEmail = async (emailData) => {
  try {
    const response = await axios.post(`/unblock`, emailData);
    return response.data;
  } catch (error) {
    console.error("Error unblocking email:", error);
    throw error;
  }
};
