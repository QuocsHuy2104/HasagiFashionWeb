import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Form from "react-bootstrap/Form";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonSelect from '../../../components/ArgonSelect';
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import axios from "axios";
import ProductTable from "./data";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaCloudUploadAlt } from "react-icons/fa";
import { Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import MultipleSelectCheckmarks from "./selectTag"
import Footer from "../../../examples/Footer";
import ColorService from "../../../services/ColorServices";
import SizeService from "../../../services/SizeServices";
import BrandService from "../../../services/BrandServices";
import CategoriesService from "../../../services/CategoryServices";
import ProductService from "../../../services/ProductServices";


function Product() {

    const handleSize = (event) => {
        const { target: { value } } = event;
        setSizeName(value);
    };

    const handleColor = (event) => {
        const { target: { value } } = event;
        setColorName(value);
    };


    const [formData, setFormData] = useState({
        name: "",
        importPrice: "",
        image: null,
        categoryId: "",
        trademarkId: "",
        sizeId: "",
        colorId: "",
        description: "",
        subDescription: "",
        quantity: "0",
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);


    useEffect(() => {

        if (errors.description) {
            const editorElement = document.querySelector('.ck-editor__editable');
            if (editorElement) {
                editorElement.style.border = '1px solid red';
            }
        }

        const fetchData = async () => {
            try {
                const trademarkResponse = await BrandService.getAllBrands();
                setBrands(trademarkResponse.data);

                const categoryResponse = await CategoriesService.getAllCategories();
                setCategories(categoryResponse.data);

                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data)

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [errors.description]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateFields = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.importPrice || formData.importPrice <= 0) newErrors.importPrice = "Valid price is required";
        if (!formData.categoryId) newErrors.categoryId = "Category is required";
        if (!formData.trademarkId) newErrors.trademarkId = "Brand is required";
        if (!formData.sizeId) newErrors.sizeId = "Size is required";
        if (!formData.colorId) newErrors.colorId = "Color is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.importQuantity || formData.importQuantity <= 0) newErrors.importQuantity = "Valid quantity is required";
        if (selectedImageFiles.length === 0) {
            newErrors.images = "At least one image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const data = new FormData();
        data.append("name", formData.name);
        data.append("importPrice", formData.importPrice);
        data.append("categoryId", formData.categoryId);
        data.append("trademarkId", formData.trademarkId);
        data.append("sized", formData.sizeId);
        data.append("colorId", formData.colorId);
        data.append("description", formData.description);
        data.append("quantity", formData.quantity);

        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const response = formData.id
                ? await axios.put(`http://localhost:8080/api/product/${formData.id}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                : await axios.post("http://localhost:8080/api/product", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

            const result = response.data;
            if (formData.id) {
                setProducts(products.map(product => product.id === result.id ? result : product));
            } else {
                setProducts([...products, result]);
            }
            toast.success("Product saved successfully");

            resetForm();

        } catch (error) {
            toast.error(`Error: ${error.response ? error.response.data : error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            importPrice: "",
            image: null,
            categoryId: "",
            trademarkId: "",
            description: "",
            quantity: "0",
        });
        setErrors({});
    };

    const handleEditClick = (product) => {
        setFormData(product);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/product/${id}`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error("Error deleting product", error);
        }
    };

    const [images, setImages] = useState([]);
    const [selectedImageFiles, setSelectedImageFiles] = useState([]);
    const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        if (selectedImageFiles.length > 0) {
            const previews = selectedImageFiles.map(file => URL.createObjectURL(file));
            setSelectedImagePreviews(previews);
        } else {
            setSelectedImagePreviews([]);
        }

        return () => {
            selectedImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [selectedImageFiles]);

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            ColorService.getAllColors(),
            SizeService.getAllSizes()
        ])
            .then(([colorRes, sizeRes]) => {
                if (isMounted) {
                    setColors(colorRes.data);
                    setSizes(sizeRes.data);
                }
            })
            .catch(err => console.error('Error fetching data:', err));

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/image");
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images", error);
        }
    };

    const handleFileSelect = (e) => {
        setSelectedImageFiles(Array.from(e.target.files));
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedFiles = selectedImageFiles.filter((_, index) => index !== indexToRemove);
        setSelectedImageFiles(updatedFiles);

        const updatedPreviews = selectedImagePreviews.filter((_, index) => index !== indexToRemove);
        setSelectedImagePreviews(updatedPreviews);
    };

    const handleRemoveAllImages = () => {
        setSelectedImageFiles([]);
        setSelectedImagePreviews([]);
    };

    const { columns, rows } = ProductTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

    const hanleSelectSize = newSelected => setSelectedSize(newSelected);
    const handleSelectColor = newSelect => setSelectedColor(newSelect);


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={5}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Manage Product</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox mx={7}>
                            <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
                                <ArgonBox>
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
                                        <ArgonInput placeholder="Sub description..." multiline rows={5} />
                                    </ArgonBox>

                                    <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                        <div className="custom-editor" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc', padding: '8px' }}>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={formData.description}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setFormData(prevFormData => ({
                                                        ...prevFormData,
                                                        description: data
                                                    }));
                                                }}
                                                config={{
                                                    placeholder: errors.description || "Description",
                                                }}
                                                onReady={(editor) => {
                                                    const editorElement = editor.ui.view.editable.element;
                                                    editorElement.setAttribute('style', 'min-height: 300px');
                                                }}
                                            />
                                        </div>
                                    </ArgonBox>

                                    <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }} >
                                        <Form.Group controlId="formFile">
                                            <ArgonBox
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                mt={3}
                                                p={2}
                                                border={selectedImagePreviews.length > 0 ? "1px dashed #ccc" : (errors.images ? "1px dashed red" : "1px dashed #ccc")} // Cập nhật điều kiện viền
                                                borderRadius="8px"
                                            >
                                                <ArgonBox alignSelf="flex-start" mt={-1} mb={1}>
                                                    <ArgonTypography variant="h6">Images</ArgonTypography>
                                                </ArgonBox>
                                                <ArgonBox style={{ textAlign: 'center', marginBottom: '16px', backgroundColor: 'aliceblue', borderRadius: '10px', padding: '100px', paddingTop: '80px', paddingBottom: '40px', paddingLeft: '220px', paddingRight: '220px' }}>
                                                    <Image src="https://www.pinclipart.com/picdir/big/206-2061237_a-gallery-icon-png-circle-clipart.png" style={{ width: '120px', marginBottom: '16px' }} />
                                                    <Typography variant="h6">Drop or select files</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Drop files here or click to <button
                                                            type="button"
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#007bff',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                padding: '0',
                                                                margin: '0.1px',
                                                            }}
                                                            onClick={() => document.getElementById('fileInput').click()}
                                                        >
                                                            browse
                                                        </button> through your machine.
                                                        <input
                                                            id="fileInput"
                                                            type="file"
                                                            name="images"
                                                            hidden
                                                            multiple
                                                            onChange={handleFileSelect}
                                                        />
                                                    </Typography>
                                                </ArgonBox>

                                                <ArgonBox display="flex" alignItems="center" flexWrap="wrap" justifyContent="center" mt={2}>
                                                    {images
                                                        .filter(image => image.productDetailId === productDetailId)
                                                        .map(image => (
                                                            <ArgonBox key={image.id} mt={0.1} mx={0.5} display="inline-block" position="relative">
                                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                    <Image
                                                                        src={image.url}
                                                                        alt="Image"
                                                                        style={{
                                                                            objectFit: "cover",
                                                                            borderRadius: '8px',
                                                                            width: "75px",
                                                                            height: "75px",
                                                                            transition: 'transform 0.3s ease',
                                                                        }}
                                                                    />
                                                                    <div style={{
                                                                        position: 'absolute',
                                                                        top: '-8px',
                                                                        right: '-8px',
                                                                        backgroundColor: '#ff4d4d',
                                                                        borderRadius: '50%',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        cursor: 'pointer',
                                                                        color: '#fff',
                                                                        fontSize: '12px',
                                                                    }}
                                                                        onClick={() => handleDeleteImage(image.id)}>
                                                                        &times;
                                                                    </div>
                                                                </div>
                                                            </ArgonBox>
                                                        ))}
                                                </ArgonBox>


                                                {!selectedImagePreviews.length && errors.images && (
                                                    <ArgonBox style={{ textAlign: 'center', marginBottom: '16px', backgroundColor: 'khaki', borderRadius: '3px', padding: '10px' }}>
                                                        <Typography variant="body2" style={{ color: 'red', marginTop: '5px', fontSize: '20px' }}>
                                                            {errors.images}
                                                        </Typography>
                                                    </ArgonBox>
                                                )}

                                                <ArgonBox display="flex" justifyContent="flex-start" flexWrap="wrap" width="100%" mt={2} mr={-5}>
                                                    {selectedImagePreviews.map((preview, index) => (
                                                        <ArgonBox key={index} mb={1} mx={1} position="relative">
                                                            <img src={preview} alt="Selected" style={{
                                                                objectFit: "cover",
                                                                borderRadius: '5px',
                                                                width: "100px",
                                                                height: "100px",
                                                                transition: 'transform 0.3s ease',
                                                            }} />
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '-5px',
                                                                    right: '-8px',
                                                                    backgroundColor: 'gray',
                                                                    borderRadius: '50%',
                                                                    width: '15px',
                                                                    height: '15px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer',
                                                                    color: '#fff',
                                                                    fontSize: '12px',
                                                                    transition: 'background-color 0.3s ease',
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'black')}
                                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'gray')}
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                &times;
                                                            </div>
                                                        </ArgonBox>
                                                    ))}
                                                </ArgonBox>

                                                <ArgonBox mt={1} >
                                                    <ArgonButton variant="text" color="secondary" onClick={handleRemoveAllImages} sx={{
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        fontSize: '16px',
                                                        marginRight: '5px',
                                                        fontWeight: 'bold',
                                                        textTransform: 'none',
                                                        border: '1px solid #d1d1d1',
                                                        '&:hover': {
                                                            backgroundColor: '#f0f0f0',
                                                            color: '#000',
                                                        },
                                                    }}>Remove all</ArgonButton>
                                                    <ArgonButton
                                                        variant="text"
                                                        color='dark'
                                                        sx={{
                                                            color: 'white',
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                            textTransform: 'none',
                                                            border: '1px solid #d1d1d1'
                                                        }}>
                                                        <FaCloudUploadAlt />_Upload
                                                    </ArgonButton>
                                                </ArgonBox>
                                            </ArgonBox>
                                        </Form.Group>
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
                                            {/* Brand Selector */}
                                            <ArgonBox width="100%" maxWidth={{ xs: '100%', sm: '48%' }}>
                                                <ArgonSelect
                                                    aria-label="Brand"
                                                    name="trademarkId"
                                                    onChange={handleChange}
                                                    value={formData.trademarkId}
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
                                                        width: '100%',  // Ensure full width
                                                    }}
                                                />
                                            </ArgonBox>

                                            {/* Category Selector */}
                                            <ArgonBox width="100%" maxWidth={{ xs: '100%', sm: '48%' }}>
                                                <ArgonSelect
                                                    aria-label="Category"
                                                    name="categoryId"
                                                    onChange={handleChange}
                                                    value={formData.categoryId}
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
                                                        width: '100%',  // Ensure full width
                                                    }}
                                                />
                                            </ArgonBox>
                                        </ArgonBox>

                                        {/* Size and Color Selectors */}
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

                                        {/* Quantity Input */}
                                        <ArgonBox>
                                            <ArgonInput
                                                type="number"
                                                placeholder={errors.importQuantity ? errors.importQuantity : "Quantity"}
                                                name="importQuantity"
                                                size="large"
                                                fullWidth
                                                value={formData.importQuantity}
                                                onChange={handleChange}
                                                inputProps={{ min: 0 }}
                                                sx={{
                                                    borderColor: errors.importQuantity ? 'red' : 'Gainsboro',
                                                    borderWidth: '0.5px',
                                                    borderStyle: 'solid',
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
                                                Price related inputs
                                            </Typography>
                                        </ArgonBox>

                                        {/* Regular Price Input */}
                                        <ArgonBox
                                            display="flex"
                                            flexDirection="column"
                                            gap={3}
                                            mb={2}
                                        >
                                            <ArgonInput
                                                type="number"
                                                placeholder={errors.importPrice ? errors.importPrice : "Regular price"}
                                                name="importPrice"
                                                size="large"
                                                inputProps={{ min: 0 }}
                                                value={formData.importPrice}
                                                onChange={handleChange}
                                                sx={{
                                                    borderColor: errors.importQuantity ? 'red' : 'Gainsboro',
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

                                        {/* Sale Price Input */}
                                        <ArgonBox
                                            display="flex"
                                            flexDirection="column"
                                            gap={3}
                                        >
                                            <ArgonInput
                                                type="number"
                                                placeholder="Sale price"
                                                name="salePrice"
                                                size="large"
                                                fullWidth
                                                inputProps={{ min: 0 }}
                                                onChange={handleChange}
                                                mb={{ xs: 2, sm: 0 }}
                                                sx={{
                                                    borderColor: 'Gainsboro',
                                                    borderWidth: '0.5px',
                                                    borderStyle: 'solid',
                                                }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <b style={{ fontSize: '25px' }} > $</b>
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
