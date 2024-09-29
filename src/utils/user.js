import axios from "axios";

export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(`/company/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details for ${userId}:`, error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(`/company/user`, userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const updateUserDetails = async (userId, userData) => {
  try {
    const response = await axios.put(`/company/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user details for ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (UserId) => {
  try {
    const response = await axios.delete(`/company/User/${UserId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting Workspace for ${UserId}:`, error);
    throw error;
  }
};
