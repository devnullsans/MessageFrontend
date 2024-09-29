import axios from "axios";

export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const response = await axios.get(`/company/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee details for ${employeeId}:`, error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`/company/employee`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

export const updateEmployeeDetails = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(
      `/company/employee/${employeeId}`,
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating employee details for ${employeeId}:`, error);
    throw error;
  }
};
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`/company/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee for ${employeeId}:`, error);
    throw error;
  }
};
