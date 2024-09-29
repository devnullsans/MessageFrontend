import React, { useEffect, useState } from "react";
import Pattern from "../assets/images/Pattern.png";
import Loader from "./Loader";
import { documentation } from "../utils/documentation";

function VideoTutorialComponent({
  modelName,
  toggle,
  settoggle,
  setVideoInfoError,
  videoInfoError,
}) {
  const [video, setVideo] = useState(false);
  const [videoInfo, setVideoInfo] = useState([]);
  const [load, setload] = useState(false);
  const fetchDataTutorial = async () => {
    try {
      const response = await documentation(modelName);
      if (!response?._id) {
        // Success(data.error, "error");
        setVideoInfoError(true);

        return;
      }

      setVideoInfo(response.content || []);
    } catch (error) {
      console.error("Failed to get documentation:", error);
    }
  };

  useEffect(() => {
    if (modelName) fetchDataTutorial();
  }, [modelName]);

  const capitalizeFirstLetterOfEachWord = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div>
      {toggle && (
        <div className="p-0 m-0 w-100">
          <div
            className="accordion btn btn-primary bg-primary btn-block p-0 m-0 mb-2"
            id="accordionExample"
          >
            <div
              className="accordion-item"
              style={{ borderRadius: 10, border: "none" }}
            >
              <div
                className={`btn btn-primary w-100 p-0 m-0 ${
                  toggle && "collapsed"
                }`}
                type="button"
                style={{
                  borderRadius: 10,
                  rowGap: 10,
                  backgroundImage: `url(${Pattern})`,
                  backgroundSize: "cover",
                }}
              >
                <div className="py-1 pe-2 m-0 w-100 text-end">
                  <span
                    onClick={() => settoggle(!toggle)}
                    style={{
                      transform: "rotate(-90deg)",
                      borderRadius: "200px",
                      opacity: "0.5",
                    }}
                    className="material-symbols-outlined colorb p-1 m-0 bg-white"
                  >
                    close
                  </span>
                </div>
                {videoInfoError ? (
                  <div
                    style={{ rowGap: 20 }}
                    className={`video mobile2 px-3 py-0 mt-3 mb-5 d-flex text-center justify-content-between align-items-center text-white ${
                      toggle && "collapsed"
                    }`}
                  >
                    <p className="h2 col-4 mobile p-0 m-0 align-items-center desktop-text">
                      No Tutorial
                    </p>
                    <p className="h4 col-5 mobile p-0 m-0 align-items-center desktop-text">
                      Currently there is no tutorial
                    </p>
                    <p className="h3 mobile p-0 m-0 text-center mobile-text">
                      No Tutorial
                    </p>
                    <p className="h5 mobile p-0 m-0 text-center mobile-text">
                      Currently there is no tutorial
                    </p>
                  </div>
                ) : (
                  videoInfo.map((item, index) => (
                    <div key={index} className="">
                      <div
                        style={{ rowGap: 20 }}
                        className={`video mobile2 w-100 px-3 py-0 mt-3 mb-5 d-flex text-center justify-content-between align-items-center text-white ${
                          toggle && "collapsed"
                        }`}
                      >
                        <p className="h2 col-4 mobile p-0 m-0 align-items-center desktop-text">
                          {capitalizeFirstLetterOfEachWord(item.title)}
                          {/* {item.title} */}
                        </p>
                        <p className="h4 col-5 mobile p-0 m-0 align-items-center desktop-text">
                          {item.description}
                        </p>
                        <p className="h3 mobile p-0 m-0 text-center mobile-text">
                          {capitalizeFirstLetterOfEachWord(item.title)}
                        </p>
                        <p className="h5 mobile p-0 m-0 text-center mobile-text">
                          {item.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideo(true);
                          }}
                          className="btn btn-light mobile p-2 d-flex justify-content-between gap-2 align-items-center my-2"
                        >
                          <p className="p-0 m-0">Video Tutorial</p>
                          <span
                            style={{ transform: "rotate(-45deg)" }}
                            className="material-symbols-outlined colorb p-0 m-0"
                          >
                            arrow_forward
                          </span>
                        </button>
                      </div>
                      {videoInfo.length > index + 1 && (
                        <div
                          style={{
                            height: "2px",
                            backgroundColor: "white",
                            margin: "10px 0",
                          }}
                        ></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {video && (
        <div
          style={{
            zIndex: 99999,
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setVideo(false)}
        >
          <div
            style={{
              position: "absolute",
              height: "100vh",
              width: "100vw",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          ></div>

          <div
            style={{
              borderRadius: "10px",
              maxHeight: "90vh",
              backgroundColor: "black",
              position: "relative",
              zIndex: 1,
              overflowY: "auto",
            }}
            className="p-0 m-0 d-flex "
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                minWidth: 325,
                overflowY: "scroll",
                overflowX: "hidden",
                height: "fit-content",
                maxHeight: "80vh",
                backgroundColor: "grey",
              }}
              className="m-0 p-0 customPopupWidthVideo "
            >
              <div
                style={{
                  backgroundColor: "#2563EB",
                  position: "sticky",
                  overflow: "hidden",
                  top: 0,
                  zIndex: 1,
                }}
                className="modal-header"
              >
                <h5 className="colorw " id="exampleModalLongTitle">
                  Video Tutorials
                </h5>
                <button
                  onClick={() => setVideo(false)}
                  type="button"
                  className="close colorw pt-4 pe-4"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div style={{ backgroundColor: "grey" }} className="card   w-100">
                {videoInfo.map((item) =>
                  item.videos.map((link, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        maxWidth: "100%",
                        background: "#000",
                        marginBottom: "10px",
                      }}
                    >
                     
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          link.split("/")[3]
                        }`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Loader load={load} />
    </div>
  );
}

export default VideoTutorialComponent;
