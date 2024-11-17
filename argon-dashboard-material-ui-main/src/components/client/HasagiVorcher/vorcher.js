import React, { useEffect, useState } from "react";
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { CircularProgress, Typography } from "@mui/material";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import VoucherService from "../../../services/VoucherServices";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const Voucher = ({ voucher }) => {

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
                >
                    Sao chép mã
                </ArgonButton>
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
                if (accountId) {
                    const [voucherResponse, usedVoucherResponse] = await Promise.all([
                        VoucherService.getAllVouchers(),
                        VoucherService.getUsedVouchersByAccount(accountId),
                    ]);
                    const activeVouchers = voucherResponse.data.filter(voucher => voucher.isActive);

                    setVouchers(activeVouchers);
                    setUsedVouchers(usedVoucherResponse.data);
                } else {
                    const voucherResponse = await VoucherService.getAllVouchers();
                    const activeVouchers = voucherResponse.data.filter(voucher => voucher.isActive);

                    setVouchers(activeVouchers);
                    setUsedVouchers([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accountId]);

    const availableVouchers = vouchers.filter(voucher =>
        !usedVouchers.some(usedVoucher => usedVoucher.id === voucher.id)
    );

    if (loading) {
        return <CircularProgress />;
    }



    return (
        <>
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <div
                    className="px-xl-5 pb-3"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", 
                        gap: 0,
                        justifyContent: "center",
                        maxWidth: "1200px", 
                        margin: "0 auto", 
                    }}
                >
                    {availableVouchers.length === 0 ? (
                        <Typography variant="h6" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                            Không có voucher nào.
                        </Typography>
                    ) : (
                        availableVouchers.map(voucher => (
                            <div key={voucher.id}>
                                <Voucher voucher={voucher} />
                            </div>
                        ))
                    )}
                </div>
            </div>


        </>
    );
};



export default VoucherList;