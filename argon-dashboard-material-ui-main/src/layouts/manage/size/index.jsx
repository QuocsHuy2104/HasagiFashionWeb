import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import SizeTable from "./data";
import SizesService from "../../../services/SizeServices";
import { toast } from "react-toastify";
import Footer from "../../../examples/Footer";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";

function Size() {
  const [formData, setFormData] = useState({
    id: "",
    name: "", // Đổi từ 'size' thành 'name'
    price: "",
  });

  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({
    name: false, // Đổi từ 'size' thành 'name'
    price: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SizesService.getAllSizes();
        setSizes(response.data || []);
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
    const newErrors = { name: false, price: false };

    if (!formData.name.trim()) {
      newErrors.name = "Size name is required.";
      isValid = false;
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a number greater than 0.";
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
      name: formData.name, // Sử dụng 'name' thay vì 'size'
      price: parseFloat(formData.price),
    };

    try {
      let result;
      if (formData.id) {
        result = await SizesService.updateSize(formData.id, data);
        setSizes(sizes.map((size) => (size.id === result.data.id ? result.data : size)));
      } else {
        result = await SizesService.createSize(data);
        setSizes([...sizes, result.data]);
      }
      toast.success("Size saved successfully");
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "", // Đổi từ 'size' thành 'name'
      price: "",
    });
    setErrors({ name: false, price: false }); // Đổi từ 'size' thành 'name'
  };

  const handleEditClick = (size) => {
    setFormData({
      id: size.id,
      name: size.name, // Sử dụng 'name' thay vì 'size.name'
      price: size.price,
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      await SizesService.deleteSize(id);
      setSizes(sizes.filter((size) => size.id !== id));
    } catch (error) {
      console.error("Error deleting size", error);
    }
  };

  const { columns, rows } = SizeTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" p={3}>
              <ArgonTypography variant="h6">Manage Size</ArgonTypography>
            </ArgonBox>
            <ArgonBox p={3} component="form" role="form" onSubmit={handleSubmit}>
              <ArgonBox mx={3}>
                {/* Size Name Input */}
                <ArgonBox mb={3} position="relative">
                  <ArgonInput
                    type="text"
                    placeholder="Size Name"
                    size="large"
                    name="name" // Đổi từ 'size' thành 'name'
                    value={formData.name} // Đổi từ 'size' thành 'name'
                    onChange={handleChange}
                    error={!!errors.name} // Đổi từ 'size' thành 'name'
                  />
                  {errors.name && (
                    <ArgonTypography variant="caption" color="error">
                      {errors.name} {/* Đổi từ 'size' thành 'name' */}
                    </ArgonTypography>
                  )}
                </ArgonBox>

                {/* Size Price Input */}
                <ArgonBox mb={3} position="relative">
                  <ArgonInput
                    type="number"
                    placeholder="Size Price"
                    size="large"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    error={!!errors.price} // Apply error state
                  />
                  {errors.price && (
                    <ArgonTypography variant="caption" color="error">
                      {errors.price}
                    </ArgonTypography>
                  )}
                </ArgonBox>

                {/* Submit Button */}
                <ArgonBox mb={3} sx={{ width: { xs: '100%', sm: '50%', md: '30%' } }}>
                  <ArgonButton type="submit" size="large" color="info" fullWidth>
                    {formData.id ? "Update" : "Create"}
                  </ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>

      {/* Table of Sizes */}
      <ArgonBox>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderSize } }) =>
                      `${borderWidth[1]} solid ${borderSize}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Size;
