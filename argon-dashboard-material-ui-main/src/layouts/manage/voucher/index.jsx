import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import VoucherTable from "./data";
import VoucherService from "../../../services/VoucherServices"; // Đổi SizeServices thành VoucherService
import { toast } from "react-toastify";
import Footer from "../../../examples/Footer";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";

function Voucher() {
    const [formData, setFormData] = useState({
        id: "",
        code: "",
        discountPercentage: "",
        minimumOrderValue: "",
        startDate: "",
        endDate: "",
        isActive: true,
    });

    const [vouchers, setVouchers] = useState([]);
    const [errors, setErrors] = useState({
        code: false,
        discountPercentage: false,
        minimumOrderValue: false,
        startDate: false,
        endDate: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await VoucherService.getAllVouchers();
                setVouchers(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            isActive: e.target.checked,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            code: false,
            discountPercentage: false,
            minimumOrderValue: false,
            startDate: false,
            endDate: false,
        };

        if (!formData.code.trim()) {
            newErrors.code = "Voucher code is required.";
            isValid = false;
        }

        if (!formData.discountPercentage || isNaN(formData.discountPercentage) || parseFloat(formData.discountPercentage) <= 0) {
            newErrors.discountPercentage = "Discount must be a number greater than 0.";
            isValid = false;
        }

        if (!formData.minimumOrderValue || isNaN(formData.minimumOrderValue) || parseFloat(formData.minimumOrderValue) <= 0) {
            newErrors.minimumOrderValue = "Minimum order value must be a number greater than 0.";
            isValid = false;
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required.";
            isValid = false;
        }

        if (!formData.endDate) {
            newErrors.endDate = "End date is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        const data = {
            code: formData.code,
            discountPercentage: parseFloat(formData.discountPercentage),
            minimumOrderValue: parseFloat(formData.minimumOrderValue),
            startDate: formData.startDate,
            endDate: formData.endDate,
            isActive: formData.isActive,
        };

        try {
            let result;
            if (formData.id) {
                result = await VoucherService.updateVoucher(formData.id, data);
                setVouchers(vouchers.map((voucher) => (voucher.id === result.data.id ? result.data : voucher)));
            } else {
                result = await VoucherService.createVoucher(data);
                setVouchers([...vouchers, result.data]);
            }
            toast.success("Voucher saved successfully");
            resetForm();
        } catch (error) {
            toast.error(`Error: ${error.response ? error.response.data : error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            code: "",
            discountPercentage: "",
            minimumOrderValue: "",
            startDate: "",
            endDate: "",
            isActive: true,
        });
        setErrors({
            code: false,
            discountPercentage: false,
            minimumOrderValue: false,
            startDate: false,
            endDate: false,
        });
    };

    const handleEditClick = (voucher) => {
        setFormData({
            id: voucher.id,
            code: voucher.code,
            discountPercentage: voucher.discountPercentage,
            minimumOrderValue: voucher.minimumOrderValue,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
            isActive: voucher.isActive,
        });
    };

    const handleDeleteClick = async (id) => {
        try {
            await VoucherService.deleteVoucher(id);
            setVouchers(vouchers.filter((voucher) => voucher.id !== id));
        } catch (error) {
            console.error("Error deleting voucher", error);
        }
    };

    const { columns, rows } = VoucherTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Manage Voucher</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox p={3} component="form" role="form" onSubmit={handleSubmit}>
                            <ArgonBox mx={3}>
                                {/* Voucher Code Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="text"
                                        placeholder="Voucher Code"
                                        size="large"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        error={!!errors.code}
                                    />
                                    {errors.code && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.code}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                {/* Discount Percentage Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="number"
                                        placeholder="Discount Percentage"
                                        size="large"
                                        name="discountPercentage"
                                        value={formData.discountPercentage}
                                        onChange={handleChange}
                                        error={!!errors.discountPercentage}
                                    />
                                    {errors.discountPercentage && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.discountPercentage}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                {/* Minimum Order Value Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="number"
                                        placeholder="Minimum Order Value"
                                        size="large"
                                        name="minimumOrderValue"
                                        value={formData.minimumOrderValue}
                                        onChange={handleChange}
                                        error={!!errors.minimumOrderValue}
                                    />
                                    {errors.minimumOrderValue && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.minimumOrderValue}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                {/* Start Date Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="date"
                                        placeholder="Start Date"
                                        size="large"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        error={!!errors.startDate}
                                    />
                                    {errors.startDate && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.startDate}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                {/* End Date Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="date"
                                        placeholder="End Date"
                                        size="large"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        error={!!errors.endDate}
                                    />
                                    {errors.endDate && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.endDate}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                {/* Submit Button */}
                                <ArgonBox mb={3} sx={{ width: { xs: '100%', sm: '50%', md: '30%' } }}>
                                    <ArgonButton type="submit" size="large" color="info" fullWidth>
                                        {formData.id ? "Update" : "Create"}
                                    </ArgonButton>
                                </ArgonBox>
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>

                {/* Voucher Table */}
                <ArgonBox>
                    <Card>
                        <Table columns={columns} rows={rows} />
                    </Card>
                </ArgonBox>
            </ArgonBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Voucher;