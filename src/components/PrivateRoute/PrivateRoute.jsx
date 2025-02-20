import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "../../pages/HomePage/HomePage";

const PrivateRoute = () => {
  const vendor = useSelector((state) => state.vendor.vendor);

  return vendor ? <HomePage /> : <Navigate to="/" />;
};

export default PrivateRoute;
