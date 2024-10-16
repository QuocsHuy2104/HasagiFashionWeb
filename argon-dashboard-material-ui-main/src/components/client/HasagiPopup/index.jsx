import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, Button, IconButton, Grid, Radio, RadioGroup, FormControlLabel, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";

import ProductService from 'services/ProductServices';


export default function ProductPopup({ open, handleClose, id }) {

    const [selectedSize, setSelectedSize] = useState('35');
    const [quantity, setQuantity] = useState(1);
    const [pds, setPds] = useState('')

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    const handleQuantityChange = (increment) => {
        setQuantity((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
    };

    useEffect(async () => {
        try {
            const resp = await ProductService.getProductID();
            setPds(resp.data)
        } catch (e) {
            console.error(e);
        }
    }, [])

    const image = pds.image == null || pds.image == '' ? "https://www.pinclipart.com/picdir/big/206-2061237_a-gallery-icon-png-circle-clipart.png" : pds.image

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
                <IconButton onClick={handleClose} style={{ position: 'absolute', top: 10, right: -10 }}>
                    <CloseIcon />
                </IconButton>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box component="img" src={image} alt="Product" sx={{ width: '100%' }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" fontWeight="bold">
                            Converse Chuck Taylor All Star Mono Leather Low Top
                        </Typography>
                        <Typography variant="body2" color="textSecondary">Mã sản phẩm: Đang cập nhật</Typography>
                        <Typography variant="body2" color="textSecondary">Thương hiệu: Converse</Typography>
                        <Typography variant="body2" color="textSecondary">Dòng sản phẩm: Giày cổ thấp</Typography>

                        {/* Price and Discount */}
                        <Box mt={2}>
                            <Typography variant="body2" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                                2.139.000₫
                            </Typography>
                            <Typography variant="h5" color="primary" fontWeight="bold">
                                1.900.000₫ <Button variant="contained" color="error">Tiết kiệm 11%</Button>
                            </Typography>
                        </Box>

                        {/* Size Selection */}
                        <Box mt={3}>
                            <Typography variant="body2" fontWeight="bold">Size</Typography>
                            <RadioGroup row value={selectedSize} onChange={handleSizeChange}>
                                <FormControlLabel value="35" control={<Radio />} label="35" />
                                <FormControlLabel value="36" control={<Radio />} label="36" />
                                <FormControlLabel value="37" control={<Radio />} label="37" />
                                <FormControlLabel value="38" control={<Radio />} label="38" />
                            </RadioGroup>
                        </Box>

                        {/* Quantity */}
                        <Box mt={2}>
                            <Typography variant="body2" fontWeight="bold">Số lượng</Typography>
                            <Box display="flex" alignItems="center">
                                <Button onClick={() => handleQuantityChange(false)}>-</Button>
                                <Typography variant="body1" mx={2}>{quantity}</Typography>
                                <Button onClick={() => handleQuantityChange(true)}>+</Button>
                            </Box>
                        </Box>

                        {/* Actions */}
                        <Box mt={3}>
                            <Button variant="contained" color="primary" fullWidth>
                                Thêm vào giỏ
                            </Button>
                            <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }}>
                                Xem chi tiết
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

ProductPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    handleClose: PropTypes.func.isRequired,
};

