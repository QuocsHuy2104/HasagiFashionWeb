import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Grid, Box, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import PropTypes from 'prop-types';
import HomeService from 'services/HomeServices';
import ArgonTypography from 'components/ArgonTypography';
import ArgonBox from 'components/ArgonBox';
import SizeSelector from '../HasagiSelector/sizeSelector';

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

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
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

    console.log(allSizes)

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
                <Grid container spacing={3}>
                    <React.Fragment>
                        <Grid item xs={12} md={6} display='flex' alignItems='center'>
                            <ArgonBox component="img" src={pd.image || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'} alt="Product" sx={{ width: '100%' }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <ArgonTypography variant="h3" fontWeight="bold">
                                {pd.name || 'Tên sản phẩm'}
                            </ArgonTypography>
                            <ArgonTypography variant="button" >Mã sản phẩm: {pd.id}</ArgonTypography>
                            <ArgonBox display="flex" justifyContent='space-between' alignItems='center' >
                                <ArgonBox>
                                    <ArgonTypography variant="button">Thương hiệu: <ArgonTypography variant='body2' ml={2}>{pd.trademarkDTOResp.name}</ArgonTypography> </ArgonTypography>
                                </ArgonBox>
                                <ArgonBox>
                                    <ArgonTypography variant="button" > Danh muc: <ArgonTypography variant='body2' ml={2}>{pd.categoryDTOResp.name}</ArgonTypography> </ArgonTypography>
                                </ArgonBox>
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
                                    <RadioGroup row value={selectedSize} onChange={handleSizeChange}>
                                        {allSizes.size > 0 ? (
                                            Array.from(allSizes.values()).map(size => (
                                                <FormControlLabel
                                                    key={`size-${size.id}`}
                                                    value={size.id}
                                                    control={<Radio />}
                                                    label={size.name}
                                                />
                                            ))
                                        ) : (
                                            <ArgonTypography variant="body2" color="error">Không có kích thước nào khả dụng</ArgonTypography>
                                        )}
                                    </RadioGroup>
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

                                <SizeSelector sizes={allSizes} />
                            </>

                            {/* Quantity */}
                            <Box mt={2}>
                                <ArgonTypography variant="body2" fontWeight="bold">Số lượng : {quantity}</ArgonTypography>
                                <Box display="flex" alignItems="center">
                                    <Button onClick={() => handleQuantityChange(false)}>-</Button>
                                    <ArgonTypography variant="body1" mx={2}>{quantity}</ArgonTypography>
                                    <Button onClick={() => handleQuantityChange(true)}>+</Button>
                                </Box>
                            </Box>

                            <Box mt={3} display='flex' justifyContent='space-between' alignItems='center'>
                                <Button variant="contained" color="primary" fullWidth>
                                    Thêm vào giỏ
                                </Button>
                                <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }}>
                                    Xem chi tiết
                                </Button>
                            </Box>
                        </Grid>
                    </React.Fragment>
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
