import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../GlobalContext";
import { Navigate, Outlet } from "react-router-dom";

export default function Auth() {
  const { auth, isLoad, dispatch } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth?.companyData?.data[0]?.isVerified !== undefined) {
      setIsLoading(false); // Data is available, stop loading
    }
  }, [auth?.companyData?.data[0]?.isVerified]);

  if (isLoad || isLoading) {
    // Display a loading spinner or placeholder while loading
    return;
  }

  if (auth?.companyData?.data[0]?.isVerified) {
    return <Outlet />; // Render children if verified
  } else {
    return <Navigate to="/" />; // Redirect if not verified
  }
}
