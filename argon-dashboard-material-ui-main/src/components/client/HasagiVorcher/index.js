import React from "react";
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { Grid, Typography } from "@mui/material";
import DiscountIcon from "@mui/icons-material/LocalOffer"; // Icon for decorative touch

const CouponCard = () => {
    return (
        <ArgonBox
            sx={{
                border: "1px solid #FFD700",
                borderRadius: "12px",
                padding: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "480px",
                margin: "10px",
                backgroundColor: "#FFF8E1",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Left Section with Icon and Text */}
            <ArgonBox sx={{ display: "flex", alignItems: "center" }}>
                {/* Decorative Icon */}
                <DiscountIcon
                    sx={{
                        color: "#FF4500",
                        fontSize: "32px", // Reduced icon size
                        marginRight: "8px",
                    }}
                />

                {/* Coupon Info */}
                <div>
                    <ArgonBox
                        sx={{
                            background: "linear-gradient(to right, #FFD700, #FFA500)",
                            padding: "3px 8px",
                            color: "#000",
                            fontWeight: "bold",
                            display: "inline-block",
                            borderRadius: "8px",
                            fontSize: "12px", // Reduced font size for coupon label
                            marginBottom: "4px",
                        }}
                    >
                        COUPON
                    </ArgonBox>

                    <ArgonBox sx={{ fontWeight: "bold", fontSize: "14px", color: "#FF4500" }}>
                        Mã: F1SHOES
                    </ArgonBox>

                    <ArgonBox sx={{ fontSize: "10px", color: "#333", marginTop: "3px" }}>
                        Giảm 10% khi mua 1 sản phẩm
                    </ArgonBox>
                </div>
            </ArgonBox>

            {/* Right Section with Discount and Button */}
            <ArgonBox sx={{ textAlign: "right" }}>
                <ArgonBox sx={{ fontSize: "20px", fontWeight: "bold", color: "#FF4500" }}>
                    Giảm 10%
                </ArgonBox>

                <ArgonButton
                    sx={{
                        backgroundColor: "#FF4500",
                        background: "linear-gradient(to right, #FF7F50, #FF4500)",
                        color: "#fff",
                        fontWeight: "bold",
                        marginTop: "8px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px", // Reduced button text size
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            background: "linear-gradient(to right, #FF4500, #FF6347)",
                        },
                    }}
                >
                    Sao chép mã
                </ArgonButton>
            </ArgonBox>
        </ArgonBox>
    );
};

const CouponList = () => {
    return (
        <>
            <div
                className="container-fluid pt-3">
                <Typography variant="h2" className="section-title position-relative text-uppercase mx-xl-5 mb-3">
                    <span className="bg-secondary pr-3">VORCHER</span>
                </Typography>
            </div>
            <Grid container spacing={2} justifyContent="center" className="px-xl-5 pb-3">
                <Grid item xs={12} sm={6} md={3}>
                    <CouponCard />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <CouponCard />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <CouponCard />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <CouponCard />
                </Grid>
            </Grid>
        </>
    );
};

export default CouponList;
