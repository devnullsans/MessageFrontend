import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function StructuredLayout() {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [pageBlur, setPageBlur] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div
      className={`flex flex-col w-screen h-screen ${!toggleSidebar ? "sidebar-icon-only" : ""} ${
        isDarkTheme ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Navbar */}
      

      {/* Sidebar and Content Wrapper */}
      <div className="flex w-full h-full overflow-hidden">
  {/* Sidebar and Main Content */}
  <Sidebar
    isSidebarOpen={toggleSidebar}
    setSidebarOpen={setToggleSidebar}
    setPageBlur={setPageBlur}
    pageBlur={pageBlur}
    isDarkTheme={isDarkTheme}
    setIsDarkTheme={setIsDarkTheme}
  />

  {/* Main Content Area */}
  <div className="flex-grow  overflow-y-auto overflow-x-hidden">
  <Navbar
      
      />
<Outlet/>
  </div>
</div>

    </div>
  );
}
