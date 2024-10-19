import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "../../../components/ArgonBadge";

function Product({ image, name, importprice }) {
    return (
        <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
            <ArgonBox mr={2}>
                <ArgonAvatar src={image} alt={name} size="sm" variant="rounded" />

            </ArgonBox>
            <ArgonBox display="flex" flexDirection="column">
                <ArgonTypography variant="button" fontWeight="medium" color="textPrimary">
                    {name}
                </ArgonTypography>
                <ArgonTypography variant="caption" color="secondary" fontWeight="bold">
                    {`$${importprice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                </ArgonTypography>

            </ArgonBox>
        </ArgonBox>
    );
}

Product.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    importprice: PropTypes.number.isRequired,
};

const ProductTable = ({ onEditClick }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trademarks, setTrademarks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trademarkResponse, categoryResponse, productResponse] = await Promise.all([
                    axios.get("http://localhost:8080/api/brand"),
                    axios.get("http://localhost:8080/api/category"),
                    axios.get("http://localhost:8080/api/product")
                ]);
                setTrademarks(trademarkResponse.data);
                setCategories(categoryResponse.data);
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

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/product/${id}`);
            setProducts(products.filter(product => product.id !== id));
            toast.success("Delete product successful");
        } catch (error) {
            console.error("There was an error deleting the item!", error);
        }
    };

    const rows = products.map(product => ({
        product: (
            <Product
                image={product.image ? product.image : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"}
                name={product.name}
                importprice={product.importPrice}
            />
        ),
        quantity: (
            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                {product.quantity === 0 ? "Sold out" : product.importQuantity}
            </ArgonTypography>
        ),
        category: (
            <ArgonBadge
                variant="gradient"
                badgeContent={categories.find(cate => product.categoryId === cate.id)?.name || "No category"}
                color="primary"
                size="xs"
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
                badgeContent={trademarks.find(brand => product.trademarkId === brand.id)?.name || "No brand"}
                color="info"
                size="xs"
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
                    component="a"
                    variant="caption"
                    color="primary"
                    fontWeight="medium"
                    href={`/manage/product/${product.id}`}
                    sx={{
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