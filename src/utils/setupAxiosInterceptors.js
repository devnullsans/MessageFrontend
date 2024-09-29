import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";
import toast from "react-hot-toast";

const AxiosInterceptorSetup = () => {
  const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
  axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
  axios.defaults.headers.common["Content-Type"] = "application/json";
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        dispatch({ type: "LOADING", payload: true });
        return config;
      },
      (error) => {
        dispatch({ type: "LOADING", payload: false });
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        dispatch({ type: "LOADING", payload: false });
        response?.data?.message && toast.success(response?.data?.message);
        return response;
      },
      (error) => {
        dispatch({ type: "LOADING", payload: false });
        if (error?.response) {
          error?.response?.data?.message && toast.error(error?.response?.data?.message);

          if (error.response.status === 401) {
            // dispatch({ type: "SIGNOUT" });
            dispatch({ type: "COMPANYDATA", payload: null });
            navigate("/");
          }

          if (error?.response?.status === 503) {
            // dispatch({ type: "SIGNOUT" });
            dispatch({ type: "COMPANYDATA", payload: null });

            navigate("/maintainence");
          }
          // alert(error.response.data.message);
        }

        return Promise.reject(error);
      }
    );

    // Cleanup the interceptors when the component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, navigate]);

  return null;
};

export default AxiosInterceptorSetup;
