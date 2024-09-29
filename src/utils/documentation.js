import axios from "axios";

// Function to send an email

// Function to block an email
export const documentation = async (modelName) => {
  try {
    const response = await axios.get(`/documentation/${modelName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documentation:", error);

    throw error;
  }
};
