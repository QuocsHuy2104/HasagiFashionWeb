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

const VoucherTable = ({ onEditClick }) => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await VouchersService.getAllVouchers();
                const currentDate = new Date();

                // Filter out expired vouchers
                const activeVouchers = response.data.filter(voucher => new Date(voucher.endDate) >= currentDate);
                setVouchers(activeVouchers || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleStatusToggle = async (voucher) => {
        try {
            const updatedVoucher = { ...voucher, isActive: !voucher.isActive };
            await VouchersService.updateVoucher(voucher.id, updatedVoucher);
            setVouchers((prevVouchers) =>
                prevVouchers.map((v) => (v.id === voucher.id ? updatedVoucher : v))
            );
            toast.success("Voucher status updated successfully");
        } catch (error) {
            console.error("Error updating voucher status", error);
            toast.error("Failed to update voucher status");
        }
    };

    const deleteItem = async (id) => {
        try {
            await VouchersService.deleteVoucher(id);
            setVouchers(vouchers.filter(voucher => voucher.id !== id));
            toast.success("Delete voucher successful");
        } catch (error) {
            console.error("There was an error deleting the item!", error);
            toast.error("Error deleting voucher");
        }
    };

    const rows = vouchers.map(voucher => ({
        code: <VoucherCode code={voucher.code} />,
        discount: <VoucherDiscount discount={voucher.discountPercentage} />,
        minOrder: <VoucherMinOrder minOrder={voucher.minimumOrderValue} />,
        startDate: (
            <ArgonTypography variant="caption" color="textPrimary">
                {formatDate(voucher.startDate)}
            </ArgonTypography>
        ),
        endDate: (
            <ArgonTypography variant="caption" color="textPrimary">
                {formatDate(voucher.endDate)}
            </ArgonTypography>
        ),
        isActive: (
            <Switch
                checked={voucher.isActive}
                onChange={() => handleStatusToggle(voucher)}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
            />
        ),
        action: (
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

    const voucherTableData = {
        columns: [
            { name: "code", align: "left" },
            { name: "discount", align: "center" },
            { name: "minOrder", align: "center" },
            { name: "startDate", align: "center" },
            { name: "endDate", align: "center" },
            { name: "isActive", align: "center" },
            { name: "action", align: "center" },
        ],
        rows,
    };

    return voucherTableData;
};

VoucherTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default VoucherTable;