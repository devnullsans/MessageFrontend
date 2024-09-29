// axiosConfig.js
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";

export const setupAxiosInterceptors = () => {
  const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();

  axios.interceptors.request.use(
    (config) => {
      dispatch({ type: "LOADING", payload: true });
      return config;
    },
    (error) => {
      dispatch({ type: "LOADING", payload: false });
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      dispatch({ type: "LOADING", payload: false });
      return response;
    },
    (error) => {
      dispatch({ type: "LOADING", payload: false });
      if (error.response) {
        console.error(error);
        // toast.success(error.response.data.message);

        if (error.response.status === 401 || error.response.status === 403) {
          dispatch({ type: "COMPANYDATA", payload: null });
          navigate("/");
        }

        if (error.response.status === 503) {
          dispatch({ type: "COMPANYDATA", payload: null });

          navigate("/maintainence");
        }
      }

      return Promise.reject(error);
    }
  );
};
