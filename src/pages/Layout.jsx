import { Route, Routes, useNavigate } from "react-router-dom";
import { GlobalContext, GlobalProvider } from "../GlobalContext"; // Ensure the path is correct

// import StructuredLayout from "../Components/StructuredLayout";

import Auth from "../components/Auth";
import DeAuth from "../components/Deauth";
import Login from "./Login";

import StructuredLayout from "./StructuredLayout";

import Dashboard from "./Dashboard";

import { Helmet } from "react-helmet";
import { useContext, useEffect } from "react";

const Layout = () => {
  const { fetchGlobalData, global } = useContext(GlobalContext);
  useEffect(() => {
    fetchGlobalData();
  }, []);

  return (
    <>
      <Helmet>
        <link rel="icon" id="favicon" href={global[0]?.favicon?.url || `${import.meta.env.VITE_LOGO_URL}`} />
      </Helmet>
      <Routes>
        {/* <Route element={<Auth />}> */}
          <Route element={<StructuredLayout />}>
             <Route path="/dashboard" element={<Dashboard />} />
            
          </Route>
          <Route path="*" element={<p>Not Found</p>} />

          {/* <Route element={<StructuredLayout />}></Route> */}
          {/* <Route path="/plans" element={<Plans />} />
        <Route path="/planbuy/:pid" element={<Planbuy />} /> */}
        {/* </Route> */}
        {/* <Route element={<DeAuth />}> */}
    
          <Route path="/login" element={<Login />} />

          {/* <Route path="/something-wrong" element={<SomethingWrong />} />
        <Route path="/success" element={<Successful />} />
        
        <Route path="/email-verification" element={<GetOtp />} />
        <Route path="/link-sent" element={<LinkSent />} />
         */}
        {/* </Route> */}
      </Routes>
    </>
  );
};

export default Layout;
