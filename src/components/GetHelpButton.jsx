import React from "react";

function GetHelpButton({ videoInfoError, settoggle, toggle }) {
  return (
    <>
      {!videoInfoError && (
        <button
          style={{ padding: 10, height: 48 }}
          onClick={() => settoggle(!toggle)}
          className="item item5 btn btn-primary d-flex justify-content-between gap-3 align-items-center p-0 m-0 px-3"
        >
          <div className="getHelpLaptop  justify-content-between gap-1 align-items-center p-0 m-0 ">
            <p className="h5 p-0 m-0">Get Help</p>
            <span className="material-symbols-outlined p-0 m-0">help</span>
          </div>
          <div className="getHelpMobile  justify-content-between  align-items-center p-0 m-0 ">
            <span className="material-symbols-outlined p-0 m-0">help</span>
          </div>
        </button>
      )}
    </>
  );
}

export default GetHelpButton;
