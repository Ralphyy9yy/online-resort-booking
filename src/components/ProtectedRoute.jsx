import React from "react";
import { Navigate } from "react-router-dom";

// Protect the dashboard route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If there's no token, redirect to login page
    return <Navigate to="/login" />;
  }

  // Otherwise, allow access to the dashboard
  return children;
};

export default ProtectedRoute;
