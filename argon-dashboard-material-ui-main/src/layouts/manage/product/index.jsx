
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
import { PhotoCamera, Videocam } from "@mui/icons-material";
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';


function Product() {

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        trademarkId: '',
        categoryId: '',
        image: null,
        video: null,
        sale: 0,
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trademarkResponse = await BrandService.getAllBrands();
                setBrands(trademarkResponse.data);

                const categoryResponse = await CategoriesService.getAllCategories();
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file instanceof Blob) {
            setFormData((prevData) => ({
                ...prevData,
                image: file,  // Cập nhật ảnh mới
            }));
        } else {
            console.error("Invalid image file");
        }
    };

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if (file && file instanceof Blob) {
            setFormData((prevData) => ({
                ...prevData,
                video: file,  // Cập nhật video mới
            }));
        } else {
            console.error("Invalid video file");
        }
    };


    const handleRemoveImage = () => {
        setFormData((prevData) => ({
            ...prevData,
            image: null,
        }));
    };

    const resetVideoInput = () => {
        setFormData((prevState) => ({
            ...prevState,
            video: null,
        }));
        const inputFile = document.getElementById('video-upload');
        inputFile.value = '';
    };


    const validateFields = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.trademarkId) newErrors.trademarkId = 'Brand is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        let imageUrl = formData.imageUrl || null;
        let videoUrl = formData.videoUrl || null;

        try {
            if (formData.image) {
                const imageFile = formData.image;
                const imageStorageRef = ref(storage, `productFiles/${imageFile.name}`);
                const imageUploadTask = uploadBytesResumable(imageStorageRef, imageFile);

                imageUrl = await new Promise((resolve, reject) => {
                    imageUploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            console.log(
                                `Image upload progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
                            );
                        },
                        (error) => {
                            console.error('Error uploading image:', error);
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(imageUploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                });
            }

            if (formData.video) {
                const videoFile = formData.video;
                const videoStorageRef = ref(storage, `productFiles/${videoFile.name}`);
                const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);

                videoUrl = await new Promise((resolve, reject) => {
                    videoUploadTask.on(
                        'state_changed',
                        (snapshot) => {

                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Video upload progress: ${progress}%`);
                        },
                        (error) => {
                            console.error('Error uploading video:', error);
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(videoUploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                });
            }

            const productData = {
                name: formData.name,
                categoryId: formData.categoryId,
                trademarkId: formData.trademarkId,
                description: formData.description,
                sale: formData.sale,
                image: imageUrl,
                video: videoUrl,  
            };

            const response = formData.id
                ? await ProductService.updateProduct(formData.id, productData)
                : await ProductService.createProduct(productData);

            toast.success('Product saved successfully');
            resetForm();
        } catch (error) {
            handleApiError(error);
        }
    };


    const handleApiError = (error) => {
        const errorMsg = error.response?.data?.message || error.message || 'An error occurred.';
        toast.error(`Error: ${errorMsg}`);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            image: null,
            categoryId: '',
            trademarkId: '',
            description: '',
            sale: '',
        });
        setErrors({});
    };

    const handleEditClick = (product) => {
        setFormData({
            ...product,
            trademarkId: product.trademarkDTOResp?.id || '',
            categoryId: product.categoryDTOResp?.id || '',
            image: product.image || null,
            video: product.video || null,
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
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
                            <ArgonTypography variant="h6">Quản lý sản phẩm</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox mx={7}>
                            <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
                                <ArgonBox>

                                    <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }} display="flex" gap={2}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                            <div style={{ marginRight: '5px' }}>
                                                {!formData.image ? (
                                                    <>
                                                        <input
                                                            type="file"
                                                            id="image-upload"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={handleImageChange}
                                                        />
                                                        <ArgonButton
                                                            variant="outlined"
                                                            component="span"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: '1px solid #000',
                                                                padding: '0',
                                                                width: '200px',
                                                                height: '200px',
                                                                borderRadius: '8px',
                                                            }}
                                                            onClick={() => document.getElementById('image-upload').click()}
                                                        >
                                                            <PhotoCamera style={{ fontSize: '48px', color: 'black' }} />
                                                        </ArgonButton>
                                                    </>
                                                ) : (
                                                    <div style={{ position: 'relative' }}>
                                                        {formData.image && (
                                                            <img
                                                                src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image} // Check if it's a file or URL
                                                                alt="Selected Image"
                                                                style={{
                                                                    width: '200px',
                                                                    height: '200px',
                                                                    borderRadius: '8px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        )}
                                                        <IconButton
                                                            style={{
                                                                position: 'absolute',
                                                                top: '2px',
                                                                right: '5px',
                                                                padding: '0',
                                                                color: '#fff',
                                                                fontSize: '15px',
                                                                backgroundColor: '#B8B8B8',
                                                            }}
                                                            onClick={handleRemoveImage}
                                                        >
                                                            <CloseIcon style={{ fontSize: '16px' }} />
                                                        </IconButton>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        <div style={{ marginLeft: '1px' }}>
                                            <input
                                                type="file"
                                                id="video-upload"
                                                accept="video/*"
                                                style={{ display: 'none' }}
                                                onChange={handleVideoChange}
                                            />
                                            {formData.video ? (
                                                <div style={{ position: 'relative' }}>
                                                    {formData.video && (
                                                        <video
                                                            controls
                                                            src={formData.video instanceof File ? URL.createObjectURL(formData.video) : formData.video} // Check if it's a file or URL
                                                            style={{
                                                                width: '200px',
                                                                height: '200px',
                                                                borderRadius: '8px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    )}
                                                    <IconButton
                                                        style={{
                                                            position: 'absolute',
                                                            top: '2px',
                                                            right: '2px',
                                                            padding: '0',
                                                            color: '#fff',
                                                            fontSize: '15px',
                                                            backgroundColor: '#B8B8B8',
                                                        }}
                                                        onClick={resetVideoInput}
                                                    >
                                                        <CloseIcon style={{ fontSize: '16px' }} />
                                                    </IconButton>
                                                </div>
                                            ) : (
                                                <ArgonButton
                                                    variant="outlined"
                                                    component="span"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '1px solid #000',
                                                        padding: '0',
                                                        width: '200px',
                                                        height: '200px',
                                                        borderRadius: '8px',
                                                    }}
                                                    onClick={() => document.getElementById('video-upload').click()}
                                                >
                                                    <Videocam style={{ fontSize: '48px', color: 'black' }} />
                                                </ArgonButton>
                                            )}
                                        </div>
                                    </ArgonBox>

                                    <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                        <ArgonInput
                                            type="text"
                                            placeholder={errors.name ? errors.name : "Tên sản phẩm"}
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
                                            placeholder={errors.description ? errors.description : "Mô tả..."}
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
                                        <ArgonBox mx={0} mb={3}>
                                            <Typography variant="h6" component="h2" fontWeight="bold">
                                                Chi tiết
                                            </Typography>
                                        </ArgonBox>


                                        <ArgonBox
                                            mb={3}
                                            display="flex"
                                            flexDirection={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={2}
                                        >
                                            <ArgonSelect
                                                aria-label="Brand"
                                                name="trademarkId"
                                                onChange={handleChange}
                                                value={formData.trademarkId} // Hiển thị thương hiệu đã chọn
                                                options={[
                                                    { value: "", label: errors.trademarkId ? errors.trademarkId : "Thương hiệu" },
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
                                                    { value: "", label: errors.categoryId ? errors.categoryId : "Danh mục" },
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
                                        <ArgonBox mx={0} mb={3}>
                                            <Typography variant="h6" component="h2" fontWeight="bold">
                                                Khuyến mãi
                                            </Typography>
                                        </ArgonBox>

                                        {/* Sale Price Input */}
                                        <ArgonBox display="flex" flexDirection="column" gap={3}>
                                            <ArgonInput
                                                type="number"
                                                placeholder={errors.sale ? errors.sale : "Giảm giá"}
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
                                            {formData.id ? "Cập nhật" : "Lưu"}
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