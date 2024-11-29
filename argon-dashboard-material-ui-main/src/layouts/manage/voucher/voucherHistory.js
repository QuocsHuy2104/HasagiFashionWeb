import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import VouchersService from "../../../services/VoucherServices";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";

function VoucherCode({ code }) {
    return (
        <ArgonBox display="flex" flexDirection="column" ml={2}>
            <ArgonTypography variant="button" fontWeight="bold" color="textPrimary">
                {code}
            </ArgonTypography>
        </ArgonBox>
    );
}

VoucherCode.propTypes = {
    code: PropTypes.string.isRequired,
};

function VoucherQuantity({ quantity }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {quantity}
        </ArgonTypography>
    );
}

VoucherQuantity.propTypes = {
    quantity: PropTypes.number.isRequired,
};

function VoucherMaxDiscount({ maxDiscount }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {maxDiscount}
        </ArgonTypography>
    );
}

VoucherMaxDiscount.propTypes = {
    maxDiscount: PropTypes.number.isRequired,
};

function VoucherDiscount({ discount }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {discount}%
        </ArgonTypography>
    );
}

VoucherDiscount.propTypes = {
    discount: PropTypes.number.isRequired,
};

function VoucherMinOrder({ minOrder }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {minOrder.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
        </ArgonTypography>
    );
}

VoucherMinOrder.propTypes = {
    minOrder: PropTypes.number.isRequired,
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const VoucherHistoryTable = ({ searchHistory, onEditClick, handleStatusToggle, deleteItem }) => {
    const [vouchers, setVouchers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await VouchersService.getAllVouchers();
            const currentDate = new Date();
            const expiredVouchers = response.data.filter(
                (voucher) => new Date(voucher.endDate) < currentDate
            );
            setVouchers(expiredVouchers || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshHistory = async () => {
        try {
            await fetchData();
            toast.success("Làm mới danh sách phiếu giảm giá thành công!");
        } catch (error) {
            console.error("Error refreshing vouchers:", error);
            toast.error("Làm mới danh sách phiếu giảm giá thất bại!");
        }
    };

    const filteredHistory = vouchers.filter((voucher) => {
        const searchQuery = typeof searchHistory === "string" ? searchHistory.toLowerCase() : "";
        return voucher.code.toLowerCase().includes(searchQuery);
    });


    const rowsHistory = filteredHistory.map((voucher) => ({
        MAGIAMGIA: <VoucherCode code={voucher.code} />,
        SOLUONG: <VoucherQuantity quantity={voucher.quantity} />,
        GIAM: <VoucherDiscount discount={voucher.discountPercentage} />,
        GIATOITHIEU: <VoucherMinOrder minOrder={voucher.minimumOrderValue} />,
        GIAMTOIDA: <VoucherMaxDiscount maxDiscount={voucher.maxDiscount} />,
        NGAYBATDAU: (
            <ArgonTypography variant="caption" color="textPrimary">
                {formatDate(voucher.startDate)}
            </ArgonTypography>
        ),
        NGAYHETHAN: (
            <ArgonTypography variant="caption" color="textPrimary">
                {formatDate(voucher.endDate)}
            </ArgonTypography>
        ),
        TRANGTHAI: (
            <Switch
                checked={voucher.isActive}
                onChange={() => handleStatusToggle(voucher)}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
            />
        ),
        THAOTAC: (
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="info"
                    fontWeight="medium"
                    onClick={() => onEditClick(voucher)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Edit
                </ArgonTypography>
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="error"
                    fontWeight="medium"
                    onClick={() => deleteItem(voucher.id)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-trash3"></i> Remove
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const voucherHistoryTableData = {
        columnsHistory: [
            { name: "MAGIAMGIA", align: "left" },
            { name: "SOLUONG", align: "left" },
            { name: "GIAM", align: "center" },
            { name: "GIATOITHIEU", align: "center" },
            { name: "GIAMTOIDA", align: "center" },
            { name: "NGAYBATDAU", align: "center" },
            { name: "NGAYHETHAN", align: "center" },
            { name: "TRANGTHAI", align: "center" },
            { name: "THAOTAC", align: "center" },
        ],
        rowsHistory,
    };

    return { ...voucherHistoryTableData, refreshHistory };
};

VoucherHistoryTable.propTypes = {
    searchHistory: PropTypes.string,
    onEditClick: PropTypes.func.isRequired,
    handleStatusToggle: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
};

VoucherHistoryTable.defaultProps = {
    searchHistory: "",
};

export default VoucherHistoryTable;