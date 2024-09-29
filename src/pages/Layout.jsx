import { Route, Routes, useNavigate } from "react-router-dom";
import { GlobalContext, GlobalProvider } from "../GlobalContext"; // Ensure the path is correct

// import StructuredLayout from "../Components/StructuredLayout";

import Register from "./Register";
import Auth from "../components/Auth";
import DeAuth from "../components/Deauth";
import PageOne from "./PageOne";
import Login from "./Login";
import ForgetPass from "./ForgetPass";
import ResetPass from "./ResetPass";
import NotFound from "./NotFound";
import StructuredLayout from "./StructuredLayout";
import Projects from "./Projects";
import EmailManagement from "./EmailManagement";
import Verify from "./verify";
import Project from "./Project";
import Settings from "./Settings";
import API from "./API";
import IP from "./IP";
import Dashboard from "./Dashboard";
import BulkEmailUpload from "./BulkEmailUpload";
import APILogs from "./APILogs";
import MobileNumber from "./MobileNumber";
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
            {/*<Route path="/email" element={<EmailManagement />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project" element={<Project />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api" element={<API />} />
            <Route path="/ip" element={<IP />} />
            <Route path="/bulk-email-upload" element={<BulkEmailUpload />} />
            <Route path="/bulk-ip-upload" element={<BulkEmailUpload />} />
            <Route path="/bulk-project-ip-upload" element={<BulkEmailUpload />} />
            <Route path="/bulk-project-mobile-upload" element={<BulkEmailUpload />} />
            <Route path="/bulk-mobile-upload" element={<BulkEmailUpload />} />
            <Route path="/api-logs" element={<APILogs />} />
            <Route path="/mob" element={<MobileNumber />} />
            <Route path="/bulk-project-email-upload" element={<BulkEmailUpload />} /> */}
          </Route>
          <Route path="*" element={<NotFound />} />

          {/* <Route element={<StructuredLayout />}></Route> */}
          {/* <Route path="/plans" element={<Plans />} />
        <Route path="/planbuy/:pid" element={<Planbuy />} /> */}
        {/* </Route> */}
        {/* <Route element={<DeAuth />}> */}
          <Route path="/" element={<PageOne />} />
          <Route path="/verify-otp" element={<Verify />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-pass" element={<ForgetPass />} />
          <Route path="/reset-password" element={<ResetPass />} />
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
