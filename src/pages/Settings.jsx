import React, { useContext, useEffect, useState } from "react";
import SMTP from "../components/SMTP";
import { GlobalContext } from "../GlobalContext";
import { updateSettings } from "../utils/settings";
import VideoTutorialComponent from "../components/VideoTutorialComponent";
import GetHelpButton from "../components/GetHelpButton";
import AWSComponent from "../components/AWSComponent";
import Assets from "../components/Assets";

function Settings() {
  const { fetchSettingsData, settings } = useContext(GlobalContext);
  useEffect(() => {
    fetchSettingsData();
  }, []);
  const UpdateSettings = async (e) => {
    try {
      const response = await updateSettings({
        ...settings[0],
        globalBlockList: e.target.checked,
      });

      fetchSettingsData();

      // Handle the verification result here (e.g., show a success message)
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };
  const [toggle, settoggle] = useState(false);
  const [videoInfoError, setVideoInfoError] = useState(false);
  return (
    <div className=" mt-4">
      {!videoInfoError && (
        <VideoTutorialComponent
          videoInfoError={videoInfoError}
          setVideoInfoError={setVideoInfoError}
          toggle={toggle}
          settoggle={settoggle}
          modelName="ip"
        />
      )}
      <div className="d-flex justify-content-between me-4">
        <h2 className="mb-4 ms-4">Settings</h2>
        <GetHelpButton
          toggle={toggle}
          settoggle={settoggle}
          videoInfoError={videoInfoError}
        />
      </div>
      <SMTP settings={settings} fetchSettingsData={fetchSettingsData} />
      <AWSComponent />
      <Assets fetchSettingsData={fetchSettingsData} settings={settings} />
      <div className="col-12 d-flex flex-wrap grid-margin stretch-card">
        <div className="col-lg-12 col-md-12 gap-3 grid-margin stretch-card mt-3">
          <div className="card shadow p-3 mb-4 h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">Global Block List</h4>
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2 my-2"
                  id="globalBlockList"
                  defaultChecked={settings[0]?.globalBlockList}
                  onClick={UpdateSettings}
                />
                <label className="form-check-label ms-2" htmlFor="globalBlockList">
                  Enable Global Block List
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
