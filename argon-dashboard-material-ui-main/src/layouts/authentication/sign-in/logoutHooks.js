import React from "react";
import { useGoogleLogout } from "react-google-login";

const clientId =
  "576683154565-adkki79r5dvm6v4j8alacmbg73cagt72.apps.googleusercontent.com";

function LogoutHooks() {
  const onLogoutSuccess = () => {
    alert("Logout is successful");
  };

  const onFailure = () => {
    console.log("Handle failure case");
  };

  const { signOut } = useGoogleLogout({ clientId, onLogoutSuccess, onFailure });

  return (
    <button onClick={signOut} className="button">
      <img src="icons/google.svg" alt="google icon" className="icon" />
      <span className="buttonText"> Sign out</span>
    </button>
  );
}

export default LogoutHooks;