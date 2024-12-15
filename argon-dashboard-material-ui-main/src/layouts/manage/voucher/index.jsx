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
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchHistory, setSearchHistory] = useState("");

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
        const newErrors = {};

        if (!formData.code || formData.code.trim() === "") {
            toast.warn("Trường mã voucher không được để trống.");
            newErrors.code = true;
            isValid = false;
        } else if (
            vouchers.some(
                (voucher) =>
                    voucher.code.trim().toLowerCase() === formData.code.trim().toLowerCase() &&
                    voucher.id !== formData.id
            )
        ) {
            toast.warn("Mã voucher đã tồn tại. Vui lòng nhập mã khác.");
            newErrors.code = true;
            isValid = false;
        }

        if (!formData.discountPercentage) {
            toast.warn("Trường giảm giá không được để trống.");
            newErrors.discountPercentage = true;
            isValid = false;
        } else if (
            isNaN(formData.discountPercentage) ||
            parseFloat(formData.discountPercentage) <= 0 ||
            parseFloat(formData.discountPercentage) > 100
        ) {
            toast.warn("Giảm giá phải là số lớn hơn 0 và nhỏ hơn hoặc bằng 100.");
            newErrors.discountPercentage = true;
            isValid = false;
        }

        if (!formData.minimumOrderValue || isNaN(formData.minimumOrderValue)) {
            toast.warn("Trường giá trị đơn hàng tối thiểu phải là số hợp lệ.");
            newErrors.minimumOrderValue = true;
            isValid = false;
        }

        if (!formData.maxDiscount || isNaN(formData.maxDiscount)) {
            toast.warn("Trường giảm giá tối đa phải là số hợp lệ.");
            newErrors.maxDiscount = true;
            isValid = false;
        }

        if (!formData.quantity || isNaN(formData.quantity)) {
            toast.warn("Trường số lượng phải là số hợp lệ.");
            newErrors.quantity = true;
            isValid = false;
        }

        const currentDate = new Date().toISOString().split("T")[0];
        if (!formData.startDate) {
            toast.warn("Ngày bắt đầu không được để trống.");
            newErrors.startDate = true;
            isValid = false;
        } else if (!formData.id && formData.startDate < currentDate) {
            toast.warn("Ngày bắt đầu không được trước ngày hiện tại.");
            newErrors.startDate = true;
            isValid = false;
        }

        if (!formData.endDate) {
            toast.warn("Ngày hết hạn không được để trống.");
            newErrors.endDate = true;
            isValid = false;
        } else if (formData.endDate < formData.startDate) {
            toast.warn("Ngày hết hạn không được trước ngày bắt đầu.");
            newErrors.endDate = true;
            isValid = false;
        }

        setErrors(newErrors);
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



    const { columns, rows, refreshVouchers } = VoucherTable({
        onEditClick: handleEditClick,
        onDeleteClick: handleDeleteClick,
        searchKeyword: searchKeyword,
    });


    const { columnsHistory, rowsHistory, refreshHistory } = VoucherHistoryTable({
        onEditClick: handleEditClick,
        onDeleteClick: handleDeleteClick,
        searchHistory: searchHistory
    });

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
                                    <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Mã giảm giá</p>
                                    <ArgonInput
                                        type="text"
                                        placeholder="Nhập mã giảm giá"
                                        size="large"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        error={!!errors.code}
                                    />
                                </ArgonBox>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Giảm %</p>
                                            <ArgonInput
                                                type="number"
                                                placeholder="Nhập phầm trăm giảm giá"
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
                                            <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Số lượng</p>
                                            <ArgonInput
                                                type="number"
                                                placeholder="Nhập số lượng"
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
                                            <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Điều kiện giá tối thiểu</p>
                                            <ArgonInput
                                                type="number"
                                                placeholder="Nhập giá trị tối thiểu hóa đơn"
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
                                            <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Giảm tối đa</p>
                                            <ArgonInput
                                                type="number"
                                                placeholder="Nhập giá giảm tối đa"
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
                                            <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                                                Ngày bắt đầu
                                            </p>
                                            <ArgonInput
                                                type="date"
                                                placeholder="Ngày bắt đầu"
                                                size="large"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                sx={{
                                                    borderColor: errors.startDate ? 'red' : 'Gainsboro',
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid',
                                                    borderRadius: '8px',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: errors.startDate ? 'red' : 'Gainsboro',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: errors.startDate ? 'red' : 'black',
                                                        },
                                                    },
                                                }}
                                            />
                                        </ArgonBox>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <ArgonBox mb={3} position="relative">
                                            <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                                                Ngày hết hạn
                                            </p>
                                            <ArgonInput
                                                type="date"
                                                placeholder="Ngày hết hạn"
                                                size="large"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                sx={{
                                                    borderColor: errors.endDate ? 'red' : 'Gainsboro',
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid',
                                                    borderRadius: '8px',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: errors.endDate ? 'red' : 'Gainsboro',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: errors.endDate ? 'red' : 'black',
                                                        },
                                                    },
                                                }}
                                            />
                                        </ArgonBox>
                                    </Grid>
                                </Grid>
                                <ArgonBox mb={3} width={720} display="flex" gap={1} justifyContent="flex-start">
                                    <ArgonButton
                                        type="submit"
                                        size="large"
                                        color="info"
                                        sx={{ minWidth: 100, padding: '8px 16px' }}
                                    >
                                        {formData.id ? "Cập nhật" : "Thêm"}
                                    </ArgonButton>
                                    <ArgonButton
                                        size="large"
                                        color="primary"
                                        sx={{ minWidth: 100, padding: '8px 16px' }}
                                        onClick={resetForm}
                                    >
                                        Làm mới
                                    </ArgonButton>
                                </ArgonBox>

                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>


                <ArgonBox sx={{ bgcolor: '#f5f5f5', borderRadius: '10px 10px 0 0' }}>

                    {activeTab === 0 && (
                        <Card sx={{ mb: 3, borderRadius: '10px', boxShadow: 3 }}>
                            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
                                <Tab label="Còn hạn" sx={{ minWidth: '100px', padding: '0 20px' }} />
                                <Tab label="Hết hạn" sx={{ minWidth: '100px', padding: '0 20px' }} />
                            </Tabs>

                            <ArgonBox
                                mb={3}
                                p={2}
                                display="flex"
                                justifyContent="flex-start"
                                alignItems="center"
                                border="1px solid #e0e0e0"
                                borderRadius="8px"
                                bgcolor="#f9f9f9"
                                gap="16px"
                            >
                                <ArgonBox width="30%">
                                    <ArgonInput
                                        type="text"
                                        placeholder="🔍 Tìm kiếm..."
                                        style={{
                                            padding: "12px 16px",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                            width: "100%",
                                            backgroundColor: "#fff",
                                            fontSize: "14px",
                                        }}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </ArgonBox>

                                <ArgonBox>
                                    <ArgonButton
                                        variant="contained"
                                        color="primary"
                                        style={{
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                        onClick={refreshVouchers}
                                    >
                                        🔄 Làm mới danh sách
                                    </ArgonButton>
                                </ArgonBox>
                            </ArgonBox>
                            <Table columns={columns} rows={rows} />
                        </Card>
                    )}

                    {activeTab === 1 && (
                        <Card sx={{ mb: 3, borderRadius: '10px', boxShadow: 3 }}>
                            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
                                <Tab label="Còn hạn" sx={{ minWidth: '100px', padding: '0 20px' }} />
                                <Tab label="Hết hạn" sx={{ minWidth: '100px', padding: '0 20px' }} />
                            </Tabs>
                            <ArgonBox
                                mb={3}
                                p={2}
                                display="flex"
                                justifyContent="flex-start"
                                alignItems="center"
                                border="1px solid #e0e0e0"
                                borderRadius="8px"
                                bgcolor="#f9f9f9"
                                gap="16px"
                            >
                                <ArgonBox width="30%">
                                    <ArgonInput
                                        type="text"
                                        placeholder="🔍 Tìm kiếm..."
                                        style={{
                                            padding: "12px 16px",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                            width: "100%",
                                            backgroundColor: "#fff",
                                            fontSize: "14px",
                                        }}
                                        onChange={(e) => setSearchHistory(e.target.value)}
                                    />
                                </ArgonBox>

                                <ArgonBox>
                                    <ArgonButton
                                        variant="contained"
                                        color="primary"
                                        style={{
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                        onClick={refreshVouchers}
                                    >
                                        🔄 Làm mới danh sách
                                    </ArgonButton>
                                </ArgonBox>
                            </ArgonBox>

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