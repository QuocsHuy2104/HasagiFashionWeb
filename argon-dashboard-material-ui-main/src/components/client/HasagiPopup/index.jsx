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

export default function ProductPopup({ open, handleClose, id }) {
    const [productDetails, setProductDetail] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [pd, setPd] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const allSizes = new Map();
    const allColors = new Map();
    const allImages = new Map();

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

    const handleSizeSelection = (size) => {
        console.log('Size selected in parent:', size);
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

        if (Array.isArray(productDetail.imageDTOResponse)) {
            productDetail.imageDTOResponse.forEach(image => {
                if (image.url) {
                    allImages.push({ url: image.url });
                }
            });
        } else if (productDetail.imageDTOResponse && productDetail.imageDTOResponse.url) {
            allImages.push({ url: productDetail.imageDTOResponse.url });
        }
    });

    const handleAddToCart = () => {

    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} display='flex' alignItems='center'>
                        <div className="carousel-container" style={styles.carouselContainer}>
                            <Carousel
                                prevIcon={<span style={styles.customPrevIcon}>&lt;</span>}
                                nextIcon={<span style={styles.customNextIcon}>&gt;</span>}
                                fade
                                interval={3000}
                            >

                                {
                                    allImages.size > 0 ? (
                                        Array.from(allImages.values()).map(image => (
                                            <Carousel.Item key={`${banner.id}-${imgIndex}`}>
                                                <img
                                                    className="d-block w-100"
                                                    style={styles.carouselImage}
                                                    src={image.url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'}
                                                    alt={pd.name}
                                                />
                                            </Carousel.Item>
                                        ))
                                    )
                                        : <ArgonBox component="img" src='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930' alt="Product" sx={{ width: '100%' }} />
                                }
                            </Carousel>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <ArgonTypography variant="h3" fontWeight="bold">
                            {pd.name || 'Tên sản phẩm'}
                        </ArgonTypography>
                        <ArgonTypography variant="button" >Mã sản phẩm: {pd.id}</ArgonTypography>
                        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap">
                            <ArgonTypography
                                variant="button"
                                sx={{ whiteSpace: "nowrap" }} // Ngăn nội dung bị xuống hàng
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
                            {pd.importPrice !== undefined ? (
                                <ArgonBox display="flex" alignItems="center" gap={2}>
                                    <ArgonTypography variant="h5" sx={{ textDecoration: 'line-through' }} color="light">
                                        {pd.importPrice}₫
                                    </ArgonTypography>
                                    <ArgonTypography variant="h4" color="error" fontWeight="bold">
                                        {
                                            pd.sale === 0
                                                ? `${pd.importPrice}₫`
                                                : `${(pd.importPrice * (pd.sale / 100))}₫`
                                        }
                                    </ArgonTypography>
                                    {
                                        pd.sale !== 0 && pd.sale !== '0'
                                            ? (
                                                <ArgonBox bgColor='error' color='white' borderRadius='sm' px={2} py={1} sx={{ textAlign: 'center' }}>
                                                    Tiết kiệm {pd.sale} %
                                                </ArgonBox>
                                            )
                                            : null
                                    }

                                </ArgonBox>

                            ) : (
                                <ArgonTypography variant="body2" color="error">Giá sản phẩm không khả dụng</ArgonTypography> // Fallback message
                            )}
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
                            </Box>

                        </>

                        {/* Quantity */}
                        <Box mt={2}>
                            <Box display="flex" alignItems="center">
                                <Button onClick={() => handleQuantityChange(false)}>-</Button>
                                <ArgonTypography variant="body1" mx={2}>{quantity}</ArgonTypography>
                                <Button onClick={() => handleQuantityChange(true)}>+</Button>
                            </Box>
                        </Box>

                        <Box mt={3} display='flex' justifyContent='space-between' alignItems='center'>
                            <Button variant="contained" color="primary" fullWidth onClick={handleAddToCart}>
                                Thêm vào giỏ
                            </Button>
                            <MuiLink href={`ShopDetails/${id}`} target="_blank" rel="noreferrer">
                                <Button variant="outlined" color="primary" fullWidth >
                                    Xem chi tiết
                                </Button>
                            </MuiLink>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent >
        </Dialog >

    );
}

const styles = {
    carouselContainer: {
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    carouselImage: {
        height: 'auto',
        objectFit: 'cover',
        borderRadius: '10px',
    },
    customPrevIcon: {
        fontSize: '2rem',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.3)',
        marginLeft: '40px',
    },
    customNextIcon: {
        fontSize: '2rem',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.3)',
        marginRight: '40px',
    },
};

ProductPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    handleClose: PropTypes.func.isRequired,
};
