import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const token = Cookies.get("user");

  if (!token) {
    return <Navigate to="/authentication/sign-in" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 10000;

    if (decodedToken.exp < currentTime) {
      Cookies.remove("user");
      return <Navigate to="/authentication/sign-in" />;
    }

    if (decodedToken.scope === 'ROLE_USER') {
      return <Navigate to="/feature-section" />;
    }
  } catch (error) {
    return <Navigate to="/not-found" />;
  } 

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
