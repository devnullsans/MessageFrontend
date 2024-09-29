import React from "react";

function ButtonHeader({ text, icon = "add", onClick, btnType = "primary" }) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${btnType} d-flex justify-content-between gap-3 align-items-center `}
    >
      <p className="fs-6 p-0 m-0">{text}</p>
      {icon && (
        <span className="material-symbols-outlined p-0 m-0">{icon}</span>
      )}
    </button>
  );
}

export default ButtonHeader;
