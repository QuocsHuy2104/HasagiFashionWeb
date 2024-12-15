import React from "react";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Grid from "@mui/material/Unstable_Grid2";
import ArgonButton from "components/ArgonButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { List, ListItem } from "@mui/material";
import { Box, Typography, Card } from "@mui/material";
import PaymentService from "services/PaymentServices";
const OrderSummary = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    React.useEffect(() => {
        const code = searchParams.get("code");
        const id = searchParams.get("id");
        const cancel = searchParams.get("cancel");
        const status = searchParams.get("status");
        const orderCode = searchParams.get("orderCode");

        // Gọi hàm PaySuccess từ PaymentService
        const fetchPaymentResult = async () => {
            try {
                const response = await PaymentService.PaySuccess({
                    code,
                    id,
                    cancel,
                    status,
                    orderCode,
                });
                console.log("Payment Success Response:", response);
                // Xử lý kết quả (ví dụ: hiển thị thông báo)
            } catch (error) {
                console.error("Error in fetchPaymentResult:", error);
                // Xử lý lỗi nếu cần
            }
        };

        fetchPaymentResult();
    }, [searchParams]);

    return (
        <ArgonBox px={20} py={5}>
            {/* Header */}
            <ArgonBox display="flex" justifyContent="start" alignItems="center" mb={2}>
                <ArgonTypography variant="h3" color="primary">
                    HASAGIFASHION
                </ArgonTypography>
            </ArgonBox>

            {/* Content */}
            <Grid container spacing={2}>
                <Grid xs={12} md={7}>
                    {/* Order Confirmation Section */}
                    <ArgonBox display="flex" alignItems="center" mb={3}>
                        <ArgonBox mr={2}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                                <g fill="none" stroke="#8EC343" strokeWidth="2">
                                    <circle cx="36" cy="36" r="35" style={{ strokeDasharray: "240px", strokeDashoffset: "480px" }}></circle>
                                    <path
                                        d="M17.417,37.778l9.93,9.909l25.444-25.393"
                                        style={{ strokeDasharray: "50px", strokeDashoffset: "0px" }}
                                    ></path>
                                </g>
                            </svg>
                        </ArgonBox>
                        <ArgonBox>
                            <ArgonTypography variant="h5" mb={1}>
                                Cảm ơn bạn đã đặt hàng
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display='block'>
                                Một email xác nhận đã được gửi tới
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display='block'>
                                Xin vui lòng kiểm tra email của bạn
                            </ArgonTypography>
                        </ArgonBox>
                    </ArgonBox>

                    {/* Customer and Shipping Information */}
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            border: "1px solid #dadada",
                            padding: "1em",
                            marginTop: "1em",
                        }}
                    >
                        <Grid xs={12} md={6} mr={8}>
                            <ArgonTypography variant="body1">Thông tin mua hàng</ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                Đặng Vĩnh Kỳ
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                kydvpc05475@fpt.edu.vn
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                +84398948675
                            </ArgonTypography>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <ArgonTypography variant="body1">Địa chỉ nhận hàng</ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                Đặng Vĩnh Kỳ
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                kydvpc05475@fpt.edu.vn
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                Xã Thạnh Mỹ Tây, Huyện Châu Phú, An Giang
                            </ArgonTypography>
                            <ArgonTypography variant="body2" display="block" my={1}>
                                +84398948675
                            </ArgonTypography>
                        </Grid>

                    </Grid>
                    <Grid xs={12} mt={5}>
                        <ArgonBox display="flex" justifyContent="end" alignItems='center'>
                            <ArgonButton
                                variant="gradient"
                                color="dark"
                                onClick={() => navigate("feature-section")}
                            >
                                Tiếp tục mua hàng
                            </ArgonButton>
                            <ArgonBox ml={3}>
                                <FontAwesomeIcon icon={faPrint} />
                            </ArgonBox>
                        </ArgonBox>
                    </Grid>
                </Grid>
                <Grid xs={12} md={5}>
                    <Card sx={{ padding: 2, maxWidth: 500, margin: "0 auto", borderRadius: 2 }}>
                        <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: 1, marginBottom: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Đơn hàng #1025 (1)
                            </Typography>
                        </Box>
                        <Box>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Box
                                        component="img"
                                        src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
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
                                    <ArgonTypography variant="button">
                                        Chuck Taylor All Star Classic - 121184
                                    </ArgonTypography>
                                    <ArgonTypography variant="body2" color="textSecondary">
                                        34
                                    </ArgonTypography>
                                </Grid>
                                <Grid item>
                                    <ArgonTypography variant="body2">
                                        4.399.000₫
                                    </ArgonTypography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ marginTop: 2, borderTop: "1px solid #ccc", paddingTop: 1 }}>
                            <Grid container justifyContent="space-between">
                                <Typography variant="body2">Tạm tính</Typography>
                                <Typography variant="body2">
                                    4.399.000₫
                                </Typography>
                            </Grid>
                            <Grid container justifyContent="space-between">
                                <Typography variant="body2">Phí vận chuyển</Typography>
                                <Typography variant="body2">
                                    40.000₫
                                </Typography>
                            </Grid>
                            <Grid container justifyContent="space-between" sx={{ marginTop: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    Tổng cộng
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "blue" }}>
                                    4.439.000₫
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
