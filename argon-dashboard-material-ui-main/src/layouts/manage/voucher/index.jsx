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
import VoucherService from "../../../services/VoucherServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        maxDiscount: "",
        quantity: "",
        usageCount: "",
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
        maxDiscount: false,
        quantity: false,
        usageCount: false,
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
    
        if (!formData.code || formData.code.trim() === "") {
            toast.error("Trường mã voucher không được để trống.");
            isValid = false;
        }
    
        if (!formData.discountPercentage) {
            toast.error("Trường giảm giá không được để trống.");
            isValid = false;
        } else if (
            isNaN(formData.discountPercentage) ||
            parseFloat(formData.discountPercentage) <= 0 ||
            parseFloat(formData.discountPercentage) > 100
        ) {
            toast.error("Giảm giá phải là số lớn hơn 0 và nhỏ hơn hoặc bằng 100.");
            isValid = false;
        }
    
        if (!formData.minimumOrderValue || isNaN(formData.minimumOrderValue)) {
            toast.error("Trường giá trị đơn hàng tối thiểu phải là số hợp lệ.");
            isValid = false;
        }
    
        if (!formData.maxDiscount || isNaN(formData.maxDiscount)) {
            toast.error("Trường giảm giá tối đa phải là số hợp lệ.");
            isValid = false;
        }
    
        if (!formData.quantity || isNaN(formData.quantity)) {
            toast.error("Trường số lượng phải là số hợp lệ.");
            isValid = false;
        }
    
        const currentDate = new Date().toISOString().split("T")[0];
        if (!formData.startDate) {
            toast.error("Ngày bắt đầu không được để trống.");
            isValid = false;
        } else if (!formData.id && formData.startDate < currentDate) {
            toast.error("Ngày bắt đầu không được trước ngày hiện tại khi tạo mới.");
            isValid = false;
        }
    
        if (!formData.endDate) {
            toast.error("Ngày kết thúc không được để trống.");
            isValid = false;
        } else if (formData.endDate < formData.startDate) {
            toast.error("Ngày kết thúc không được trước ngày bắt đầu.");
            isValid = false;
        }
    
        return isValid;
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = {
            code: formData.code,
            discountPercentage: parseFloat(formData.discountPercentage),
            minimumOrderValue: parseFloat(formData.minimumOrderValue),
            maxDiscount: parseFloat(formData.maxDiscount),
            quantity: formData.quantity,
            usageCount: formData.usageCount,
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
            toast.success("Lưu voucher thành công!");
            resetForm();
        } catch (error) {
            toast.error(`Lỗi: ${error.response ? error.response.data : error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            code: "",
            discountPercentage: "",
            minimumOrderValue: "",
            maxDiscount: "",
            quantity: "",
            usageCount: "",
            startDate: "",
            endDate: "",
            isActive: true,
        });
        setErrors({
            code: false,
            discountPercentage: false,
            minimumOrderValue: false,
            maxDiscount: false,
            quantity: false,
            usageCount: false,
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
            maxDiscount: voucher.maxDiscount,
            quantity: voucher.quantity,
            usageCount: voucher.usageCount,
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
            <ToastContainer />
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card sx={{ borderRadius: '15px', boxShadow: 3 }}>
                        <ArgonBox display="flex" justifyContent="space-between" p={2} sx={{ borderRadius: '15px 15px 0 0' }}>
                            <ArgonTypography variant="h6" color="dark">Quản lý phiếu giảm giá</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox p={3} component="form" role="form" onSubmit={handleSubmit} sx={{ borderRadius: '0 0 15px 15px' }}>
                            <ArgonBox mx={3}>
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="text"
                                        placeholder="Mã giảm giá"
                                        size="large"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        error={!!errors.code}
                                        sx={{ bgcolor: 'white', borderRadius: '8px' }}
                                    />
                                </ArgonBox>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="number"
                                                placeholder="Phầm trăm giảm giá"
                                                size="large"
                                                name="discountPercentage"
                                                value={formData.discountPercentage}
                                                onChange={handleChange}
                                                error={!!errors.discountPercentage}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                        </ArgonBox>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="number"
                                                placeholder="Số lượng"
                                                size="large"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                error={!!errors.quantity}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                        </ArgonBox>
                                    </Grid>
                                </Grid>


                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="number"
                                                placeholder="Giá trị tối thiểu hóa đơn"
                                                size="large"
                                                name="minimumOrderValue"
                                                value={formData.minimumOrderValue}
                                                onChange={handleChange}
                                                error={!!errors.minimumOrderValue}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                        </ArgonBox>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="number"
                                                placeholder="Giảm tối đa"
                                                size="large"
                                                name="maxDiscount"
                                                value={formData.maxDiscount}
                                                onChange={handleChange}
                                                error={!!errors.maxDiscount}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                        </ArgonBox>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="date"
                                                placeholder="Ngày bắt đầu"
                                                size="large"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                error={!!errors.startDate}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                        </ArgonBox>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <ArgonInput
                                                type="date"
                                                placeholder="Ngày hết hạn"
                                                size="large"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                error={!!errors.endDate}
                                                sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                            />
                                        </ArgonBox>
                                    </Grid>
                                </Grid>

                                <ArgonBox mb={3} sx={{ width: { xs: '50%', sm: '10%', md: '10%' } }}>
                                    <ArgonButton type="submit" size="large" color="info" fullWidth>
                                        {formData.id ? "Cập nhật" : "Tạo"}
                                    </ArgonButton>
                                </ArgonBox>
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>


                <ArgonBox sx={{ bgcolor: '#f5f5f5', borderRadius: '10px 10px 0 0' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
                        <Tab label="Còn hạn" sx={{ minWidth: '100px', padding: '0 20px' }} />
                        <Tab label="Hết hạn" sx={{ minWidth: '100px', padding: '0 20px' }} />
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