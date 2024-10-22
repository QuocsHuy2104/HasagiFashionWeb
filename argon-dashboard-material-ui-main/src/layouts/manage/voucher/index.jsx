import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import VoucherTable from "./data";
import VoucherHistoryTable from "./voucherHistory";
import VoucherService from "../../../services/VoucherServices"; // Đổi SizeServices thành VoucherService
import { toast } from "react-toastify";
import Footer from "../../../examples/Footer";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import { Tabs, Tab } from '@mui/material';
import { Grid } from '@mui/material';

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
    
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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


    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            code: false,
            discountPercentage: false,
            minimumOrderValue: false,
            startDate: false,
            endDate: false,
        };

        // Lấy ngày hiện tại
        const currentDate = new Date().toISOString().split("T")[0]; // Định dạng thành yyyy-mm-dd

        // Kiểm tra mã voucher
        if (!formData.code.trim()) {
            newErrors.code = "Voucher code is required.";
            isValid = false;
        }

        // Kiểm tra giá trị giảm giá
        if (!formData.discountPercentage || isNaN(formData.discountPercentage) || parseFloat(formData.discountPercentage) <= 0) {
            newErrors.discountPercentage = "Discount must be a number greater than 0.";
            isValid = false;
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (!formData.minimumOrderValue || isNaN(formData.minimumOrderValue) || parseFloat(formData.minimumOrderValue) <= 0) {
            newErrors.minimumOrderValue = "Minimum order value must be a number greater than 0.";
            isValid = false;
        }

        // Kiểm tra ngày bắt đầu
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required.";
            isValid = false;
        } else if (formData.startDate < currentDate) {
            newErrors.startDate = "Start date cannot be before the current date.";
            isValid = false;
        }

        // Kiểm tra ngày kết thúc
        if (!formData.endDate) {
            newErrors.endDate = "End date is required.";
            isValid = false;
        } else if (formData.endDate < formData.startDate) {
            newErrors.endDate = "End date cannot be before the start date.";
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



    const { columns, rows } = VoucherTable({
        onEditClick: handleEditClick,
        onDeleteClick: handleDeleteClick,
    });


    const { columnsHistory, rowsHistory } = VoucherHistoryTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card sx={{ borderRadius: '15px', boxShadow: 3 }}>
                        <ArgonBox display="flex" justifyContent="space-between" p={2} sx={{ borderRadius: '15px 15px 0 0' }}>
                            <ArgonTypography variant="h6" color="dark">Manage Voucher</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox p={3} component="form" role="form" onSubmit={handleSubmit} sx={{ borderRadius: '0 0 15px 15px' }}>
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
                                        sx={{ bgcolor: 'white', borderRadius: '8px' }}
                                    />
                                    {errors.code && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.code}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                <Grid container spacing={3}>
                                    {/* Discount Percentage Input */}
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="number"
                                                placeholder="Discount Percentage"
                                                size="large"
                                                name="discountPercentage"
                                                value={formData.discountPercentage}
                                                onChange={handleChange}
                                                error={!!errors.discountPercentage}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                            {errors.discountPercentage && (
                                                <ArgonTypography variant="caption" color="error">
                                                    {errors.discountPercentage}
                                                </ArgonTypography>
                                            )}
                                        </ArgonBox>
                                    </Grid>

                                    {/* Minimum Order Value Input */}
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="number"
                                                placeholder="Minimum Order Value"
                                                size="large"
                                                name="minimumOrderValue"
                                                value={formData.minimumOrderValue}
                                                onChange={handleChange}
                                                error={!!errors.minimumOrderValue}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                            {errors.minimumOrderValue && (
                                                <ArgonTypography variant="caption" color="error">
                                                    {errors.minimumOrderValue}
                                                </ArgonTypography>
                                            )}
                                        </ArgonBox>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="date"
                                                placeholder="Start Date"
                                                size="large"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                error={!!errors.startDate}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                            {errors.startDate && (
                                                <ArgonTypography variant="caption" color="error">
                                                    {errors.startDate}
                                                </ArgonTypography>
                                            )}
                                        </ArgonBox>
                                    </Grid>

                                    {/* End Date Input */}
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="date"
                                                placeholder="End Date"
                                                size="large"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                error={!!errors.endDate}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                            {errors.endDate && (
                                                <ArgonTypography variant="caption" color="error">
                                                    {errors.endDate}
                                                </ArgonTypography>
                                            )}
                                        </ArgonBox>
                                    </Grid>
                                </Grid>

                                {/* Submit Button */}
                                <ArgonBox mb={3} sx={{ width: { xs: '50%', sm: '10%', md: '10%' } }}>
                                    <ArgonButton type="submit" size="large" color="info" fullWidth>
                                        {formData.id ? "Update" : "Create"}
                                    </ArgonButton>
                                </ArgonBox>
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>


                {/* Voucher Table */}
                <ArgonBox sx={{ bgcolor: '#f5f5f5', borderRadius: '10px 10px 0 0' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
                        <Tab label="Còn hạn" sx={{ minWidth: '100px', padding: '0 16px' }} />
                        <Tab label="Hết hạn" sx={{ minWidth: '100px', padding: '0 16px' }} />
                    </Tabs>

                    {activeTab === 0 && (
                        <Card sx={{ mb: 3, borderRadius: '10px', boxShadow: 3 }}>
                            <Table columns={columns} rows={rows} />
                        </Card>
                    )}

                    {activeTab === 1 && (
                        <Card sx={{ mb: 3, borderRadius: '10px', boxShadow: 3 }}>
                            <Table columns={columnsHistory} rows={rowsHistory} />
                        </Card>
                    )}
                </ArgonBox>
            </ArgonBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Voucher;