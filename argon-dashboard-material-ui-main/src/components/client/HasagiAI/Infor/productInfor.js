// src/components/ProductInfo.js
import React from 'react';
import { Link, Typography, Avatar, Card, CardContent } from '@mui/material';
import PropTypes from 'prop-types';

const ProductInfo = ({ product }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 0,
                paddingRight: 0,
                margin: 0,
                borderRadius: 3,            // Bo tròn góc thẻ
                boxShadow: 3,               // Hiệu ứng đổ bóng
                backgroundColor: '#f8f9fa', // Màu nền nhạt cho thẻ
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)', // Phóng to nhẹ khi hover
                    boxShadow: 6,             // Tăng độ đổ bóng khi hover
                },
            }}
        >
            <Link to={`/ShopDetail?id=${product.id}`}>
                {product.image && (
                    <Avatar
                        alt={product.name}
                        src={product.image}
                        variant="square"
                        sx={{
                            width: 200,
                            height: 200,
                            border: '1px solid #ddd',
                        }}
                    />
                )}
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777' }}>
                        Giá: {product.importPrice.toLocaleString()} VND
                    </Typography>
                </CardContent>
            </Link>
        </Card>
    );
};

ProductInfo.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        importPrice: PropTypes.number.isRequired,
    }).isRequired,
};

export default ProductInfo;
