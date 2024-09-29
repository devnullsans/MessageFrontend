import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../GlobalContext";
import { Navigate, Outlet } from "react-router-dom";

export default function DeAuth() {
  const { auth } = useContext(GlobalContext);
  

  if (!auth?.companyData?.data[0]?.isVerified) {
    return <Outlet />; // DeAuth
  } else {
    return <Navigate to="/dashboard" />;
  }
}
