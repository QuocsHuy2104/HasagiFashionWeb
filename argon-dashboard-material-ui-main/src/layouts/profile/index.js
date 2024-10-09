import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import FacebookIcon from "@mui/icons-material/Facebook";
import Card from "@mui/material/Card";
import Box from "@mui/material/Card";
import Typography from "@mui/material/Card";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import profilesListData from "layouts/profile/data/profilesListData";
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/profile-layout-header.jpg";

function Overview() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Khởi tạo navigate để điều hướng

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Lấy token từ cookie
    const userToken = Cookies.get("user");

    if (userToken) {
      // Token tồn tại, giải mã token
      const decodedToken = jwtDecode(userToken);
      setEmail(decodedToken.sub);
    } else {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

  console.log("User email:", email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
    // if (newPassword !== confirmPassword) {
    //   setErrorMessage("Re-entered password is incorrect!");
    //   return;
    // }

    // Gửi yêu cầu đổi mật khẩu tới API
    try {
      const response = await axios.put(`http://localhost:3000/api/changePassword/${email}`, {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        setSuccessMessage("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrorMessage("");
      } else {
        setErrorMessage("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.6),
            rgba(gradients.info.state, 0.6)
          )}, url(${bgImage})`,
        backgroundPositionY: "50%",
      }}
    >
      <Header tabValue={tabValue} handleSetTabValue={handleSetTabValue} />

      <ArgonBox mt={3}>
        {tabValue === 0 && (
          <Grid
            container
            spacing={3}
            sx={{
              py: 2,
            }}
          >
            <Grid item>
              <Card
                sx={{
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}
              >
                <ArgonBox m={3}>
                  <ArgonTypography variant="h5" mb={1}>
                    About
                  </ArgonTypography>
                  <ArgonBox sx={{ maxWidth: "440px" }}>
                    <ArgonTypography variant="body2">
                      Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes.
                      Topping cake wafer..
                    </ArgonTypography>
                  </ArgonBox>
                </ArgonBox>
              </Card>

              <Card
                sx={{
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}
              >
                <ArgonBox m={3}>
                  <ArgonTypography variant="h5" mb={1}>
                    Social
                  </ArgonTypography>
                  <ArgonBox>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Grid item xs={4}>
                          <FacebookIcon />
                        </Grid>
                        <Grid item xs={8}></Grid>
                      </Grid>

                      <Grid item xs={12}></Grid>

                      <Grid item xs={12}></Grid>

                      <Grid item xs={12}></Grid>
                    </Grid>
                  </ArgonBox>
                </ArgonBox>
              </Card>
            </Grid>

            <Grid item>
              <Card
                sx={{
                  w: "100%",
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}
              >
                <ArgonBox m={3}>
                  <ArgonTypography variant="h5">Social</ArgonTypography>
                </ArgonBox>
              </Card>
            </Grid>
          </Grid>
        )}
        {tabValue === 1 && (
          <ArgonBox>
            <Card>
              <ArgonBox m={3}>
                <form onSubmit={handleSubmit}>
                  {/* Form bao gồm các trường nhập và xử lý submit */}
                  <ArgonBox mb={3}>
                    <ArgonInput
                      type="password"
                      placeholder="Enter old password"
                      name="oldPass"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)} // Quản lý state của input
                      required
                      error={errorMessage.includes("Old password is incorrect")} // Hiển thị lỗi nếu có liên quan tới old password
                    />
                    {errorMessage.includes("Old password is incorrect") && (
                      <p style={{ color: "red", fontSize: "12px" }}>Old password is incorrect!</p>
                    )}
                  </ArgonBox>

                  <ArgonBox mb={3}>
                    <ArgonInput
                      type="password"
                      placeholder="Enter a new password"
                      name="newPass"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} // Quản lý state của input
                      required
                      error={
                        errorMessage.includes("New password must be at least 8 characters long!") ||
                        errorMessage.includes(
                          "New password must contain at least one special character!"
                        )
                      } // Hiển thị lỗi nếu có liên quan tới new password
                    />
                    {(errorMessage.includes("New password must be at least 8 characters long!") && (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        New password must be at least 8 characters long!
                      </p>
                    )) ||
                      (errorMessage.includes(
                        "New password must contain at least one special character!"
                      ) && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          New password must contain at least one special character!
                        </p>
                      ))}
                  </ArgonBox>

                  <ArgonBox mb={3}>
                    <ArgonInput
                      type="password"
                      placeholder="Re-enter the new password"
                      name="confirmNewPass"
                      value={confirmPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)} // Quản lý state của input
                      required
                      error={errorMessage.includes(
                        "New password and confirm password do not match!"
                      )} // Hiển thị lỗi nếu mật khẩu xác nhận không khớp
                    />
                    {errorMessage.includes("New password and confirm password do not match!") && (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        New password and confirm password do not match!
                      </p>
                    )}
                  </ArgonBox>

                  {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

                  <ArgonButton color="dark" size="large" type="submit">
                    Confirm
                  </ArgonButton>
                </form>
              </ArgonBox>
            </Card>
          </ArgonBox>
        )}
        {tabValue === 2 && <Typography variant="h6">This is the Settings tab content.</Typography>}
      </ArgonBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
