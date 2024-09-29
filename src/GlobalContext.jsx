import { createContext, useReducer, useContext, useState, useEffect } from "react";
import Loader from "./components/Loader";
import { Logout, fetchCompany } from "./utils/api";
import { fetchSettings } from "./utils/settings";
import { fetchGlobal } from "./utils/global";
// Create context
export const GlobalContext = createContext();

// Default state
const defaultState = {
  isLoad: false,
  companyData: null,
  loading: false,
  error: null, // Include error in the default state
  extra: null,
};

// Reducer
export const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SIGNIN": {
      return {
        ...state,
        token: payload, // Handle token for sign-in
        loading: false,
      };
    }

    case "SIGNOUT": {
      Logout();
      return { ...defaultState };
    }
    case "LOADING": {
      return { ...state, loading: payload };
    }
    case "COMPANYDATA": {
      return { ...state, companyData: payload };
    }
    case "FETCH_ERROR": {
      return { ...state, loading: false, error: payload };
    }
    default:
      return state;
  }
};

// Custom hook to use the context
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [auth, dispatch] = useReducer(authReducer, defaultState);
  const [countryCode, setCountryCode] = useState("in");
  const [settings, setSettings] = useState("");
  const [global, setGlobal] = useState("");

  const setLoading = (isLoading) => dispatch({ type: "LOADING", payload: isLoading });

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const response = await fetchCompany();

      dispatch({ type: "COMPANYDATA", payload: response });
    } catch (error) {
      console.error("Failed to fetch company data:", error);
      dispatch({ type: "COMPANYDATA", payload: null });
    } finally {
      setLoading(false);
    }
  };
  const fetchSettingsData = async () => {
    try {
      const response = await fetchSettings();
      setSettings(response);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const fetchGlobalData = async () => {
    try {
      const response = await fetchGlobal();
      setGlobal(response);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  useEffect(() => {
    auth.isLoad = true;
    fetchCompanyData();

    auth.isLoad = false;
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        auth,
        isLoad: auth.isLoad,
        dispatch,
        countryCode,
        AuthToken: auth.companyData, // Ensure this is used correctly
        fetchCompanyData,
        fetchSettingsData,
        setSettings,
        settings,
        global,
        setGlobal,
        fetchGlobalData,
      }}
    >
      <Loader load={auth.loading} />
      {children}
    </GlobalContext.Provider>
  );
};
