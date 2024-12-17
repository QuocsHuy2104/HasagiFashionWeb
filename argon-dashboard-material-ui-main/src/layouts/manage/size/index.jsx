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
import SizesService from "../../../services/SizeServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function Size() {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
    });

    const [errors, setErrors] = useState({
        name: false,
    });

    const [sizes, setSizes] = useState([]);

    const fetchData = async () => {
        try {
            const response = await SizesService.getAllSizes();
            setSizes(response.data || []);
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
            toast.warn("Vui lòng nhập tên kích cỡ!!!");
            isValid = false;
        } else if (isSizeNameDuplicate(formData.name)) {
            newErrors.name = true;
            toast.warn("Tên kích cỡ đã tồn tại!!!");
        }


        setErrors(newErrors);
        return isValid;
    };

    const isSizeNameDuplicate = (sizeName) => {
        const existingSizeNames = sizes.map((size) => size.name.trim().toLowerCase());
        return existingSizeNames.includes(sizeName.trim().toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        if (isSizeNameDuplicate(formData.name)) {
            return;
        }
        const data = { name: formData.name };
        try {
            let result;
            if (formData.id) {
                result = await SizesService.updateSize(formData.id, data);
                toast.success("Size updated successfully");
            } else {
                result = await SizesService.createSize(data);
                toast.success("Size created successfully");
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

    const handleEditClick = (size) => {
        setFormData(size);
        setErrors({});
    };

    const handleDeleteClick = async (selectedRows) => {
        if (selectedRows.length === 0) return;

        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Muốn xóa ${selectedRows.length} kích cỡ này không!`,
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
                    await sizesService.deletesize(id);
                } catch (error) {
                    hasError = true;
                    console.error(`Error deleting size with ID ${id}`, error);
                }
            }

            fetchData(); // Tải lại dữ liệu sau khi hoàn tất

            // Hiển thị thông báo tổng kết với backdrop
            if (hasError) {
                Swal.fire({
                    title: 'Xóa thất bại!',
                    text: 'Không thể xóa kích cỡ này!!!',
                    icon: 'info',
                    backdrop: 'rgba(0, 0, 0, 0)',
                });
            } else {
                Swal.fire({
                    title: 'Xóa thành công!',
                    text: 'Đã xóa kích cỡ thành công',
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
                            <ArgonTypography variant="h6">Quản lý Size</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox
                            p={3}
                            component="form"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <ArgonBox mx={3}>
                                <ArgonBox mb={3} position="relative">
                                    <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', size: '#333' }}>Tên kích cỡ</p>
                                    <ArgonInput
                                        type="text"
                                        placeholder="Nhập tên kích cỡ"
                                        size="large"
                                        name="name"
                                        fullWidth
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                    />
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
                            sizes={sizes}
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

export default Size;