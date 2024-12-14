import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Grid, Box, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import PropTypes from 'prop-types';
import HomeService from 'services/HomeServices';
import ArgonTypography from 'components/ArgonTypography';
import ArgonBox from 'components/ArgonBox';
import SizeSelector from '../HasagiSelector/sizeSelector';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import MuiLink from "@mui/material/Link";
import Typography from '@mui/material/Typography';

export default function ProductPopup({ open, handleClose, id }) {
    const [productDetails, setProductDetail] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [pd, setPd] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const allSizes = new Map();
    const allColors = new Map();

    useEffect(() => {
        const fetchData = async () => {
            if (Number.isInteger(id) && open) {
                try {
                    const [productDetailData, productPdData] = await Promise.all([
                        HomeService.getProductDetailPopup(id),
                        HomeService.getProductPopupById(id)
                    ]);
                    setPd(productPdData);

                    setProductDetail(productDetailData);

                    setSelectedSize(productDetailData.sizesDTOResponse?.[0]?.size || '');
                    setSelectedColor(productDetailData.colorsDTO?.[0]?.color || '');
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            } else {
                console.warn(`Product ID is invalid: ${id}. Popup is closed: ${!open}`);
            }
        };

        fetchData();
    }, [id, open]);

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    const handleSizeSelection = (sizeId) => {
        setSelectedSize(sizeId);
    };


    const handleQuantityChange = (increment) => {
        setQuantity((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
    };

    if (!productDetails) {
        return null;
    }

    productDetails.forEach(productDetail => {
        if (Array.isArray(productDetail.sizesDTOResponse)) {
            productDetail.sizesDTOResponse.forEach(size => {
                if (!allSizes.has(size.id)) {
                    allSizes.set(size.id, size);
                }
            });
        } else if (productDetail.sizesDTOResponse) {
            allSizes.set(productDetail.sizesDTOResponse.id, productDetail.sizesDTOResponse);
        }

        if (Array.isArray(productDetail.colorsDTO)) {
            productDetail.colorsDTO.forEach(color => {
                if (!allColors.has(color.id)) {
                    allColors.set(color.id, color);
                }
            });
        } else if (productDetail.colorsDTO) {
            allColors.set(productDetail.colorsDTO.id, productDetail.colorsDTO);
        }
    });

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            alert('Vui lòng chọn màu sắc và kích thước trước khi thêm vào giỏ hàng.');
            return;
        }

        const requestData = {
            productId: id,
            colorId: selectedColor,
            sizeId: selectedSize,
            quantity: quantity,
        };

        try {
            const response = await HomeService.addToCartPopup(requestData);

            switch (response.status) {
                case 200:
                    alert('Sản phẩm đã được thêm vào giỏ hàng!');
                    break;
                case 409:
                    alert('Sản phẩm này đã tồn tại trong giỏ hàng.');
                    break;
                case 400:
                    alert('Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
                    break;
                case 404:
                    alert('Không tìm thấy sản phẩm hoặc dữ liệu liên quan.');
                    break;
                default:
                    alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
                    break;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response) {
                const { status, data } = error.response;
                if (status === 500) {
                    alert('Lỗi máy chủ. Vui lòng thử lại sau.');
                } else {
                    alert(`Có lỗi xảy ra: ${data}`);
                }
            } else {
                alert('Không thể kết nối với máy chủ. Vui lòng kiểm tra mạng và thử lại.');
            }
        }
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent='center'>
                        {pd.image !== '' ? (
                            <img
                                src={pd.image}
                                alt="Product Image"
                                style={{ maxWidth: '380px', height: 'auto', borderRadius: '8px' }}
                            />
                        ) : (
                            <video
                                controls
                                src="https://example.com/path/to/your/video.mp4"
                                style={{ maxWidth: '100%', borderRadius: '8px' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <ArgonTypography variant="h3" fontWeight="bold">
                            {pd.name || 'Tên sản phẩm'}
                        </ArgonTypography>
                        <ArgonTypography variant="button" >Mã sản phẩm: {pd.id}</ArgonTypography>
                        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap">
                            <ArgonTypography
                                variant="button"
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                Thương hiệu:{" "}
                                <ArgonTypography
                                    variant="body2"
                                    ml={1}
                                    component="span"
                                    sx={{ whiteSpace: "nowrap" }}
                                >
                                    {pd.trademarkDTOResp.name}
                                </ArgonTypography>
                            </ArgonTypography>

                            <ArgonTypography
                                variant="button"
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                Danh mục:{" "}
                                <ArgonTypography
                                    variant="body2"
                                    ml={1}
                                    component="span"
                                    sx={{ whiteSpace: "nowrap" }}
                                >
                                    {pd.categoryDTOResp.name}
                                </ArgonTypography>
                            </ArgonTypography>
                        </ArgonBox>


                        {/* Price and Discount */}
                        <Box mt={2}>
                            <ArgonBox display="flex" alignItems="center" gap={2}>
                                {pd.importPrice !== undefined ? (
                                    <>
                                        {/* Giá gạch chân */}
                                        <ArgonTypography
                                            variant="h5"
                                            sx={{ textDecoration: 'line-through' }}
                                            color="light"
                                        >
                                            {pd.importPrice}₫
                                        </ArgonTypography>

                                        {/* Giá giảm */}
                                        <ArgonTypography variant="h4" color="error" fontWeight="bold">
                                            {pd.sale === "0"
                                                ? `${parseFloat(pd.importPrice).toLocaleString()}₫`
                                                : `${(parseFloat(pd.importPrice) * (1 - parseFloat(pd.sale) / 100)).toLocaleString()}₫`}
                                        </ArgonTypography>

                                    </>
                                ) : (
                                    <ArgonTypography variant="body2" color="error">
                                        Giá sản phẩm không khả dụng
                                    </ArgonTypography>
                                )}

                                {pd.sale !== "0" ? (
                                    <ArgonBox
                                        bgColor="error"
                                        color="white"
                                        borderRadius="sm"
                                        px={2}
                                        py={1}
                                        sx={{ textAlign: 'center' }}
                                    >
                                        Tiết kiệm {parseFloat(pd.sale)}%
                                    </ArgonBox>
                                ) : null}
                            </ArgonBox>

                        </Box>

                        <>
                            {/* Size Selection */}
                            <Box mt={3} key="size-group">
                                <ArgonTypography variant="body2" fontWeight="bold">Size</ArgonTypography>
                                <SizeSelector sizes={Array.from(allSizes.values())} onSizeSelect={handleSizeSelection} />
                            </Box>

                            {/* Color Selection */}
                            <Box mt={3} key="color-group">
                                <ArgonTypography variant="body2" fontWeight="bold">Màu sắc</ArgonTypography>
                                <ArgonBox ml={2}>
                                    <RadioGroup row value={selectedColor} onChange={handleColorChange}>
                                        {allColors.size > 0 ? (
                                            Array.from(allColors.values()).map(color => (
                                                <FormControlLabel
                                                    key={`color-${color.id}`}
                                                    value={color.id}
                                                    control={<Radio />}
                                                    label={color.name}
                                                />
                                            ))
                                        ) : (
                                            <ArgonTypography variant="body2" color="error">Không có màu sắc nào khả dụng</ArgonTypography>
                                        )}
                                    </RadioGroup>
                                </ArgonBox>

                            </Box>

                        </>

                        {/* Quantity */}
                        <ArgonBox display='flex' justifyContent='start' alignItems='center' mt={2}>
                            <ArgonTypography variant="body2" fontWeight="bold">Số lượng</ArgonTypography>
                            <Box
                                borderRadius='8px'
                                ml={2}
                                sx={{
                                    border: '1px solid #ccc'
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Button onClick={() => handleQuantityChange(false)}>-</Button>
                                    <ArgonTypography variant="body1" mx={2}>{quantity}</ArgonTypography>
                                    <Button onClick={() => handleQuantityChange(true)}>+</Button>
                                </Box>
                            </Box>
                        </ArgonBox>

                        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                            {/* Nút Thêm vào giỏ */}
                            <Button
                                variant="outlined"
                                color="secondary"

                                sx={{
                                    borderRadius: "12px",
                                    border: "1px solid #ccc",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    textTransform: "uppercase",
                                    padding: "10px 20px",
                                    color: "black",
                                    flex: 1,
                                    marginRight: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ
                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{
                                        fontWeight: "normal",
                                        fontSize: "12px",
                                        color: "gray",
                                        marginTop: "4px",
                                    }}
                                >
                                    Chọn ngay sản phẩm bạn yêu thích
                                </Typography>
                            </Button>

                            {/* Nút Xem chi tiết */}
                            <MuiLink href={`/ShopDetail?id=${id}`} rel="noreferrer">
                                <Button
                                    variant="contained"

                                    sx={{
                                        borderRadius: "12px",
                                        backgroundColor: "#FFCC00",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        textTransform: "uppercase",
                                        padding: "10px 20px",
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        "&:hover": {
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc"
                                        },
                                    }}
                                >
                                    Xem chi tiết
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{
                                            fontWeight: "normal",
                                            fontSize: "12px",
                                            color: "white",
                                            marginTop: "4px", // Tạo khoảng cách giữa dòng chính và mô tả
                                        }}
                                    >
                                        Tổng quan về sản phẩm
                                    </Typography>
                                </Button>
                            </MuiLink>
                        </Box>

                    </Grid>
                </Grid>
            </DialogContent >
        </Dialog >

    );
}

ProductPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    handleClose: PropTypes.func.isRequired,
};
