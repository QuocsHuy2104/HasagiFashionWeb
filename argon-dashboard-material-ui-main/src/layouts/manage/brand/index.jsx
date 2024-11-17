import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import BrandTable from "./data";
import Footer from "../../../examples/Footer";
import BrandsService from "../../../services/BrandServices";
import { Image } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Brand() {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BrandsService.getAllBrands();
        setBrands(response.data || []);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file || formData.image,
    });
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      toast.warn("Vui lòng nhập tên thương hiệu!!!");
    } else if (/\d/.test(formData.name)) {
      toast.warn("Tên thương hiệu không được nhập số!!!");
    }

    if (!formData.image) {
      toast.warn("Vui lòng chọn ảnh thương hiệu!!!");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl;

      if (formData.image instanceof File) {
        const storageRef = ref(storage, `brands/${formData.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, formData.image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            reject,
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((url) => {
                  imageUrl = url;
                  resolve();
                })
                .catch(reject);
            }
          );
        });
      } else {
        imageUrl = formData.image;
      }

      const data = {
        name: formData.name,
        image: imageUrl,
      };

      const formDataObj = new FormData();
      formDataObj.append("name", data.name);
      formDataObj.append("image", data.image);

      let result;
      if (formData.id) {
        result = await BrandsService.updateBrand(formData.id, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setBrands(brands.map((cate) => (cate.id === result.data.id ? result.data : cate)));
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        result = await BrandsService.createBrand(formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setBrands([...brands, result.data]);
        toast.success("Thêm thương hiệu thành công");
      }

      resetForm();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!!!");
    }
  };



  const resetForm = () => {
    setFormData({
      name: "",
      image: null,
    });
    setErrors({});
  };

  const handleEditClick = (brand) => {
    setFormData(brand);
    setErrors({});
  };

  const handleDeleteClick = async (id) => {
    try {
      await BrandsService.deleteBrand(id);
      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (error) {
      console.error("Error deleting brand", error);
    }
  };

  const { columns, rows } = BrandTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" p={3}>
              <ArgonTypography variant="h6">Manage Brand</ArgonTypography>
            </ArgonBox>

            <ArgonBox
              display="flex"
              flexDirection={{ xs: "column", md: "row" }} // Responsive direction
              justifyContent="space-between"
              alignItems="center"
              p={3}
              component="form"
              role="form"
              onSubmit={handleSubmit}
            >
              <ArgonBox
                mb={3}
                mx={3}
                width={{ xs: "100%", md: 400 }} // Responsive width
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width={{ xs: "100%", md: 300 }} // Responsive width for image box
                  height={300}
                  borderRadius="12px"
                  boxShadow="0 0 15px rgba(0,0,0,0.1)"
                  overflow="hidden"
                  mb={2}
                  sx={{
                    backgroundColor: "#f0f0f0",
                    border: errors.image ? "1px solid red" : "",  // Add red border if error
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Image
                    src={
                      formData.image && formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : formData.image ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"
                    }
                    alt="Brand Preview"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </ArgonBox>

                {errors.image && (
                  <ArgonTypography variant="caption" color="error">
                    {errors.image}
                  </ArgonTypography>
                )}

                <ArgonButton
                  component="label"
                  variant="outlined"
                  color="info"
                  size="large"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#d0d0d0",
                    },
                  }}
                >
                  Choose Image
                  <input type="file" name="image" hidden onChange={handleFileChange} />
                </ArgonButton>
              </ArgonBox>

              <ArgonBox
                width={{ xs: "100%" }} // Responsive width for input box
                display="flex"
                flexDirection="column"
              >
                <ArgonBox mb={3}>
                  <ArgonBox>
                    <ArgonInput
                      type="text"
                      placeholder="Brand Name"
                      size="large"
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={Boolean(errors.name)} // Simplified boolean conversion
                      sx={{
                        "& fieldset": {
                          borderColor: errors.name ? "red" : "rgba(0, 0, 0, 0.23)", // Red border on error
                        },
                        "&:hover fieldset": {
                          borderColor: errors.name ? "red" : "black", // Maintain hover effect with error
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: errors.name ? "red" : "blue", // Blue border on focus unless error
                        },
                      }}
                    />
                  </ArgonBox>
                  {errors.name && (
                    <ArgonTypography variant="caption" color="error">
                      {errors.name}
                    </ArgonTypography>
                  )}
                </ArgonBox>

                <ArgonBox mb={3} sx={{ width: { xs: '100%', sm: '50%', md: '20%' } }}>
                  <ArgonButton type="submit" size="large" color="info" fullWidth={true}>
                    {formData.id ? "Update" : "Create"}
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
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
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

export default Brand;
