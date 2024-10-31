import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import MultipleSelectCheckmarks from "./selectTag"
import ArgonTypography from "components/ArgonTypography";
import ColorService from "services/ColorServices";
import SizeService from "services/SizeServices";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import { InputAdornment } from "@mui/material";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DataGridDemo from './data';
import ProductDetailService from "services/ProductDetailServices";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function ProductDetail() {

    const location = useLocation();
    const product = location.state?.product;

    const [productDetails, setProductDetails] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);

    const hanleSelectSize = (newSelected) => setSelectedSize(newSelected);
    const handleSelectColor = newSelect => setSelectedColor(newSelect);

    const [formData, setFormData] = useState({
        id: '',
        quantity: '',
        price: '',
        priceSize: '',
        subDescription: '',
        sizeId: [],
        colorId: [],
        productId: product.id
    });

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            ColorService.getAllColors(),
            SizeService.getAllSizes(),
            ProductDetailService.getAllByProductId(product.id)
        ])
            .then(([colorRes, sizeRes, detailRes]) => {
                if (isMounted) {
                    setColors(colorRes.data);
                    setSizes(sizeRes.data);
                    setProductDetails(detailRes.data);
                }
            })
            .catch(err => console.error('Error fetching data:', err));
        return () => {
            isMounted = false;
        };
    }, []);

    const validateFields = () => {
        const newErrors = {};

        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
        }

        if (!formData.priceSize || isNaN(formData.priceSize) || parseFloat(formData.priceSize) <= 0) {
            newErrors.priceSize = "Valid price size is required";
        }

        if (!formData.sizeId) {
            newErrors.sizeId = "Size is required";
        }

        if (!formData.colorId) {
            newErrors.colorId = "Color is required";
        }

        if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
            newErrors.quantity = "Valid quantity is required";
        }

        if (!formData.subDescription || !formData.subDescription.trim()) {
            newErrors.subDescription = "Sub-description is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateFields()) return;
    
        // Log form data before sending
        console.log("Form Data before sending:", formData);
    
        try {
            // Prepare the data to be sent
            const data = {
                quantity: formData.quantity,
                price: formData.price,
                subDescription: formData.subDescription,
                sizeId: selectedSize, // Use selectedSize directly
                colorId: selectedColor, // Use selectedColor directly
                productId: product.id,
                priceSize: formData.priceSize,
            };
    
            console.log("Data to send:", data);
    
            // Send the data to the backend
            const response = formData.id
                ? await ProductDetailService.updateDetail(formData.id, data)
                : await ProductDetailService.createDetail(data);
    
            if (response.status !== 200) {
                console.error("Failed to save product details");
            } else {
                console.log("Product details saved successfully");
            }
        } catch (e) {
            console.error("Error saving product details:", e);
        }
    };
    
    

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Product Details</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox p={3}>
                            {product ? (
                                <div>
                                    <h2>{product.name}</h2>
                                    <p>Price: {product.importPrice} VNĐ</p>
                                    <p>Quantity: {product.importQuantity}</p>
                                    <p>Category: {product.categoryDTOResp.name}</p>
                                    <p>Brand: {product.trademarkDTOResp.name}</p>
                                </div>
                            ) : (
                                <p>No product data available.</p>
                            )}
                        </ArgonBox>

                        <ArgonBox mx={7}>
                            <ArgonBox component="form" role="form" onSubmit={handleSubmit}>

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
                                    <ArgonBox mx={2} mb={3}>
                                        <Typography variant="h6" component="h2" fontWeight="bold">
                                            Pricing
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Sale related inputs
                                        </Typography>
                                    </ArgonBox>

                                    {/* Quantity Input */}
                                    <ArgonBox mb={3}>
                                        <ArgonInput
                                            type="number"
                                            placeholder={errors.quantity ? errors.quantity : "Quantity"}
                                            name="quantity"
                                            size="large"
                                            fullWidth
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            inputProps={{ min: 0 }}
                                            sx={{
                                                borderColor: errors.quantity ? 'red' : 'Gainsboro',
                                                borderWidth: '0.5px',
                                                borderStyle: 'solid',
                                                width: '100%',
                                            }}
                                        />
                                    </ArgonBox>


                                    <ArgonBox display="flex" flexDirection="column" gap={3} mb={3}>
                                        <ArgonInput
                                            type="number"
                                            placeholder={errors.price ? errors.price : "Purchase price"}
                                            name="price"
                                            size="large"
                                            fullWidth
                                            value={formData.price}
                                            inputProps={{ min: 0 }}
                                            onChange={handleChange}
                                            mb={{ xs: 2, sm: 0 }}
                                            sx={{
                                                borderColor: errors.price ? 'red' : 'Gainsboro',
                                                borderWidth: '0.5px',
                                                borderStyle: 'solid',
                                            }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <b style={{ fontSize: '25px' }}>$</b>
                                                </InputAdornment>
                                            }
                                        />
                                    </ArgonBox>

                                    <ArgonBox display="flex" flexDirection="column" gap={3} mb={3}>
                                        <ArgonInput
                                            type="number"
                                            placeholder={errors.priceSize ? errors.priceSize : "Purchase price"}
                                            name="priceSize"
                                            size="large"
                                            fullWidth
                                            value={formData.priceSize}
                                            inputProps={{ min: 0 }}
                                            onChange={handleChange}
                                            mb={{ xs: 2, sm: 0 }}
                                            sx={{
                                                borderColor: errors.priceSize ? 'red' : 'Gainsboro',
                                                borderWidth: '0.5px',
                                                borderStyle: 'solid',
                                            }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <b style={{ fontSize: '25px' }}>$</b>
                                                </InputAdornment>
                                            }
                                        />
                                    </ArgonBox>

                                </ArgonBox>

                                <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                    <div className="custom-editor" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc', padding: '8px' }}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={formData.subDescription}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setFormData(prevFormData => ({
                                                    ...prevFormData,
                                                    subDescription: data
                                                }));
                                            }}
                                            config={{
                                                placeholder: errors.subDescription || "Description",
                                            }}
                                            onReady={(editor) => {
                                                const editorElement = editor.ui.view.editable.element;
                                                editorElement.setAttribute('style', 'min-height: 300px');
                                            }}
                                        />
                                    </div>
                                </ArgonBox>

                                <ArgonBox
                                    mb={3}
                                    display="flex"
                                    flexDirection={{ xs: 'column', sm: 'row' }}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    gap={2}
                                >
                                    {/* Size Selector */}
                                    <ArgonBox width="100%" maxWidth={{ xs: '100%', sm: '48%' }}>
                                        <MultipleSelectCheckmarks
                                            model={sizes}
                                            nameTag={'Select Size'}
                                            onChange={hanleSelectSize}
                                            selectedModel={selectedSize}
                                        />
                                    </ArgonBox>

                                    {/* Color Selector */}
                                    <ArgonBox width="100%" maxWidth={{ xs: '100%', sm: '48%' }}>
                                        <MultipleSelectCheckmarks
                                            model={colors}
                                            nameTag={'Select Color'}
                                            onChange={handleSelectColor}
                                            selectedModel={selectedColor}
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


                    </Card>
                </ArgonBox>

                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox>
                            {productDetails.length > 0 ? (
                                <DataGridDemo items={productDetails} />
                            ) : (
                                <ArgonBox
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    flexDirection="column"
                                    sx={{
                                        padding: "80px 24px",
                                        borderRadius: "16px",
                                        backgroundColor: "light",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        sx={{ height: 180, width: 180 }}
                                        alt="Empty icon"
                                        src="https://assets.minimals.cc/public/assets/icons/empty/ic-content.svg"
                                    />
                                    <ArgonTypography variant="h6" fontWeight="medium" color="secondary">
                                        No Data
                                    </ArgonTypography>
                                </ArgonBox>
                            )}
                        </ArgonBox>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>
    );
}

export default ProductDetail;
