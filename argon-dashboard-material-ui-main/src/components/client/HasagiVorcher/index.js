import React, { useEffect, useState } from "react";
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { Grid, CircularProgress, Snackbar, Typography } from "@mui/material";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import VoucherService from "../../../services/VoucherServices";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const Voucher = ({ voucher }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(voucher.code)
            .then(() => {
                setOpenSnackbar(true);
            })
            .catch(err => {
                console.error('Lỗi khi sao chép mã:', err);
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <ArgonBox
            sx={{
                border: "1px solid #FFD700",
                borderRadius: "12px",
                padding: "15px",
                display: "flex",
                maxWidth: "480px",
                margin: "10px 5px",
                backgroundColor: "#FFF8E1",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                flexWrap: "nowrap",
            }}
        >
            <ArgonBox sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                <DiscountIcon
                    sx={{
                        color: "#FF4500",
                        fontSize: "32px",
                        marginRight: "10px",
                        marginLeft: "-10px",
                        marginTop: "-80px",
                        flexShrink: 0,
                    }}
                />

                <ArgonBox sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    <ArgonBox
                        sx={{
                            background: "linear-gradient(to right, #FFD700, #FFA500)",
                            padding: "3px 8px",
                            color: "#000",
                            fontWeight: "bold",
                            display: "inline-block",
                            borderRadius: "8px",
                            fontSize: "12px",
                            marginBottom: "4px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        VOUCHER
                    </ArgonBox>

                    <ArgonBox
                        sx={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#FF4500",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Mã: {voucher.code}
                    </ArgonBox>

                    <ArgonBox
                        sx={{
                            fontSize: "12px",
                            color: "#333",
                            marginTop: "3px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Giảm {voucher.discountPercentage}% khi hóa đơn từ {voucher.minimumOrderValue}đ
                    </ArgonBox>
                    <ArgonBox
                        sx={{
                            fontSize: "12px",
                            color: "#333",
                            marginTop: "3px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        HSD: {formatDate(voucher.endDate)}
                    </ArgonBox>
                </ArgonBox>
            </ArgonBox>

            <ArgonBox sx={{ textAlign: "right", flexShrink: 0 }}>
                <ArgonBox
                    sx={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#FF4500",
                        whiteSpace: "nowrap",
                    }}
                >
                    Giảm {voucher.discountPercentage}%
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
                        fontSize: "12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        whiteSpace: "nowrap",
                        "&:hover": {
                            background: "linear-gradient(to right, #FF4500, #FF6347)",
                        },
                    }}
                    onClick={copyToClipboard}
                >
                    Sao chép mã
                </ArgonButton>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    message={`Đã sao chép mã voucher: ${voucher.code}`}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                />
            </ArgonBox>
        </ArgonBox>
    );
};

Voucher.propTypes = {
    voucher: PropTypes.shape({
        code: PropTypes.string.isRequired,
        discountPercentage: PropTypes.number.isRequired,
        minimumOrderValue: PropTypes.number.isRequired,
        endDate: PropTypes.string.isRequired,
    }).isRequired,
};

const VoucherList = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usedVouchers, setUsedVouchers] = useState([]);
    const accountId = Cookies.get('accountId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [voucherResponse, usedVoucherResponse] = await Promise.all([
                    VoucherService.getAllVouchers(),
                    VoucherService.getUsedVouchersByAccount(accountId),
                ]);

                // Filter out inactive vouchers
                const activeVouchers = voucherResponse.data.filter(voucher => voucher.isActive);

                setVouchers(activeVouchers);
                setUsedVouchers(usedVoucherResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Ensure loading is set to false after data fetch
            }
        };

        if (accountId) {
            fetchData();
        }
    }, [accountId]);

    // Filter out used vouchers from active vouchers
    const availableVouchers = vouchers.filter(voucher =>
        !usedVouchers.some(usedVoucher => usedVoucher.id === voucher.id)
    );

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <div
                className="container-fluid pt-3">
                <Typography variant="h2" className="section-title position-relative text-uppercase mx-xl-5 mb-3">
                    <span className="bg-secondary pr-3">VORCHER</span>
                </Typography>
            </div>
            <Grid container spacing={0} className="px-xl-5 pb-3">
                {availableVouchers.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6">Không có voucher nào.</Typography>
                    </Grid>
                ) : (
                    availableVouchers.map(voucher => (
                        <Grid item xs={12} sm={6} md={3} key={voucher.id}>
                            <Voucher voucher={voucher} />
                        </Grid>
                    ))
                )}
            </Grid>
        </>
    );
};

export default VoucherList;