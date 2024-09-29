import React from "react";
// eslint-disable-next-line react/prop-types
const Tracker = ({ currentStep, purpose = "bulk", isEmail }) => {
  const listOfItems = [];
  const bulkUpload = [
    "Upload",
    `${isEmail === 1 ? "IP Validation" : isEmail === 0 ? "Email Validation" : "Mobile Number Validation"}`,
    "Result",
  ];
  const webScraping = [
    "Select Website",
    `${isEmail === 1 ? "IP Validation" : isEmail === 0 ? "Email Validation" : "Mobile Number Validation"}`,
    "Start Blocking",
  ];
  switch (purpose) {
    case "bulk":
      listOfItems.push(...bulkUpload);
      break;
    case "scraping":
      listOfItems.push(...webScraping);
      break;
    default:
      break;
  }
  return (
    <div
      className="p-0 m-0 "
      style={{ backgroundColor: "#2563EB", borderRadius: "5px" }}
    >
      <div className="progress-bar ">
        {listOfItems.map((step, index) => (
          <div key={index} className="step-container pb-2">
            <div className="label">{step}</div>
            <div
              className={`circle ${index <= currentStep ? "active" : ""} ${index}`}
            >
              <span className="material-symbols-outlined">
                {index <= currentStep ? "check" : ""}
              </span>
            </div>
            {index < listOfItems.length - 1 && (
              <div
                className={`line ${index < currentStep ? "line-active" : ""}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Tracker;
