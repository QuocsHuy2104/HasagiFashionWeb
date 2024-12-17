import React, { useEffect, useState } from "react";
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { CircularProgress, Typography } from "@mui/material";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import VoucherService from "../../../services/VoucherServices";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "react-toastify/dist/ReactToastify.css";
import { Snackbar, SnackbarContent } from "@mui/material";
import Swal from "sweetalert2";

const Voucher = ({ voucher, onCopy }) => {

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
                        marginTop: "-100px",
                        flexShrink: 0,
                    }}
                />
                <ArgonBox sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    <ArgonBox
                        sx={{
                            display: "flex", // Sử dụng flexbox
                            alignItems: "center", // Căn giữa theo trục dọc
                            justifyContent: "space-between", // Hoặc điều chỉnh theo nhu cầu
                        }}
                    >
                        <ArgonBox
                            sx={{
                                background: "linear-gradient(to right, #FFD700, #FFA500)",
                                padding: "3px 8px",
                                color: "#000",
                                fontWeight: "bold",
                                display: "inline-block",
                                borderRadius: "8px",
                                fontSize: "12px",
                                marginBottom: "0", // Xóa margin-bottom để căn thẳng hàng
                                whiteSpace: "nowrap",
                            }}
                        >
                            Phiếu giảm giá
                        </ArgonBox>
                        <ArgonBox
                            sx={{
                                textAlign: "right",
                                flexShrink: 0,
                            }}
                        >
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
                        </ArgonBox>
                    </ArgonBox>
                    <ArgonBox
                        sx={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#FF4500",
                        }}
                    >
                        Mã: {voucher.code}
                    </ArgonBox>
                    <ArgonBox
                        sx={{
                            fontSize: "12px",
                            color: "#333",
                            marginTop: "3px",
                        }}
                    >
                        Giảm <strong>{voucher.discountPercentage}%</strong> khi hóa đơn từ {voucher.minimumOrderValue}đ, giảm tối đa {voucher.maxDiscount}
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

        </ArgonBox>
    );
};

Voucher.propTypes = {
    voucher: PropTypes.shape({
        code: PropTypes.string.isRequired,
        discountPercentage: PropTypes.number.isRequired,
        minimumOrderValue: PropTypes.number.isRequired,
        maxDiscount: PropTypes.number.isRequired,
        endDate: PropTypes.string.isRequired,
    }).isRequired,
    onCopy: PropTypes.func.isRequired,
};



const CustomPrevArrow = ({ onClick }) => (
    <ArrowBackIosIcon
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "-20px",
            right: "100px",
            zIndex: 1,
            cursor: "pointer",
            fontSize: "28px",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
            },
        }}
    />
);

CustomPrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const CustomNextArrow = ({ onClick }) => (
    <ArrowForwardIosIcon
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "-20px",
            right: "80px",
            zIndex: 1,
            cursor: "pointer",
            fontSize: "28px",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
            },
        }}
    />
);

CustomNextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};


const VoucherList = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usedVouchers, setUsedVouchers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const voucherRequests = [VoucherService.getUnusedVouchersByAccountUS()];

                const [voucherResponse, unusedVoucherResponse] = await Promise.all(voucherRequests);
                const activeVouchers = voucherResponse.data.filter(voucher => voucher.isActive);
                setVouchers(activeVouchers);
                setUsedVouchers(unusedVoucherResponse ? unusedVoucherResponse.data : []);
            } catch (error) {
                console.error("Error fetching voucher data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);




    const availableVouchers = vouchers.filter(
        voucher => !usedVouchers.some(usedVoucher => usedVoucher.id === voucher.id)
    );

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const sliderSettings = {
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(4, availableVouchers.length),
        slidesToScroll: 1,
        // nextArrow: <CustomNextArrow />,
        // prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(3, availableVouchers.length),
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: Math.min(2, availableVouchers.length),
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: Math.min(1, availableVouchers.length),
                },
            },
        ],
    };


    if (loading) {
        return <CircularProgress />;
    }
    return (
        <>
            <a href="/Shop">
                <div style={{ position: "relative" }}>
                    <Slider {...sliderSettings} className="pb-3 pt-4">
                        {availableVouchers.length === 0 ? (
                            <></>
                        ) : (
                            availableVouchers.map(voucher => (
                                <div key={voucher.id}>
                                    <Voucher voucher={voucher} />
                                </div>
                            ))
                        )}
                    </Slider>
                </div>
            </a>
        </>
    );
};


export default VoucherList;