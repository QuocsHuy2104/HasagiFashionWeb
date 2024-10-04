import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// @mui material components
import ArgonBox from "layouts/authentication/Log-out/components/ArgonBox";
import ArgonTypography from "layouts/authentication/Log-out/components/ArgonTypography";

function LogOut() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post("http://localhost:3000/api/account/logout", {}, { withCredentials: true });
        setMessage("Đăng xuất thành công.");
        navigate("/authentication/sign-in");
      } catch (error) {
        setMessage("Đăng xuất không thành công.");
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <ArgonBox
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={3}
      py={5}
    >
      {message && (
        <ArgonBox mb={3}>
          <ArgonTypography variant="body1" color="error" textAlign="center">
            {message}
          </ArgonTypography>
        </ArgonBox>
      )}
    </ArgonBox>
  );
}

export default LogOut;
