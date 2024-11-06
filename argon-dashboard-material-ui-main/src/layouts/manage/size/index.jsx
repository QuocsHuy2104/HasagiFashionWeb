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
import { toast } from "react-toastify";

function Size() {
    const [formData, setFormData] = useState({
        id: "",
        name: "",  // Thay đổi 'size' thành 'name'
    });

    const [errors, setErrors] = useState({
        name: false,  // Thay đổi 'size' thành 'name'
    });

    const [sizes, setSizes] = useState([]);

    // Fetch size data
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
        const newErrors = { name: false };  // Thay đổi 'size' thành 'name'

        // Validation: Name cannot be empty
        if (!formData.name.trim()) {  // Thay đổi 'size' thành 'name'
            newErrors.name = "Size name is required.";
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

        const data = { name: formData.name };  // Thay đổi 'size' thành 'name'

        try {
            let result;
            if (formData.id) {
                result = await SizesService.updateSize(formData.id, data);
                toast.success("Size updated successfully");
            } else {
                result = await SizesService.createSize(data);
                toast.success("Size created successfully");
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
            name: "",  // Thay đổi 'size' thành 'name'
        });
        setErrors({ name: false });  // Thay đổi 'size' thành 'name'
    };

    const handleEditClick = (size) => {
        setFormData({
            id: size.id,
            name: size.name,  // Thay đổi 'size' thành 'name'
        });
    };

    // Handle deletion of selected rows
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
        fetchData(); // Refresh data after deletion
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Manage Size</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox
                            p={3}
                            component="form"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <ArgonBox mx={3}>
                                {/* Size Name Input */}
                                <ArgonBox mb={3} position="relative">
                                    <ArgonInput
                                        type="text"
                                        placeholder="Size Name"
                                        size="large"
                                        name="name"  // Thay đổi 'size' thành 'name'
                                        fullWidth
                                        value={formData.name}  // Thay đổi 'size' thành 'name'
                                        onChange={handleChange}
                                        error={!!errors.name}  // Thay đổi 'size' thành 'name'
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
