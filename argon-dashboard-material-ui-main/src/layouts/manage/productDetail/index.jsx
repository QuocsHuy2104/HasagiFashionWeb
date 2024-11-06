


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import MultipleSelectCheckmarks from "./selectTag";
import ArgonTypography from "components/ArgonTypography";
import ColorService from "services/ColorServices";
import SizeService from "services/SizeServices";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ProductDetailService from "services/ProductDetailServices";
import Typography from "@mui/material/Typography";
import { InputAdornment } from "@mui/material";
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Data from './data';
import Box from "@mui/material/Box";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// toast.warn("Thêm thành công");
// toast.error("Có lỗi xảy ra khi xử lý thanh toán VNPAY.");
// toast.success(`Áp dụng mã giảm giá ${voucher.code} thành công!`);

function ProductDetail() {
    const location = useLocation();
    const product = location.state?.product;
    const [productDetails, setProductDetails] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [visibleQuantities, setVisibleQuantities] = useState({});
    const [formData, setFormData] = useState({
        id: '',
        quantity: {},
        price: '',
        priceSize: {},
        description: '',
        sizeId: [],
        colorId: [],
        productId: product ? product.id : null,

    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Current product ID:', product ? product.id : 'No product selected');

                const [colorRes, sizeRes, detailRes] = await Promise.all([
                    ColorService.getAllColors(),
                    SizeService.getAllSizes(),
                    product ? ProductDetailService.getAllByProductId(product.id) : Promise.resolve([]),
                ]);

                console.log('Detail response:', detailRes); // Kiểm tra phản hồi chi tiết

                setColors(colorRes.data);
                setSizes(sizeRes.data);

                // Kiểm tra cấu trúc của detailRes
                if (detailRes && Array.isArray(detailRes)) {
                    setProductDetails(detailRes); // Gán trực tiếp nếu detailRes không có thuộc tính data
                } else {
                    console.warn('Detail response does not contain valid data:', detailRes);
                    setProductDetails([]);
                }

                console.log('Fetched product details:', detailRes);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [product]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectSize = (selectedIds) => {
        setSelectedSize(selectedIds);
        setFormData((prevFormData) => ({
            ...prevFormData,
            sizeId: selectedIds,
            priceSize: selectedIds.reduce((acc, sizeId) => {
                acc[sizeId] = prevFormData.priceSize[sizeId] || 0;
                return acc;
            }, {})
        }));
    };

    const handlePriceChange = (e, sizeId) => {
        const value = e.target.value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            priceSize: {
                ...prevFormData.priceSize,
                [sizeId]: Number(value),
            },
        }));

        const size = sizes.find(s => s.id === sizeId);
        console.log("Selected Size:", size?.name);
    };

    // Hàm để xử lý ẩn input
    const handleRemoveInput = (sizeId, colorId) => {
        setVisibleQuantities(prevState => ({
            ...prevState,
            [`${sizeId}-${colorId}`]: false,
        }));

        // Đặt giá trị của input thành 0 khi input bị ẩn
        setFormData(prevState => ({
            ...prevState,
            quantity: {
                ...prevState.quantity,
                [`${sizeId}-${colorId}`]: 0,
            },
        }));
    };


    // Cập nhật hàm handleQuantityChange
    const handleQuantityChange = (sizeId, colorId, value) => {
        const quantityValue = Math.max(0, Number(value) || 0);

        setFormData(prevState => ({
            ...prevState,
            quantity: {
                ...prevState.quantity,
                [`${sizeId}-${colorId}`]: quantityValue,
            },
        }));

        const size = sizes.find(s => s.id === sizeId);
        const color = colors.find(c => c.id === colorId);
        console.log("Selected Size:", size?.name, "Selected Color:", color?.name, "Quantity:", quantityValue);
    };


    const resetVisibleQuantities = () => {
        const initialVisibility = {};
        selectedSize.forEach(sizeId => {
            selectedColor.forEach(colorId => {
                initialVisibility[`${sizeId}-${colorId}`] = true;
            });
        });
        setVisibleQuantities(initialVisibility);
    };



    const handleSelectColor = (selectedIds) => {
        setSelectedColor(selectedIds);
        setFormData((prevFormData) => ({
            ...prevFormData,
            colorId: selectedIds,
        }));
    };

    const resetForm = () => {
        setFormData({
            id: '',
            quantity: '',
            price: '',
            priceSize: '',
            description: '',
            sizeId: '',
            colorId: '',
            productId: product ? product.id : null,
        });
        setSelectedSize([]);
        setSelectedColor([]);
        toast.success("Làm mới thành công!");
    };

    const validateForm = () => {
        let isValid = true;

        if (!formData.price) {
            toast.error('Bạn chưa nhập giá gốc.');
            isValid = false;
        }

        if (!formData.quantity) {
            toast.error('Bạn chưa nhập số lượng.');
            isValid = false;
        }

        if (!formData.priceSize) {
            toast.error('Bạn chưa nhập kích thước giá.');
            isValid = false;
        }

        if (!formData.description) {
            toast.error('Bạn chưa nhập mô tả.');
            isValid = false;
        }

        if (selectedSize.length === 0) {
            toast.error('Bạn chưa chọn size.');
            isValid = false;
        }

        if (selectedColor.length === 0) {
            toast.error('Bạn chưa chọn màu sắc.');
            isValid = false;
        }

        return isValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const sizeColorRequests = [];
        selectedSize.forEach(sizeId => {
            selectedColor.forEach(colorId => {
                const quantity = formData.quantity[`${sizeId}-${colorId}`] || 0;
                if (quantity > 0) {
                    sizeColorRequests.push({
                        sizeId,
                        colorId,
                        quantity
                    });
                }
            });
        });

        const data = {
            price: Number(formData.price),
            priceSizes: selectedSize.map(size => formData.priceSize[size]),
            description: formData.description || null,
            productId: product ? product.id : null,
            sizeId: selectedSize,
            colorId: selectedColor,
            sizeColorRequests,
        };

        console.log("Submitting data:", data);
        resetVisibleQuantities();
        try {
            const response = formData.id
                ? await ProductDetailService.updateDetail(formData.id, data)
                : await ProductDetailService.createDetail(data);

            const updatedDetails = await ProductDetailService.getAllByProductId(product.id);
            setProductDetails(updatedDetails.data);
            resetForm();
        } catch (e) {
            setErrors({ submit: "There was an error saving the product details." });
            console.error("API responded with an error:", e.response?.data || e);
            toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
        }
    };


    const handleEditClick = (productDetail) => {
        // Kiểm tra nếu productDetail không phải là null
        if (productDetail) {
            setFormData({
                id: productDetail.id || '',
                quantity: productDetail.quantity || 0,
                price: productDetail.price || '',
                priceSize: productDetail.priceSize || {},
                description: productDetail.description || '',
                sizeId: productDetail.sizeId || [],
                colorId: productDetail.colorId || [],
            });
        } else {
            // Nếu productDetail là null, có thể bạn muốn thiết lập giá trị mặc định cho formData
            setFormData({
                id: '',
                quantity: 0,
                price: '',
                priceSize: {},
                description: '',
                sizeId: [],
                colorId: [],
            });
        }
    };



    return (

        <DashboardLayout>
            <ToastContainer />
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Chi tiết sản phẩm</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox p={3}>
                            {product ? (
                                <div>
                                    <h2>{product.name}</h2>
                                    <p>Giá: {product.importPrice} VNĐ</p>
                                    <p>Số lượng: {product.importQuantity}</p>
                                    <p>Danh mục: {product.categoryDTOResp.name}</p>
                                    <p>Thương hiệu: {product.trademarkDTOResp.name}</p>
                                </div>
                            ) : (
                                <p>Không tìm thấy sản phẩm</p>
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



                                    <ArgonBox display="flex" flexDirection="column" gap={3} mb={3}>
                                        <ArgonInput
                                            type="number"
                                            placeholder={errors.price ? `⚠️ ${errors.price}` : "Mức giá"}
                                            name="price"
                                            size="large"
                                            fullWidth
                                            value={formData.price}
                                            inputProps={{ min: 0 }}
                                            onChange={handleChange}
                                            sx={{
                                                borderColor: errors.price ? 'red' : 'Gainsboro',
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                '& .Mui-focused': {
                                                    borderColor: errors.price ? 'red' : 'blue',
                                                },
                                            }}
                                        />
                                    </ArgonBox>
                                    <ArgonBox
                                        mb={3}
                                        display="flex"
                                        flexDirection={{ xs: 'column', sm: 'row' }}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        <ArgonBox
                                            width="100%"
                                            maxWidth={{ xs: '100%', sm: '49%' }}
                                            borderRadius={4}
                                            border={"1px solid #ccc"}
                                            bgcolor="background.default"
                                            p={2}
                                        >
                                            <ArgonTypography variant="h6" mb={1}>
                                                Chọn kích cỡ
                                            </ArgonTypography>
                                            <MultipleSelectCheckmarks
                                                model={sizes}
                                                onChange={handleSelectSize}
                                                selectedModel={selectedSize}
                                                variant="outlined"
                                            />
                                            {errors.sizeId && <span style={{ color: 'red' }}>{errors.sizeId}</span>}
                                        </ArgonBox>

                                        <ArgonBox
                                            width="100%"
                                            maxWidth={{ xs: '100%', sm: '49%' }}
                                            borderRadius={4}
                                            border={"1px solid #ccc"}
                                            bgcolor="background.default"
                                            p={2}
                                        >
                                            <ArgonTypography variant="h6" mb={1}>
                                                Chọn màu
                                            </ArgonTypography>
                                            <MultipleSelectCheckmarks
                                                model={colors}
                                                onChange={handleSelectColor}
                                                selectedModel={selectedColor}
                                                variant="outlined"
                                            />
                                            {errors.colorId && <span style={{ color: 'red' }}>{errors.colorId}</span>}
                                        </ArgonBox>
                                    </ArgonBox>



                                    {/* test */}
                                    <ArgonBox
                                        width="100%"
                                        maxWidth={{ xs: '100%', sm: '100%' }}
                                        borderRadius={4}
                                        border={"1px solid #ccc"}
                                        bgcolor="background.default"
                                        p={2}
                                        mb={3}
                                    >
                                        <ArgonTypography variant="h6" mb={1} fontWeight={100}>
                                            Nhập giá kích cỡ
                                        </ArgonTypography>
                                        <Grid container spacing={2}>
                                            {selectedSize.map((sizeId) => {
                                                const size = sizes.find(s => s.id === sizeId); // Tìm tên của kích thước
                                                return (
                                                    <Grid item xs={2} key={sizeId}>
                                                        <ArgonInput
                                                            type="number"
                                                            placeholder={errors.priceSize ? errors.priceSize : `Nhập giá kích thước`}
                                                            name={`priceSize-${sizeId}`}
                                                            size="large"
                                                            sx={{
                                                                width: '100%',
                                                                borderColor: errors.priceSize ? 'red' : 'Gainsboro',
                                                                borderWidth: '1px',
                                                                borderStyle: 'solid',
                                                                borderRadius: '4px',
                                                                transition: 'border-color 0.3s',
                                                                '&:focus': {
                                                                    borderColor: 'blue',
                                                                },
                                                            }}
                                                            value={formData.priceSize[sizeId] || ""}
                                                            inputProps={{ min: 0 }}
                                                            onChange={(e) => handlePriceChange(e, sizeId)}
                                                            mb={2}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <b style={{ fontSize: '16px', color: '#333' }}>{size ? size.name : ''}</b>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </ArgonBox>

                                    <ArgonBox
                                        width="100%"
                                        maxWidth={{ xs: '100%', sm: '100%' }}
                                        borderRadius={4}
                                        border={"1px solid #ccc"}
                                        bgcolor="background.default"
                                        p={2}
                                    >
                                        <ArgonTypography variant="h6" mb={1} fontWeight={100}>
                                            Nhập số lượng từng sản phẩm theo cặp size, color đã chọn
                                        </ArgonTypography>
                                        <Grid container spacing={2}>
                                            {selectedSize.map(sizeId => {
                                                const sizeName = sizes.find(s => s.id === sizeId)?.name || ""; // Lấy tên size
                                                return selectedColor.map(colorId => {
                                                    const colorName = colors.find(c => c.id === colorId)?.name || ""; // Lấy tên color
                                                    const isVisible = visibleQuantities[`${sizeId}-${colorId}`] !== false; // Kiểm tra nếu input đang hiển thị

                                                    return (
                                                        isVisible && (
                                                            <Grid item xs={2.4} key={`${sizeId}-${colorId}`}>
                                                                <ArgonInput
                                                                    type="number"
                                                                    placeholder={`Nhập số lượng`}
                                                                    name={`quantity-${sizeId}-${colorId}`}
                                                                    size="large"
                                                                    sx={{
                                                                        width: '100%',
                                                                        borderColor: errors.quantity ? 'red' : 'Gainsboro',
                                                                        borderWidth: '1px',
                                                                        borderStyle: 'solid',
                                                                        borderRadius: '4px',
                                                                        transition: 'border-color 0.3s',
                                                                        '&:focus': {
                                                                            borderColor: 'blue',
                                                                        },
                                                                    }}
                                                                    value={formData.quantity[`${sizeId}-${colorId}`] || ""}
                                                                    inputProps={{ min: 0 }}
                                                                    onChange={(e) => handleQuantityChange(sizeId, colorId, e.target.value)}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <b style={{ fontSize: '16px', color: '#333' }}>{sizeName}, {colorName}</b>
                                                                        </InputAdornment>
                                                                    }
                                                                    endAdornment={
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                onClick={() => handleRemoveInput(sizeId, colorId)}
                                                                                edge="end"
                                                                            >
                                                                                <CloseIcon />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                />
                                                            </Grid>
                                                        )
                                                    );
                                                });
                                            })}
                                        </Grid>
                                    </ArgonBox>
                                </ArgonBox>

                                <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                    <div className="custom-editor" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc', padding: '8px' }}>
                                        <ArgonTypography variant="h6" component="h2" fontWeight="bold" mb={2}>
                                            Thông tin sản phẩm
                                        </ArgonTypography>
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
                                                placeholder: errors.description || "Nhập thông tin",
                                            }}
                                            onReady={(editor) => {
                                                const editorElement = editor.ui.view.editable.element;
                                                editorElement.setAttribute('style', 'min-height: 300px; max-height: 300px; overflow-y: auto;');
                                            }}
                                        />

                                    </div>
                                </ArgonBox>
                                <ArgonBox mb={3} mx={{ xs: 1, sm: 2, md: 3 }}>
                                    <ArgonButton type="submit" color="info">
                                        {formData.id ? "Cập nhật" : "Thêm"}
                                    </ArgonButton>
                                    {formData.id && (
                                        <ArgonButton
                                            color="primary"
                                            onClick={resetForm}
                                            sx={{ ml: 1 }}
                                        >
                                            Làm mới
                                        </ArgonButton>
                                    )}
                                </ArgonBox>
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>

                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox>
                            {productDetails?.length > 0 ? (
                                <Data
                                    productDetails={productDetails}
                                    onEditClick={handleEditClick} />

                            ) : (
                                <ArgonBox
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    flexDirection="column"
                                    sx={{
                                        padding: "80px 24px",
                                        borderRadius: "16px",
                                        backgroundColor: "#f5f5f5", // Có thể chỉnh sửa màu nền
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
