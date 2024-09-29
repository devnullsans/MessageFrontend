import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./Custom.css";
import "./style.css";
import "./App.css";

import "./index.css";
// import "./assets/adminkit/vendors/feather/feather.css";
// import "./assets/adminkit/vendors/ti-icons/css/themify-icons.css";
// import "./assets/adminkit/vendors/css/vendor.bundle.base.css";
// import "./assets/adminkit/vendors/select2/select2.min.css";
// import "./assets/adminkit/vendors/feather/feather.css";
// import "./assets/adminkit/vendors/font-awesome/css/font-awesome.min.css";
// Plugin css for this page
// import "./assets/adminkit/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
createRoot(document.getElementById("root")).render(<App />);
