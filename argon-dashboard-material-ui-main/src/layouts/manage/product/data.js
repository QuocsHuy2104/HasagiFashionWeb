import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "../../../components/ArgonBadge";

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
                    {importprice} VNĐ
                </ArgonTypography>
            </ArgonBox>
        </ArgonBox>
    );
}


Product.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    importprice: PropTypes.string.isRequired,
};

const ProductTable = ({ onEditClick, setSelectedProduct }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (product) => {
        onEditClick(product);
    };

    const handleNavigateToProductDetail = (product) => {
        setSelectedProduct(product);
        navigate('/manage/product-detail', { state: { product } });
    };
    

    const rows = products.map(product => ({
        product: (
            <Product
                image={product.image && product.image !== '' 
                    ? product.image 
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"}
                name={product.name}
                importprice={product.importPrice}
            />
        ),
        quantity: (
            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                {product.quantity === 0 ? "Sold out" : product.importQuantity}
            </ArgonTypography>
        ),
        createDate: (
            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                {product.createDate}
            </ArgonTypography>
        ),
        category: (
            <ArgonBadge
                variant="gradient"
                badgeContent={product.categoryDTOResp.name}
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
        brand: (
            <ArgonBadge
                variant="gradient"
                badgeContent={product.trademarkDTOResp.name}
                color="info"
                size="sm"
                sx={{
                    fontSize: "50px",
                    textTransform: "capitalize",
                    padding: "5px 10px",
                    borderRadius: "10px",
                }}
            />
        ),
        action: (
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
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="error"
                    fontWeight="medium"
                    onClick={() => deleteItem(product.id)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-trash3"></i> Remove
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const authorsTableData = {
        columns: [
            { name: "product", align: "left" },
            { name: "quantity", align: "center" },
            { name: "createDate", align: "center" },
            { name: "category", align: "center" },
            { name: "brand", align: "center" },
            { name: "action", align: "center" },
        ],
        rows,
    };

    return authorsTableData;
};
ProductTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default ProductTable;