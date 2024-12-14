import React from "react";
import { Card, CardMedia, CardContent, Typography, Avatar, Grid, Box } from "@mui/material";
import PropTypes from "prop-types";

const ProfileCard = ({ account }) => {
  return (
    <Card
      style={{
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "400px",
        margin: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image="https://assets.minimals.cc/public/assets/images/mock/cover/cover-13.webp"
        alt="Cover Image"
        style={{
          zIndex: 1,
          position: "relative",
        }}
      />

      {/* SVG Bo Tròn */}
      <Box
        style={{
          position: "absolute",
          top: "210px", 
          left: 0,
          width: "100%",
          height: "auto",
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 144 62"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "100%",
            height: "80px",
          }}
        >
          <path
            d="M111.34 23.88C100.72 13.42 92.84 0 72.6 0h-1.2C51.16 0 43.28 13.42 32.66 23.88 24.94 33.52 13.22 35.62 0 36v26h144V36c-13.22-.38-24.94-2.48-32.66-12.12z"
            fill="white"
          />
        </svg>
      </Box>

      <Box
        style={{
          position: "absolute",
          top: "211px",
          left: "40%",
          zIndex: 3,
        }}
      >
        <Avatar
          src={account.avatar || "https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-9.webp"}
          alt="Avatar"
          style={{
            width: "80px",
            height: "80px",
            border: "4px solid white",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent style={{ marginTop: "40px" }}>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          {account.fullName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {account.email}
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          <Grid item xs={4}>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Follower
            </Typography>
            <Typography variant="h6">1.95k</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Following
            </Typography>
            <Typography variant="h6">9.12k</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Total post
            </Typography>
            <Typography variant="h6">6.98k</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ProfileCard.propTypes = {
  account: PropTypes.shape({
    avatar: PropTypes.string,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileCard;
