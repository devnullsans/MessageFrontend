import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";
import { Helmet } from "react-helmet";

function Navbar({ toggle, settoggle }) {
  const [logourl, setLogoUrl] = useState("");
  const [logominiurl, setLogoMiniUrl] = useState("");
  const [favicon, setFavicon] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(GlobalContext);
  const { fetchSettingsData, settings, fetchGlobalData, global } = useContext(GlobalContext);

  useEffect(() => {
    fetchSettingsData();
    fetchGlobalData();
  }, []);

  return (
    <nav className=" w-100 z-10 bg-white shadow-md">
      <div className="  flex items-center justify-between px-4 py-3">
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
          <a className="text-lg font-bold text-gray-900" href="/dashboard">
            {/* <img
              src={settings[0]?.logo?.url || global[0]?.logo?.url || logourl}
              onError={(e) => (e.target.src = "/path/to/default-logo.svg")}
              alt="logo"
              className="h-8 w-auto"
            /> */}
            Dashboard
          </a>
          <a className="ml-4 text-lg font-bold text-gray-900" href="/dashboard">
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
          className="lg:hidden text-gray-900"
          onClick={() => settoggle(!toggle)}
        >
          <span className="material-icons">menu</span>
        </button>

        {/* Navbar Menu */}
        <div className="hidden lg:flex lg:items-center">
          <ul className="flex space-x-6">
            <li className="relative">
              <a
                className="flex items-center text-gray-900 hover:text-gray-600"
                href="#"
                id="navbarDropdown"
                role="button"
              >
                {/* Profile Avatar */}
                {/* <img
                  src="/path/to/avatar.svg"
                  alt="profile"
                  className="h-8 w-8 rounded-full"
                /> */}
                Profile
              </a>
              {/* Dropdown Menu */}
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-1 hidden group-hover:block">
                <li>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <i className="bi bi-gear pe-2"></i> Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => dispatch({ type: "SIGNOUT" })}
                  >
                    <i className="bi bi-box-arrow-right pe-2"></i> Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
