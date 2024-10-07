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
import { toast } from "react-toastify";

function Color() {
    const [formData, setFormData] = useState({
        id: "",
        color: "",
    });

    const [errors, setErrors] = useState({
        color: false,
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
        const newErrors = { color: false };

        // Validation: Color name cannot be empty
        if (!formData.color.trim()) {
            newErrors.color = "Color name is required.";
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

        const data = { color: formData.color };

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
            color: "",
        });
        setErrors({ color: false });
    };

    const handleEditClick = (color) => {
        setFormData({
            id: color.id,
            color: color.color,
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
                                        name="color"
                                        fullWidth
                                        value={formData.color}
                                        onChange={handleChange}
                                        error={!!errors.color} // Show error state
                                    />
                                    {errors.color && (
                                        <ArgonTypography variant="caption" color="error">
                                            {errors.color}
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
