import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";

import ProductService from "services/ProductServices";

function Product({ image, name, importprice }) {
    const defaultImage = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
    const imageUrl = image && image !== '' ? image : defaultImage;

    return (
        <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
            <ArgonBox mr={2}>
                <ArgonAvatar src={imageUrl} alt={name} size="xxl" variant="rounded" />
            </ArgonBox>
            <ArgonBox display="flex" flexDirection="column">
                <ArgonTypography variant="button" fontWeight="medium" color="textPrimary">
                    {name}
                </ArgonTypography>
                <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
                    {importprice ? `${importprice}` : "0"}
                </ArgonTypography>
            </ArgonBox>
        </ArgonBox>
    );
}

Product.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    importprice: PropTypes.number,
};

const ProductTable = ({ onEditClick, setSelectedProduct }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data || []);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (product) => {
        if (onEditClick) onEditClick(product);
    };

    const handleNavigateToProductDetail = (product) => {
        if (setSelectedProduct) {
            setSelectedProduct(product);
            navigate('/manage/product-detail', { state: { product } });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year}\n${hours}:${minutes}`;
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatImportPrice = (importPrice) => {
        if (!importPrice) return "0đ"; // Default value if importPrice is not available

        const prices = importPrice.split('-').map(price => {
            const trimmedPrice = price.trim();
            const numericPrice = parseFloat(trimmedPrice); // Convert string to number
            const integerPrice = Math.floor(numericPrice); // Remove decimal places
            return `${formatNumber(integerPrice)}đ`; // Format number and prefix with 'đ'
        });

        return prices.join(' - '); // Join formatted prices with ' - '
    };





    const rows = products.map(product => ({
        SanPham: (
            <Product
                image={`http://localhost:3000/${product.image || "No_Image_Available.jpg"}`}
                name={product.name || "Unknown Product"}
                importprice={formatImportPrice(product.importPrice)}
            />
        ),
        SoLuong: (
            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                {product.importQuantity > 0 ? product.importQuantity || "N/A" : "0"}
            </ArgonTypography>
        ),
        NgayTao: (
            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                {formatDate(product.createDate)}
            </ArgonTypography>

        ),
        DanhMuc: (
            <ArgonBadge
                variant="gradient"
                badgeContent={product.categoryDTOResp?.name || "Unknown"}
                color="primary"
                size="sm"
                sx={{
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    padding: "5px 10px",
                    borderRadius: "10px",
                }}
            />
        ),
        ThuongHieu: (
            <ArgonBadge
                variant="gradient"
                badgeContent={product.trademarkDTOResp?.name || "Unknown"}
                color="info"
                size="sm"
                sx={{
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    padding: "5px 10px",
                    borderRadius: "10px",
                }}
            />
        ),
        ThaoTac: (
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="info"
                    fontWeight="medium"
                    onClick={() => handleEditClick(product)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-pencil-square"></i> Edit
                </ArgonTypography>
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="primary"
                    fontWeight="medium"
                    onClick={() => handleNavigateToProductDetail(product)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-info-circle"></i> Detail
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const authorsTableData = {
        columns: [
            { name: "SanPham", align: "left" },
            { name: "SoLuong", align: "center" },
            { name: "NgayTao", align: "center" },
            { name: "DanhMuc", align: "center" },
            { name: "ThuongHieu", align: "center" },
            { name: "ThaoTac", align: "center" },
        ],
        rows,
    };

    return authorsTableData;
};

ProductTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
    setSelectedProduct: PropTypes.func.isRequired,
};

export default ProductTable;
