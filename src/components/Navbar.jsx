import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";
import { Helmet } from "react-helmet";

function Navbar() {
  const [logourl, setLogoUrl] = useState("");
  const [logominiurl, setLogoMiniUrl] = useState("");
  const [favicon, setFavicon] = useState("");
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();
  const { dispatch } = useContext(GlobalContext);
  const { fetchSettingsData, settings, fetchGlobalData, global } = useContext(GlobalContext);

  useEffect(() => {
    fetchSettingsData();
    fetchGlobalData();
  }, []);

  return (
    <nav className={`w-100 z-10 shadow-md ${darkMode ? "bg-dark text-white" : "bg-white text-gray-900"}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Helmet for favicon */}
        {/* 
        <Helmet>
          <link
            rel="icon"
            id="favicon"
            href={settings[0]?.favicon?.url || global[0]?.favicon?.url || `${import.meta.env.VITE_LOGO_URL}/${favicon}`}
          />
        </Helmet>
        */}

        {/* Logo */}
        <div className="flex items-center">
          <a className="text-lg font-bold" href="/dashboard">
            {/* <img
              src={settings[0]?.logo?.url || global[0]?.logo?.url || logourl}
              onError={(e) => (e.target.src = "/path/to/default-logo.svg")}
              alt="logo"
              className="h-8 w-auto"
            /> */}
            Dashboard
          </a>
          <a className="ml-4 text-lg font-bold" href="/dashboard">
            {/* <img
              src={settings[0]?.smlogo?.url || global[0]?.smlogo?.url || logominiurl}
              onError={(e) => (e.target.src = "/path/to/default-mini-logo.svg")}
              alt="mini-logo"
              className="h-8 w-auto"
              style={{ width: "60%", height: "60%", objectFit: "contain" }}
            /> */}
            D
          </a>
        </div>

        {/* Toggle Button for Sidebar */}
        <button
          className="lg:hidden text-gray-900 dark:text-white"
          onClick={() => setToggleSidebar(!toggleSidebar)}
        >
          <span className="material-icons">menu</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="ml-4 text-gray-900 dark:text-white"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Navbar Menu */}
        <div className="hidden lg:flex lg:items-center">
          <ul className="flex space-x-6">
            <li className="relative">
              <button
                className="flex items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {/* Profile Avatar */}
                {/* <img
                  src="/path/to/avatar.svg"
                  alt="profile"
                  className="h-8 w-8 rounded-full"
                /> */}
                Profile
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <ul className={`absolute right-0 mt-2 w-48 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-700"} shadow-lg rounded-md py-1`}>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <i className="bi bi-gear pe-2"></i> Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => dispatch({ type: "SIGNOUT" })}
                    >
                      <i className="bi bi-box-arrow-right pe-2"></i> Logout
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
