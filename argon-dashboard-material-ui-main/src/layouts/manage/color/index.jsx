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
        name: "",  // Thay đổi 'color' thành 'name'
    });

    const [errors, setErrors] = useState({
        name: false,  // Thay đổi 'color' thành 'name'
    });

    const [colors, setColors] = useState([]);

    // Fetch color data
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
        const newErrors = { name: false };  // Thay đổi 'color' thành 'name'

        // Validation: Name cannot be empty
        if (!formData.name.trim()) {  // Thay đổi 'color' thành 'name'
            newErrors.name = "Color name is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        const data = { name: formData.name };  // Thay đổi 'color' thành 'name'

        try {
            let result;
            if (formData.id) {
                result = await ColorsService.updateColor(formData.id, data);
                toast.success("Color updated successfully");
            } else {
                result = await ColorsService.createColor(data);
                toast.success("Color created successfully");
            }
            fetchData(); // Refresh data after create/update
            resetForm();
        } catch (error) {
            toast.error(`Error: ${error.response ? error.response.data : error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",  // Thay đổi 'color' thành 'name'
        });
        setErrors({ name: false });  // Thay đổi 'color' thành 'name'
    };

    const handleEditClick = (color) => {
        setFormData({
            id: color.id,
            name: color.name,  // Thay đổi 'color' thành 'name'
        });
    };

    // Handle deletion of selected rows
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
        fetchData(); // Refresh data after deletion
    };

    return (
        <DashboardLayout>
            <ToastContainer />
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Manage Color</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox
                            p={3}
                            component="form"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <ArgonBox mx={3}>
                                {/* Color Name Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="text"
                                        placeholder="Color Name"
                                        size="large"
                                        name="name"  // Thay đổi 'color' thành 'name'
                                        fullWidth
                                        value={formData.name}  // Thay đổi 'color' thành 'name'
                                        onChange={handleChange}
                                        error={!!errors.name}  // Thay đổi 'color' thành 'name'
                                    />
                                    {errors.name && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.name}
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                {/* Submit Button */}
                                <ArgonBox mb={3}>
                                    <ArgonButton type="submit" size="large" color="info" fullWidth={true}>
                                        {formData.id ? "Update" : "Save"}
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