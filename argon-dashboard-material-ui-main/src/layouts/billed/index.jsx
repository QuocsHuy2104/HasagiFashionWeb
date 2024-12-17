import React, { useEffect, useState } from "react";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Grid from "@mui/material/Unstable_Grid2";
import ArgonButton from "components/ArgonButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { Box, Typography, Card } from "@mui/material";
import PaymentService from "services/PaymentServices";
const OrderSummary = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [amount, setAmount] = useState(0); // Amount state to hold the total

    useEffect(() => {
        const fetchPaymentResult = async () => {
            try {
                const code = searchParams.get("code");
                const id = searchParams.get("id");
                const cancel = searchParams.get("cancel");
                const status = searchParams.get("status");
                const orderCode = searchParams.get("orderCode");

                const orderDetails = JSON.parse(localStorage.getItem("cartItemsBackup")) || [];
                const addressId = Cookies.get("addressId");
                const address = JSON.parse(localStorage.getItem("address1")) || {};

                if (!Array.isArray(orderDetails)) {
                    throw new Error("Invalid data format for order details.");
                }

                // Calculate the total amount
                const totalAmount = orderDetails.reduce((acc, item) => acc + item.total, 0);
                setAmount(totalAmount);

                const response = await PaymentService.PaySuccess({
                    code,
                    id,
                    cancel,
                    status,
                    orderCode,
                    orderDetails,
                    addressId,
                    fullNameAddress: address.fullNameAddress,
                    shippingFee: address.shippingFree,
                });
                console.log("Payment Success Response:", response);
            } catch (error) {
                console.error("Error in fetchPaymentResult:", error.message);
            }
        };

        fetchPaymentResult();
    }, [searchParams]);

    const address = JSON.parse(localStorage.getItem("address1")) || {};

    // Function to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    return (
        <ArgonBox px={20} py={5}>
            {/* Header */}
            <ArgonBox display="flex" justifyContent="start" alignItems="center" mb={2}>
                <ArgonTypography variant="h3" color="primary">
                    HASAGIFASHION
                </ArgonTypography>
            </ArgonBox>

            <Grid container spacing={2}>
                {/* Left Section */}
                <Grid xs={12} md={7}>
                    {/* Order Confirmation */}
                    <ArgonBox display="flex" alignItems="center" mb={3}>
                        <ArgonBox mr={2}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                                <g fill="none" stroke="#8EC343" strokeWidth="2">
                                    <circle cx="36" cy="36" r="35" style={{ strokeDasharray: "240px" }} />
                                    <path
                                        d="M17.417,37.778l9.93,9.909l25.444-25.393"
                                        style={{ strokeDasharray: "50px" }}
                                    />
                                </g>
                            </svg>
                        </ArgonBox>
                        <ArgonBox>
                            <ArgonTypography variant="h5" mb={1}>
                                Cảm ơn bạn đã đặt hàng
                            </ArgonTypography>
                            <ArgonTypography variant="body2">
                                Chúc mừng bạn đã đặt hàng thành công. Cảm ơn và xin gặp lại!
                            </ArgonTypography>
                        </ArgonBox>
                    </ArgonBox>

                    {/* Customer and Shipping Information */}
                    <Grid container spacing={2} sx={{ border: "1px solid #dadada", padding: "1em" }}>
                        {/* Customer Info */}
                        <Grid xs={12} md={6}>
                            <ArgonTypography variant="body1">Thông tin mua hàng</ArgonTypography>
                            <ArgonTypography variant="body2">{address.fullName || "N/A"}</ArgonTypography>
                            <ArgonTypography variant="body2">{address.numberPhone || "N/A"}</ArgonTypography>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <ArgonTypography variant="body1">Địa chỉ nhận hàng</ArgonTypography>
                            <ArgonTypography
                                variant="body2"
                                sx={{
                                    whiteSpace: "nowrap", // Prevents text from wrapping
                                    overflow: "hidden",   // Hides overflowing text
                                    textOverflow: "ellipsis" // Adds ellipsis for overflow
                                }}
                            >
                                {address.fullNameAddress || "N/A"}
                            </ArgonTypography>

                            <ArgonTypography variant="body2">{address.fullName || "N/A"}</ArgonTypography>
                            <ArgonTypography variant="body2">{address.numberPhone || "N/A"}</ArgonTypography>
                        </Grid>
                    </Grid>

                    {/* Buttons */}
                    <ArgonBox display="flex" justifyContent="end" alignItems="center" mt={5}>
                        <ArgonButton variant="gradient" color="dark" onClick={() => navigate("feature-section")}>
                            Tiếp tục mua hàng
                        </ArgonButton>
                        <ArgonBox ml={3}>
                            <FontAwesomeIcon icon={faPrint} />
                        </ArgonBox>
                    </ArgonBox>
                </Grid>

                {/* Right Section - Order Summary */}
                <Grid xs={12} md={5}>
                    <Card sx={{ padding: 2, maxWidth: 500, margin: "0 auto", borderRadius: 2 }}>
                        <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: 1, marginBottom: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {searchParams.get("orderCode") || "Order Code"}
                            </Typography>
                        </Box>

                        {
                            JSON.parse(localStorage.getItem("cartItemsBackup"))?.map(item => (
                                <Box key={item.id}>
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Box
                                                component="img"
                                                src={item.image}
                                                alt="Product"
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 1,
                                                    objectFit: "cover",
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs>
                                            <ArgonTypography variant="button">{item.name}</ArgonTypography>
                                            <ArgonTypography variant="body2" color="textSecondary">{item.color} {item.size}</ArgonTypography>
                                        </Grid>
                                        <Grid item>
                                            <ArgonTypography variant="body2">{formatCurrency(item.total)}</ArgonTypography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))
                        }

                        <Box sx={{ marginTop: 2, borderTop: "1px solid #ccc", paddingTop: 1 }}>
                            <Grid container justifyContent="space-between">
                                <Typography variant="body2">Tạm tính</Typography>
                                <Typography variant="body2">{formatCurrency(amount)}</Typography> {/* Display formatted amount */}
                            </Grid>
                            <Grid container justifyContent="space-between">
                                <Typography variant="body2">Phí vận chuyển</Typography>
                                <Typography variant="body2">{formatCurrency(address.shippingFree)}</Typography>
                            </Grid>
                            <Grid container justifyContent="space-between" sx={{ marginTop: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Tổng cộng</Typography>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "red" }}>
                                    {formatCurrency(amount + parseFloat(address.shippingFree || 0))}
                                </Typography>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </ArgonBox>
    );
};

export default OrderSummary;
