import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

const VoucherHistoryTable = () => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await VouchersService.getAllVouchers();
                const currentDate = new Date();

                // Lọc chỉ lấy những voucher đã hết hạn
                const expiredVouchers = response.data.filter(voucher => new Date(voucher.endDate) < currentDate);
                setVouchers(expiredVouchers || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);



    const rowsHistory = vouchers.map(voucher => ({
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
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
            />
        ),

    }));

    const voucherHistoryTableData = {
        columnsHistory: [
            { name: "code", align: "left" },
            { name: "discount", align: "center" },
            { name: "minOrder", align: "center" },
            { name: "startDate", align: "center" },
            { name: "endDate", align: "center" },
            { name: "isActive", align: "center" },
        ],
        rowsHistory,
    };

    return voucherHistoryTableData;
};

VoucherHistoryTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default VoucherHistoryTable;