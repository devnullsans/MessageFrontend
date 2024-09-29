import axios from "axios";

export const fetchExportData = async (
  route,
  sortBy,
  order,
  n,
  p,
  searchType,
  searchBy,
  searchValue,
  routeLogic
) => {
  try {
    const response = await axios.get(`${route}?${routeLogic}`, {
      params: {
        sortBy,
        order,
        n,
        p,

        searchType,
        searchBy,
        searchValue,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data:`, error);
    throw error;
  }
};
export const fetchExportAllData = async (route) => {
  try {
    const response = await axios.get(`/${route}`, {});
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details for ${route}:`, error);
    throw error;
  }
};
