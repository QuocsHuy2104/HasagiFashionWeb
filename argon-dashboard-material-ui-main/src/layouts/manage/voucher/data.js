import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import VouchersService from "../../../services/VoucherServices";
import Switch from '@mui/material/Switch';

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

function VoucherDiscount({ discount }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {`${discount}%`}
        </ArgonTypography>
    );
}

VoucherDiscount.propTypes = {
    discount: PropTypes.number.isRequired,
};

function VoucherQuantity({ quantity }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {`${quantity}`}
        </ArgonTypography>
    );
}

VoucherQuantity.propTypes = {
    quantity: PropTypes.number.isRequired,
};

function VoucherMaxDiscount({ maxDiscount }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {`${maxDiscount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`}
        </ArgonTypography>
    );
}

VoucherMaxDiscount.propTypes = {
    maxDiscount: PropTypes.number.isRequired,
};

function VoucherMinOrder({ minOrder }) {
    return (
        <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
            {`${minOrder.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`}
        </ArgonTypography>
    );
}

VoucherMinOrder.propTypes = {
    minOrder: PropTypes.number.isRequired,
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const VoucherTable = ({ onEditClick, searchKeyword }) => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await VouchersService.getAllVouchers();
            const currentDate = new Date();
            const activeVouchers = response.data.filter(voucher => new Date(voucher.endDate) >= currentDate);
            setVouchers(activeVouchers || []);
        } catch (err) {
            console.log(err);
        }
    };

    const refreshVouchers = async () => {
        try {
            await fetchData();
            toast.success("Làm mới danh sách phiếu giảm giá thành công!");
        } catch (error) {
            console.error("Error refreshing products:", error);
            toast.error("Làm mới danh sách phiếu giảm giá thất bại!");
        }
    };


    const handleStatusToggle = async (voucher) => {
        try {
            const updatedVoucher = { ...voucher, isActive: !voucher.isActive };
            await VouchersService.updateVoucher(voucher.id, updatedVoucher);
            setVouchers((prevVouchers) =>
                prevVouchers.map((v) => (v.id === voucher.id ? updatedVoucher : v))
            );
            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Error updating voucher status", error);
            toast.error("Cập nhật trạng thái thất bại!!!");
        }
    };

    const filteredVouchers = vouchers
        .filter((voucher) =>
            voucher.code.toLowerCase().includes(searchKeyword.toLowerCase())
        )

    const rows = filteredVouchers.map(voucher => ({
        MAGIAMGIA: <VoucherCode code={voucher.code} />,
        GIAM: <VoucherDiscount discount={voucher.discountPercentage} />,
        GIATOITHIEU: <VoucherMinOrder minOrder={voucher.minimumOrderValue} />,
        GIAMTOIDA: <VoucherMaxDiscount maxDiscount={voucher.maxDiscount} />,
        SOLUONG: <VoucherQuantity quantity={voucher.quantity} />,
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
                    Chỉnh sửa
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const voucherTableData = {
        columns: [
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
        rows,
    };

    return { ...voucherTableData, refreshVouchers };
};

VoucherTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string.isRequired,
};

export default VoucherTable;