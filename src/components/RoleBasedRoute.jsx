import React from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role"); // stored on login

  return (
    <PrivateRoute>
      {allowedRoles && !allowedRoles.includes(role) ? (
        <Navigate to="/unauthorized" replace />
      ) : (
        children
      )}
    </PrivateRoute>
  );
};

export default RoleBasedRoute;