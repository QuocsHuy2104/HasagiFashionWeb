import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Footer from "../../../examples/Footer";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import CategoryTable from "./data";
import CategoriesService from "../../../services/CategoryServices";
import { Image } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Category() {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({ name: false, image: false });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await CategoriesService.getAllCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.log(err);
    }
  };

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
    const newErrors = { name: false, image: false };
    if (!formData.name.trim()) {
      toast.warn("Vui lòng nhập tên danh mục!!!");
    } else if (/\d/.test(formData.name)) {
      toast.warn("Tên danh mục không được nhập số!!!");
    }

    if (!formData.image) {
      toast.warn("Vui lòng chọn ảnh danh mục!!!");
    }
    setErrors(newErrors);
    return !newErrors.name && !newErrors.image;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl;
      if (formData.image instanceof File) {
        const imageFile = formData.image;
        const storageRef = ref(storage, `categories/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              console.log(
                `Upload progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
              );
            },
            (error) => {
              console.error("Error uploading file:", error);
              toast.error("Lỗi khi tải ảnh lên Firebase.");
              reject(error);
            },
            async () => {
              try {
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              } catch (error) {
                console.error("Error getting download URL:", error);
                toast.error("Lỗi khi lấy URL ảnh.");
                reject(error);
              }
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
        result = await CategoriesService.updateCategory(formData.id, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setCategories(categories.map((cate) => (cate.id === result.data.id ? result.data : cate)));
        toast.success("Cập nhật danh mục thành công");
      } else {
        result = await CategoriesService.createCategory(formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setCategories([...categories, result.data]);
        toast.success("Thêm danh mục thành công");
      }

      fetchData();
      resetForm();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };



  const resetForm = () => {
    setFormData({
      name: "",
      image: null,
    });
    setErrors({ name: false, image: false });
  };

  const handleEditClick = (category) => {
    setFormData(category);
  };

  const handleDeleteClick = async (id) => {
    try {
      await CategoriesService.deleteCategory(id);
      setCategories(categories.filter(cate => cate.id !== id));
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  const { columns, rows } = CategoryTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" p={3}>
              <ArgonTypography variant="h6">Manage Category</ArgonTypography>
            </ArgonBox>

            <ArgonBox
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              p={3}
              component="form"
              role="form"
              onSubmit={handleSubmit}
            >
              <ArgonBox
                mx={{ xs: 0, sm: 3 }}
                width={{ xs: '100%', sm: 400 }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={{ xs: 3, sm: 0 }}
              >
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width={{ xs: '100%', sm: 300 }}
                  height={300}
                  borderRadius="12px"
                  boxShadow="0 0 15px rgba(0,0,0,0.1)"
                  overflow="hidden"
                  mb={2}
                  sx={{
                    backgroundColor: errors.image ? "#f8d7da" : "#f0f0f0",
                    border: errors.image ? "2px solid red" : "none",
                  }}
                >
                  <Image
                    src={
                      formData.image && formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : formData.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"
                    }
                    alt="Category Preview"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </ArgonBox>

                <ArgonButton
                  component="label"
                  variant="outlined"
                  color="info"
                  size="large"
                  sx={{
                    width: '100%',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#d0d0d0',
                    },
                  }}
                >
                  Choose Image
                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                  />
                </ArgonButton>
              </ArgonBox>

              <ArgonBox width={{ xs: '100%' }}>
                <ArgonBox mb={3} display="flex" justifyContent="flex-start" alignItems="center">
                  <ArgonBox width="100%">
                    <ArgonInput
                      type="text"
                      placeholder="Category Name"
                      size="large"
                      name="name"
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderColor: errors.name ? 'red' : 'default',
                        },
                      }}
                    />
                    {errors.name && (
                      <ArgonTypography color="error" variant="caption">
                        Category name is required.
                      </ArgonTypography>
                    )}
                  </ArgonBox>
                </ArgonBox>

                <ArgonBox mb={3} sx={{ width: { xs: '100%', sm: '50%', md: '20%' } }}>
                  <ArgonButton type="submit" size="large" color="info" fullWidth>
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

export default Category;
