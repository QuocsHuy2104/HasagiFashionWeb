
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonSelect from '../../../components/ArgonSelect';
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import ProductTable from "./data";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Footer from "../../../examples/Footer";

import BrandService from "../../../services/BrandServices";
import CategoriesService from "../../../services/CategoryServices";
import ProductService from "../../../services/ProductServices";
// import SelectImage from "./selectTag";
// import { storage } from '../../../config/firebase-config'; // Import your storage reference
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";



function Product() {

    const [formData, setFormData] = useState({
        id: '',
        name: "",
        description: "",
        trademarkId: "",
        categoryId: "",
        image: null,
        sale: 0,
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState({});
    //  const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trademarkResponse = await BrandService.getAllBrands();
                setBrands(trademarkResponse.data);

                const categoryResponse = await CategoriesService.getAllCategories();
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // const handleImageChange = (file) => {
    //     setFormData({
    //         ...formData,
    //         image: file
    //     });
    // };

    const validateFields = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.categoryId) newErrors.categoryId = "Category is required";
        if (!formData.trademarkId) newErrors.trademarkId = "Brand is required";
        //    if (!formData.image) newErrors.image = "Image is required";
        // if (!formData.sale || isNaN(formData.sale) || parseFloat(formData.sale) <= 0) {
        //     newErrors.sale = "Valid sale value is required";
        // }
        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        // let imageUrl = formData.image;
        // if (formData.image instanceof File) {
        //     try {
        //         imageUrl = await uploadImageToFirebase(formData.image);
        //     } catch (error) {
        //         console.error("Image upload failed:", error.message);
        //         toast.error(`Image upload failed: ${error.message}`);
        //         return;
        //     }
        // }

        const productData = {
            name: formData.name,
            categoryId: formData.categoryId,
            trademarkId: formData.trademarkId,
            description: formData.description,
            sale: formData.sale,
            //     image: imageUrl || null,
        };

        try {
            const response = formData.id
                ? await ProductService.updateProduct(formData.id, productData)
                : await ProductService.createProduct(productData);
            toast.success("Product saved successfully");
            resetForm();
        } catch (error) {
            handleApiError(error);
        }
    };

    // const uploadImageToFirebase = async (file) => {
    //     const storageRef = ref(storage, `products/${file.name}`);
    //     const uploadTask = uploadBytesResumable(storageRef, file);
    //     return new Promise((resolve, reject) => {
    //         uploadTask.on(
    //             "state_changed",
    //             null,
    //             (error) => reject(error),
    //             async () => {
    //                 const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //                 resolve(downloadURL);
    //             }
    //         );
    //     });
    // };

    const handleApiError = (error) => {
        const errorMsg = error.response?.data?.message || error.message || "An error occurred.";
        toast.error(`Error: ${errorMsg}`);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            //          image: null,
            categoryId: "",
            trademarkId: "",
            description: "",
            sale: "",
        });
        setErrors({});
    };

    const handleEditClick = (product) => {
        setFormData({
            ...product,
            trademarkId: product.trademarkDTOResp?.id || "", // Lấy ID từ trademarkDTOResp
            categoryId: product.categoryDTOResp?.id || "",  // Lấy ID từ categoryDTOResp
        });
    };





    const setSelectedProduct = (product) => {
        console.log("Set selected product for detail view:", product);
    };

    const { columns, rows } = ProductTable({ onEditClick: handleEditClick, setSelectedProduct: setSelectedProduct });

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={5}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="s  pace-between" p={3}>
                            <ArgonTypography variant="h6">Manage Product</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox mx={7}>
                            <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
                                <ArgonBox>

                                    {/* <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                        <SelectImage image='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930' onImageChange={handleImageChange} />
                                    </ArgonBox> */}

                                    <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                        <ArgonInput
                                            type="text"
                                            placeholder={errors.name ? errors.name : "Product Name"}
                                            name="name"
                                            size="large"
                                            value={formData.name}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                borderColor: errors.name ? 'red' : 'Gainsboro',
                                                borderWidth: '0.5px',
                                                borderStyle: 'solid',
                                            }}
                                        />
                                    </ArgonBox>

                                    <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                        <ArgonInput
                                            placeholder={errors.description ? errors.description : "Sub description..."}
                                            multiline
                                            rows={5}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            sx={{
                                                borderColor: errors.description ? 'red' : 'Gainsboro',
                                                borderWidth: '0.5px',
                                                borderStyle: 'solid',
                                            }}
                                        />
                                    </ArgonBox>

                                    <ArgonBox
                                        display="flex"
                                        flexDirection="column"
                                        mt={3}
                                        mx={{ xs: 1, sm: 2, md: 3 }}
                                        p={2}
                                        border="1px solid #ccc"
                                        borderRadius="8px"
                                    >
                                        {/* Section Heading */}
                                        <ArgonBox mx={2} mb={3}>
                                            <Typography variant="h6" component="h2" fontWeight="bold">
                                                Properties
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Additional functions and attributes...
                                            </Typography>
                                        </ArgonBox>

                                        {/* Brand and Category Selectors */}
                                        <ArgonBox
                                            mb={3}
                                            display="flex"
                                            flexDirection={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={2} // added gap for better spacing
                                        >
                                            <ArgonSelect
                                                aria-label="Brand"
                                                name="trademarkId"
                                                onChange={handleChange}
                                                value={formData.trademarkId} // Hiển thị thương hiệu đã chọn
                                                options={[
                                                    { value: "", label: errors.trademarkId ? errors.trademarkId : "Brand" },
                                                    ...brands.map(brand => ({ value: brand.id, label: brand.name }))
                                                ]}
                                                style={{
                                                    height: "60px",
                                                    borderRadius: "10px",
                                                    borderColor: errors.trademarkId ? 'red' : 'Gainsboro',
                                                    borderWidth: '0.5px',
                                                    borderStyle: 'solid',
                                                    padding: '10px',
                                                    backgroundColor: 'white',
                                                    width: '100%',
                                                }}
                                            />

                                            <ArgonSelect
                                                aria-label="Category"
                                                name="categoryId"
                                                onChange={handleChange}
                                                value={formData.categoryId} // Hiển thị danh mục đã chọn
                                                options={[
                                                    { value: "", label: errors.categoryId ? errors.categoryId : "Category" },
                                                    ...categories.map(category => ({ value: category.id, label: category.name }))
                                                ]}
                                                style={{
                                                    height: "60px",
                                                    borderRadius: "10px",
                                                    borderColor: errors.categoryId ? 'red' : 'Gainsboro',
                                                    borderWidth: '0.5px',
                                                    borderStyle: 'solid',
                                                    padding: '10px',
                                                    backgroundColor: 'white',
                                                    width: '100%',
                                                }}
                                            />

                                        </ArgonBox>




                                    </ArgonBox>

                                    <ArgonBox
                                        display="flex"
                                        flexDirection="column"
                                        mt={3}
                                        mx={{ xs: 1, sm: 2, md: 3 }}
                                        p={2}
                                        mb={3}
                                        border={"1px solid #ccc"}
                                        borderRadius="8px"
                                    >
                                        {/* Pricing Section Heading */}
                                        <ArgonBox mx={2} mb={3}>
                                            <Typography variant="h6" component="h2" fontWeight="bold">
                                                Pricing
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Sale related inputs
                                            </Typography>
                                        </ArgonBox>

                                        {/* Sale Price Input */}
                                        <ArgonBox display="flex" flexDirection="column" gap={3}>
                                            <ArgonInput
                                                type="number"
                                                placeholder={errors.sale ? errors.sale : "Sale price"}
                                                name="sale"
                                                size="large"
                                                fullWidth
                                                value={formData.sale}
                                                inputProps={{ min: 0 }}
                                                onChange={handleChange}
                                                mb={{ xs: 2, sm: 0 }}
                                                sx={{
                                                    borderColor: errors.sale ? 'red' : 'Gainsboro',
                                                    borderWidth: '0.5px',
                                                    borderStyle: 'solid',
                                                }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <b style={{ fontSize: '25px' }}> $</b>
                                                    </InputAdornment>
                                                }
                                            />
                                        </ArgonBox>

                                    </ArgonBox>

                                    <ArgonBox mx={{ xs: 1, sm: 2, md: 3 }} mb={3} width={720}>
                                        <ArgonButton type="submit" size="large" color="info">
                                            {formData.id ? "Update" : "Save"}
                                        </ArgonButton>
                                    </ArgonBox>
                                </ArgonBox>
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox >

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
            </ArgonBox >

            <Footer />
        </DashboardLayout >
    );
}

export default Product;
