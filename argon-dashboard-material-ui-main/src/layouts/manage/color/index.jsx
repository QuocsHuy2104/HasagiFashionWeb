import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import DataTable from "./data";
import Footer from "../../../examples/Footer";
import ColorsService from "../../../services/ColorServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function Color() {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
    });

    const [errors, setErrors] = useState({
        name: false,
    });

    const [colors, setColors] = useState([]);


    const fetchData = async () => {
        try {
            const response = await ColorsService.getAllColors();
            setColors(response.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
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
        const newErrors = { name: false };
        if (!formData.name.trim()) {
            newErrors.name = true;
            toast.warn("Vui lòng nhập tên màu!!!");
            isValid = false;
        } else if (isColorNameDuplicate(formData.name)) {
            newErrors.name = true;
            toast.warn("Tên màu đã tồn tại!!!");
        }

        setErrors(newErrors);
        return isValid;
    };

    const isColorNameDuplicate = (colorName) => {
        const existingColorNames = colors.map((color) => color.name.trim().toLowerCase());
        return existingColorNames.includes(colorName.trim().toLowerCase());
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        if (isColorNameDuplicate(formData.name)) {
            return;
        }

        const data = { name: formData.name };

        try {
            let result;
            if (formData.id) {
                result = await ColorsService.updateColor(formData.id, data);
                toast.success("Cập nhật màu thành công");
            } else {
                result = await ColorsService.createColor(data);
                toast.success("Thêm màu thành công!");
            }
            fetchData();
            resetForm();
        } catch (error) {
            toast.error(`Error: ${error.response ? error.response.data : error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
        });
        setErrors({ name: false });
    };

    const handleEditClick = (color) => {
        setFormData({
            id: color.id,
            name: color.name,
        });
    };


    const handleDeleteClick = async (selectedRows) => {
        if (selectedRows.length === 0) return;

        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Muốn xóa ${selectedRows.length} màu này không!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Đóng',
            backdrop: 'rgba(0, 0, 0, 0)', // Backdrop cho hộp xác nhận
        });

        if (result.isConfirmed) {
            let hasError = false;

            for (const id of selectedRows) {
                try {
                    await ColorsService.deleteColor(id);
                } catch (error) {
                    hasError = true;
                    console.error(`Error deleting color with ID ${id}`, error);
                }
            }

            fetchData(); // Tải lại dữ liệu sau khi hoàn tất

            // Hiển thị thông báo tổng kết với backdrop
            if (hasError) {
                Swal.fire({
                    title: 'Xóa thất bại!',
                    text: 'Không thể xóa màu này!!!',
                    icon: 'info',
                    backdrop: 'rgba(0, 0, 0, 0)',
                });
            } else {
                Swal.fire({
                    title: 'Xóa thành công!',
                    text: 'Đã xóa màu thành công',
                    icon: 'success',
                    backdrop: 'rgba(0, 0, 0, 0)',
                });
            }
        }
    };



    return (
        <DashboardLayout>
            <ToastContainer />
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Quản lý màu sắc</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox
                            p={3}
                            component="form"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <ArgonBox mx={3}>
                                <ArgonBox mb={3} position="relative">
                                    <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Tên màu</p>
                                    <ArgonInput
                                        type="text"
                                        placeholder="Nhập tên màu sắc"
                                        size="large"
                                        name="name"
                                        fullWidth
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                    />
                                    {errors.name && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.name}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>
                                <ArgonBox mb={3}>
                                    <ArgonButton
                                        type="submit"
                                        size="large"
                                        color="info"
                                        sx={{ minWidth: 100, padding: '8px 16px' }}>
                                        {formData.id ? "Cập nhật" : "Thêm"}
                                    </ArgonButton>
                                </ArgonBox>
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>
            </ArgonBox>

            <ArgonBox>
                <ArgonBox mb={3}>
                    <Card>
                        <DataTable
                            colors={colors}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    </Card>
                </ArgonBox>
            </ArgonBox>

            <Footer />
        </DashboardLayout>
    );
}

export default Color;