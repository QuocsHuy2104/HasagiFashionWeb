import React, { useState } from "react";
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
        {tabValue === 0 && (
          <Grid container spacing={3}
            sx={{
              py: 2
            }} >
            <Grid item>
              <Card
                sx={{
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}>
                <ArgonBox m={3}>
                  <ArgonTypography variant="h5" mb={1} >About</ArgonTypography>
                  <ArgonBox sx={{ maxWidth: '440px' }}>
                    <ArgonTypography variant="body2">Tart I love sugar plum I love oat cake.
                      Sweet roll caramels I love jujubes. Topping cake wafer..</ArgonTypography>
                  </ArgonBox>
                </ArgonBox>
              </Card>

              <Card
                sx={{
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}>
                <ArgonBox m={3}>
                  <ArgonTypography variant="h5" mb={1} >Social</ArgonTypography>
                  <ArgonBox>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Grid item xs={4}>
                          <FacebookIcon />
                        </Grid>
                        <Grid item xs={8}></Grid>
                      </Grid>

                      <Grid item xs={12}>

                      </Grid>

                      <Grid item xs={12}>

                      </Grid>

                      <Grid item xs={12}>

                      </Grid>
                    </Grid>
                  </ArgonBox>
                </ArgonBox>
              </Card>
            </Grid>

            <Grid item >
              <Card
                sx={{
                  w: '100%',
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}>
                <ArgonBox m={3}>
                  <ArgonTypography variant="h5" >Social</ArgonTypography>

                </ArgonBox>

              </Card>
            </Grid>
          </Grid>
        )}
        {tabValue === 1 && (
          <ArgonBox>
            <Card>
              <ArgonBox m={3} >
                <ArgonBox role="form">
                  <ArgonBox mb={3}>
                    <ArgonInput type="password" placeholder="Old Password" name="oldPass" />
                  </ArgonBox>

                  <ArgonBox mb={3}>
                    <ArgonInput type="password" placeholder="Old Password" name="newPass" />
                  </ArgonBox>

                  <ArgonBox mb={3}>
                    <ArgonInput type="password" placeholder="Old Password" name="Confirm" />
                  </ArgonBox>

                  <ArgonButton color="dark" size="large" type="submit" >Confirm</ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </Card>
          </ArgonBox>
        )}
        {tabValue === 2 && (
          <Typography variant="h6">This is the Settings tab content.</Typography>
        )}
      </ArgonBox>


      <Footer />
    </DashboardLayout >
  );
}

export default Overview;
