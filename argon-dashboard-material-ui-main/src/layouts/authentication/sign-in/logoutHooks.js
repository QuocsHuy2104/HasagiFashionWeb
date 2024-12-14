import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

const LogoutHooks = () => {
  const handleLogout = () => {
    try {
      Cookies.remove("user");
      
      delete axios.defaults.headers.common["Authorization"];
      googleLogout();

      alert("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="576683154565-adkki79r5dvm6v4j8alacmbg73cagt72.apps.googleusercontent.com">
      <button onClick={handleLogout} className="button">
        <img src="icons/google.svg" alt="google icon" className="icon" />
        <span className="buttonText"> Sign out</span>
      </button>
    </GoogleOAuthProvider>
  );
};

export default LogoutHooks;
