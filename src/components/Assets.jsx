import React, { useContext, useEffect, useState } from "react";
import { uploadAsset } from "../utils/assets"; // Import the API call from assets.js
import emaillogo from "../assets/react.svg";
import logo from "../assets/react.svg";
import logo_mini from "../assets/react.svg";

import { GlobalContext } from "../GlobalContext";
import { Helmet } from "react-helmet";
const Assets = ({ fetchSettingsData, settings }) => {
  const { fetchGlobalData, global } = useContext(GlobalContext);

  const [logourl, setLogoUrl] = useState("");
  const [logourldark, setLogoUrlDark] = useState("");
  const [minilogourl, setMiniLogoUrl] = useState("");
  const [faviconurl, setFaviconUrl] = useState("");
  const [emailLogourl, setEmailLogoUrl] = useState("");
  const [load, setLoad] = useState(false);
  const logoDMS = logo; // Set fallback/default image path
  useEffect(() => {
    setLogoUrl(settings[0]?.logo?.url || global[0]?.logo?.url);
    setMiniLogoUrl(settings[0]?.smlogo?.url || global[0]?.smlogo?.url);
    setFaviconUrl(settings[0]?.favicon?.url || global[0]?.favicon?.url);
    setEmailLogoUrl(settings[0]?.emaillogo?.url || global[0]?.emaillogo?.url);
  }, [settings, global]);

  const PostData = async (event, file, assetType) => {
    event.preventDefault();
    setLoad(true);
    try {
      const { data } = await uploadAsset(file, assetType);

      fetchSettingsData();
    } catch (error) {
      console.error("Failed to upload asset:", error);
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    fetchGlobalData();
  }, []);

  return (
    <div className="mx-3 ">
      <Helmet>
        <link
          rel="icon"
          id="favicon"
          href={settings[0]?.favicon?.url || global[0]?.favicon?.url || `${import.meta.env.VITE_LOGO_URL}`}
        />
      </Helmet>
      <div className="col-12 grid-margin ">
        <div className="card shadow">
          <h3
            className="font-weight-bold d-flex"
            style={{
              backgroundColor: "#2563EB",
              borderRadius: "10px 10px 0px 0px",
            }}
          >
            <p className="m-1 pl-2 col-md-8 h3 py-2 colorw">Company Logo</p>
          </h3>
          <div className="card-body w-100">
            <div className="d-flex flex-wrap justify-content-between">
              {[
                { type: "logo", label: "Company Logo", imageUrl: logourl, fallbackImg: logo },

                {
                  type: "favicon",
                  label: "Favicon (16x16)",
                  imageUrl: faviconurl,
                  fallbackImg: favicon,
                },
                {
                  type: "smlogo",
                  label: "Company Mini Logo",
                  imageUrl: minilogourl,
                  fallbackImg: logo_mini,
                },
                {
                  type: "emaillogo",
                  label: "Company Email Logo",
                  imageUrl: emailLogourl,
                  fallbackImg: emaillogo,
                },
              ].map(({ type, label, imageUrl, fallbackImg }, idx) => (
                <div key={idx} className="form-file col-lg-2 col-md-6 col-sm-12 text-center">
                  {label}
                  <div className="col-lg-12 m-auto" style={{ height: "100px", width: "100px", padding: "5px" }}>
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          position: "absolute",
                          top: "45%",
                          transform: "translate(200%,-150%)",
                          border: "1px solid var(--primary )",
                          opacity: "0.8",
                          backgroundColor: "white",
                          borderRadius: "100px",
                          padding: "2px",
                          color: "var(--primary)",
                          zIndex: 999,
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="form-file-input d-none"
                          id={`customFile${idx + 1}`}
                          onChange={(e) => PostData(e, e.target.files[0], type)}
                        />
                        <label className="form-file-label col-md-12 p-0 m-0" htmlFor={`customFile${idx + 1}`}>
                          <span className="material-symbols-outlined">edit</span>
                        </label>
                      </span>
                      {load ? (
                        <p>...loading</p>
                      ) : (
                        <img
                          style={{
                            padding: "10px",
                            position: "relative",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                          }}
                          width={100}
                          src={imageUrl}
                          alt={label}
                          onError={(e) => {
                            e.target.src = fallbackImg;
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assets;
