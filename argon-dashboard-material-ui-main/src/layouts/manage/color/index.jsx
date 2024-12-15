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

        for (const id of selectedRows) {
            try {
                await ColorsService.deleteColor(id);
                toast.success(`Color with ID ${id} deleted successfully`);
            } catch (error) {
                console.error(`Error deleting color with ID ${id}`, error);
                toast.error(`Error deleting color with ID ${id}`);
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
                                    <ArgonButton type="submit" size="large" color="info" fullWidth={true}>
                                        {formData.id ? "Cập nhật" : "Lưu"}
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