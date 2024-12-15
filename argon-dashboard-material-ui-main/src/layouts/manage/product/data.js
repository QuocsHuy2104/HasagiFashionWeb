import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";

import ProductService from "services/ProductServices";

function Product({ image, video, name, importprice }) {
    return (
        <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
            {image && (
                <ArgonBox mr={2}>
                    <ArgonAvatar src={image} alt={name} size="xxl" variant="rounded" />
                </ArgonBox>
            )}
            {video && (
                <ArgonBox mr={2} sx={{ width: '120px', height: '120px' }}>
                    <video width="100%" height="100%" controls style={{ borderRadius: '16px' }}>
                        <source src={video} type="video/mp4" />
                    </video>
                </ArgonBox>
            )}
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
    video: PropTypes.string,
    importprice: PropTypes.number,
};

const ProductTable = ({ onEditClick, setSelectedProduct, searchKeyword, selectedCategory, selectedBrand }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const productResponse = await ProductService.getAllProducts();
            setProducts(productResponse.data || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const refreshProducts = async () => {
        try {
            await fetchData();
            toast.success("Làm mới danh sách sản phẩm thành công!");
        } catch (error) {
            console.error("Error refreshing products:", error);
            toast.error("Làm mới danh sách sản phẩm thất bại!");
        }
    };


    const handleStatusToggle = async (product) => {
        try {
            const updatedProduct = { ...product, isActive: !product.isActive };
            console.log('Cập nhật trạng thái mới:', updatedProduct.isActive);

            await ProductService.updateProduct(product.id, updatedProduct);
            setProducts((prevProducts) =>
                prevProducts.map((p) => (p.id === product.id ? updatedProduct : p))
            );

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Error updating product status", error);
            toast.error("Cập nhật trạng thái thất bại!!!");
        }
    };

    const handleEditClick = (product) => {
        if (onEditClick) onEditClick(product);
    };

    const handleNavigateToProductDetail = (product) => {
        if (setSelectedProduct) {
            setSelectedProduct(product);
            navigate('/manage/product-detail', { state: { product } });
        }
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatImportPrice = (importPrice) => {
        if (!importPrice) return "0đ";

        const prices = importPrice.split('-').map(price => {
            const trimmedPrice = price.trim();
            const numericPrice = parseFloat(trimmedPrice);
            const integerPrice = Math.floor(numericPrice);
            return `${formatNumber(integerPrice)}đ`;
        });

        return prices.join(' - ');
    };

    const filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .filter((product) => {
            if (selectedCategory && product.categoryDTOResponse?.id !== parseInt(selectedCategory)) {
                return false;
            }
            if (selectedBrand && product.brandDTOResponse?.id !== parseInt(selectedBrand)) {
                return false;
            }
            return true;
        });

    const rows = filteredProducts.map(product => ({
        SanPham: (
            <Product
                image={product.image ? product.image : null}
                video={product.video ? product.video : null}
                name={product.name || "Unknown Product"}
                importprice={formatImportPrice(product.importPrice)}
            />
        ),
        SoLuong: (
            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                {product.importQuantity > 0 ? product.importQuantity || "N/A" : "0"}
            </ArgonTypography>
        ),
        DanhMuc: (
            <ArgonBadge
                variant="gradient"
                badgeContent={product.categoryDTOResponse?.name || "Unknown"}
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
                badgeContent={product.brandDTOResponse?.name || "Unknown"}
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
        TrangThai: (
            <Switch
                checked={product.isActive}
                onChange={() => handleStatusToggle(product)}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
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
                    <i className="bi bi-pencil-square"></i> Chỉnh sửa
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
                    <i className="bi bi-info-circle"></i> Chi tiết
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const authorsTableData = {
        columns: [
            { name: "SanPham", align: "left" },
            { name: "SoLuong", align: "center" },
            { name: "DanhMuc", align: "center" },
            { name: "ThuongHieu", align: "center" },
            { name: "TrangThai", align: "center" },
            { name: "ThaoTac", align: "center" },
        ],
        rows,
    };

    return { ...authorsTableData, refreshProducts };
};

ProductTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
    setSelectedProduct: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    selectedCategory: PropTypes.string,
    selectedBrand: PropTypes.string,
};


export default ProductTable;