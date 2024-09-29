// ModalComponent.jsx
import React from "react";

const ModalComponent = ({ isOpen, handleClose, handleSubmit, title, children, footerButtons, modalRef }) => {
  if (!isOpen) return null;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="">
      <div
        role="dialog"
        aria-modal="true"
        style={{
          display: isOpen ? "block" : "none",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 99999999,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          // backdropFilter: "blur(0px)",
        }}
        className="PosCent"
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="modal-dialog w-100 p-0 m-0 d-flex" role="document" ref={modalRef}>
            <form
              style={{
                borderRadius: "10px",
                minWidth: 305,
                maxWidth: 700,
              }}
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                handleSubmit(e); // Pass the event to the submit handler
              }}
              onKeyDown={handleKeyDown}
              className="modal-content PosCent me-0 pe-0"
            >
              <div
                style={{
                  backgroundColor: "#2563EB",
                  borderRadius: "10px 10px 0 0",
                }}
                className="modal-header"
              >
                <h5 className="modal-title colorw">{title}</h5>
                <button onClick={handleClose} type="button" className="close colorw pt-4 pe-4" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{children}</div>
              <div className="d-flex col-md-12 justify-content-between align-items-center mb-2 gap-2">
                {footerButtons.map((button, index) => (
                  <button
                    key={index}
                    type={button.type || "button"}
                    style={{ height: 48 }}
                    onClick={button.onClick}
                    className={`btn ${button.className} d-flex w-100 p-0 m-0 justify-content-center align-items-center`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
