import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "./GlobalContext";
import Layout from "./pages/Layout";
import axios from "axios";
import "material-symbols";
import AxiosInterceptorSetup from "./utils/setupAxiosInterceptors";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Loader /> */}
        <GlobalProvider>
          <AxiosInterceptorSetup />
          <Routes>
            <Route path="*" element={<Layout />} />
          </Routes>
        </GlobalProvider>
      </BrowserRouter>
      <Toaster
        // toastOptions={{ duration: 500 }}
        position="top-right"
        containerStyle={{
          zIndex: 999999999999,
        }}
      />    </>
  );
}

export default App;
