import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import toast from "react-hot-toast";
import VideoTutorialComponent from "../components/VideoTutorialComponent";
import GetHelpButton from "../components/GetHelpButton";
import { dashboard } from "../utils/dashboard";
import Barchart from "../components/Barchart";
import PieChart from "../components/PieChart";
import DoughnutChart from "../components/Doghnut";

function Dashboard() {
  const { dispatch } = useContext(GlobalContext);
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  const [dashboardData, setDashboardData] = useState("");
  const fetchDashboardData = async () => {
    try {
      const response = await dashboard();
      console.log("response", response);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  console.log("dashboardData", dashboardData);
  return (
    <div className=" ">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="dashboard"
        />
      )}
      <div className="d-flex justify-content-between">
        <h2>Dashboard</h2>
        <GetHelpButton toggle={toggle} settoggle={settoggle} videoInfoError={videoInfoError} />
      </div>
      <div className="">
        <Barchart Dashdata={dashboardData} />
      </div>
      <div className="d-flex justify-content-between px-5 my-5">
        <div
          style={{
            height: "500px",
            width: "500px",
          }}
          className=""
        >
          <DoughnutChart Dashdata={dashboardData} />
        </div>
        <div
          style={{
            height: "500px",
            width: "500px",
          }}
          className=""
        >
          <PieChart Dashdata={dashboardData} />
        </div>
      </div>

      {/* <span
        onClick={() => {
          dispatch({ type: "SIGNOUT" });
        }}
      >
        Logout
      </span> */}
    </div>
  );
}

export default Dashboard;
