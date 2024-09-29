import axios from "axios";

export const registerCompany = async (companyData) => {
  try {
    const response = await axios.post(`/users/register`, companyData);

    return response;
  } catch (error) {
    console.error("Error registering company:", error);
    throw error;
  }
};
export const verifyCompany = async (verifyData) => {
  try {
    const response = await axios.post(`/users/verify-otp`, verifyData);
    return response.data;
  } catch (error) {
    console.error("Error registering company:", error);
    throw error;
  }
};
export const verifyCompanyReset = async (verifyData) => {
  try {
    const response = await axios.post(`/users/verify-otp-reset`, verifyData);
    return response.data;
  } catch (error) {
    console.error("Error registering company:", error);
    throw error;
  }
};

export const login = async (loginData) => {
  try {
    const response = await axios.post(
      `/users/login`,
      // `/company-user/login`,

      loginData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`/users/request-reset-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error during forgot password process:", error);
    throw error;
  }
};
export const resetPassword = async (email, password) => {
  try {
    const response = await axios.post(`/users/reset-password`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during reset password process:", error);
    throw error;
  }
};

// Define other API methods similarly...

export const Logout = async (navigate) => {
  try {
    const response = await axios.get(`/users/logout`);

    return response.data;
  } catch (error) {
    console.error("Error during reset password process:", error);
    throw error;
  }
};

// Define other API methods similarly...
export const fetchCompany = async () => {
  try {
    const response = await axios.get(`/users`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company`, error);
    throw error;
  }
};
