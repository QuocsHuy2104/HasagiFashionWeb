import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import FacebookIcon from "@mui/icons-material/Facebook";
import Card from "@mui/material/Card";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import Header from "layouts/profile/components/Header";


const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/profile-layout-header.jpg";

function Overview() {
  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
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

      <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: ({ boxShadows: { md } }) => md }}>
              <ArgonBox p={3}>
                <ArgonTypography variant="h5" mb={2}>
                  Thông tin cá nhân
                </ArgonTypography>

                {/* Display User Information */}
               
                    {/* Họ và tên */}
                    <ArgonBox mb={3}>
                      <ArgonTypography variant="subtitle1" mb={1}>
                        Họ và tên
                      </ArgonTypography>
                      <ArgonTypography variant="body2">
                        {"Nguyễn Văn A"}
                      </ArgonTypography>
                    </ArgonBox>

                    {/* Địa chỉ */}
                    <ArgonBox mb={3}>
                      <ArgonTypography variant="subtitle1" mb={1}>
                        Địa chỉ
                      </ArgonTypography>
                      <ArgonTypography variant="body2">
                        {"123 Đường ABC, Quận 1, TP. HCM"}
                      </ArgonTypography>
                    </ArgonBox>

                    {/* Email */}
                    <ArgonBox mb={3}>
                      <ArgonTypography variant="subtitle1" mb={1}>
                        Email
                      </ArgonTypography>
                      <ArgonTypography variant="body2">
                        { "email@example.com"}
                      </ArgonTypography>
                    </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>


      <Footer />
    </DashboardLayout >
  );
}

export default Overview;
