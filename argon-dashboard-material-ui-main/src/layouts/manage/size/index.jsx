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

        for (const id of selectedRows) {
            try {
                await SizesService.deleteSize(id);
                toast.success(`Size with ID ${id} deleted successfully`);
            } catch (error) {
                console.error(`Error deleting size with ID ${id}`, error);
                toast.error(`Error deleting size with ID ${id}`);
            }
        }
        fetchData();
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
                                    <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Tên kích cỡ</p>
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
                                    <ArgonButton type="submit" size="large" color="info" fullWidth={true}>
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