import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Card } from "@mui/material";
import ProductPopup from "components/client/HasagiPopup";
import ArgonTypography from "components/ArgonTypography";
import ArgonBox from "components/ArgonBox";
import MuiLink from "@mui/material/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeService from "services/HomeServices";

export default function SaleProduct() {
    const [hoveredProductId, setHoveredProductId] = useState(null); // Track hovered product
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [products, setProducts] = useState([]);

    const handleOpenPopup = (id) => {
        setSelectedProductId(id);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedProductId(null);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await HomeService.getProductSale();
                setProducts(res?.data || []); // Ensure the result is always an array
            } catch (error) {
                console.error("Error fetching sale products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ArgonBox>
            <ArgonBox my={3} display="flex" justifyContent="space-between" alignItems="center">
                <ArgonBox>
                    <ArgonTypography variant="h3">Sản phẩm giảm giá</ArgonTypography>
                </ArgonBox>
                <ArgonBox>
                    <MuiLink href="/Shop">
                        <ArgonTypography variant="h4">
                            Xem Thêm <FontAwesomeIcon icon={faArrowRight} />
                        </ArgonTypography>
                    </MuiLink>
                </ArgonBox>
            </ArgonBox>

            {/* Product List */}
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Grid container spacing={2}>
                    {products.length > 0 ? (
                        products.slice(0, 8).map((product) => (
                            <Grid item xs={12} sm={6} md={3} key={product.id}>
                                <Card
                                    onMouseEnter={() => setHoveredProductId(product.id)}
                                    onMouseLeave={() => setHoveredProductId(null)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        height: "100%",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <MuiLink href={`ShopDetails?id=${product.id}`} rel="noreferrer">
                                        <ArgonBox
                                            mt={1}
                                            mx={2}
                                            style={{
                                                overflow: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <ArgonBox
                                                component="img"
                                                src={product.image || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"}
                                                alt={product.name}
                                                height="475px"
                                                width="auto"
                                                borderRadius="lg"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"; // Thay thế bằng ảnh mặc định
                                                }}
                                                style={{
                                                    transition: "transform 0.3s ease",
                                                    transform: hoveredProductId === product.id ? "scale(1.1)" : "scale(1)",
                                                }}
                                            />

                                        </ArgonBox>
                                        <ArgonTypography
                                            variant="h5"
                                            color="text"
                                            mt={2}
                                            textAlign="center"
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: "100%",
                                            }}
                                        >
                                            {product.name}
                                        </ArgonTypography>


                                        <ArgonBox display="flex" alignItems="center" justifyContent="center" my={1}>
                                            {(() => {
                                                const salePercent = parseFloat(product.sale);
                                                const price = product.importPrice ? parseFloat(product.importPrice.toString().replace(/\s/g, "")) : 0;

                                                if (!isNaN(salePercent) && salePercent > 0 && !isNaN(price)) {
                                                    const salePrice = price - (price * salePercent) / 100; // Tính giá sau giảm
                                                    return (
                                                        <>
                                                            {/* Giá gốc (bị gạch ngang) */}
                                                            <ArgonTypography variant="button" color="secondary" style={{ textDecoration: "line-through" }}>
                                                                {price.toLocaleString()} VNĐ
                                                            </ArgonTypography>
                                                            {/* Giá sau giảm */}
                                                            <ArgonTypography
                                                                variant="button"
                                                                color="error"
                                                                style={{ marginLeft: "8px" }}
                                                            >
                                                                {salePrice.toLocaleString()} VNĐ
                                                            </ArgonTypography>
                                                        </>
                                                    );
                                                } else if (!isNaN(price)) {
                                                    return (
                                                        <ArgonTypography variant="button" color="text">
                                                            {price.toLocaleString()} VNĐ
                                                        </ArgonTypography>
                                                    );
                                                } else {
                                                    return (
                                                        <ArgonTypography variant="button" color="error">
                                                            Giá không khả dụng
                                                        </ArgonTypography>
                                                    );
                                                }
                                            })()}
                                        </ArgonBox>

                                    </MuiLink>
                                    <ArgonBox
                                        color="white"
                                        bgColor="error"
                                        borderRadius="md"
                                        p={1}
                                        shadow="lg"
                                        sx={{
                                            position: "absolute",
                                            top: 15,
                                            left: 15,
                                            fontSize: "12px",
                                        }}
                                    >
                                        -{product.sale}%
                                    </ArgonBox>
                                    {hoveredProductId === product.id && (
                                        <>
                                            <SearchOutlinedIcon
                                                onClick={() => handleOpenPopup(product.id)}
                                                sx={{
                                                    width: "1.7em",
                                                    height: "1.7em",
                                                    position: "absolute",
                                                    top: 17,
                                                    right: 15,
                                                    backgroundColor: "#F9F9F9",
                                                    padding: "5px",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                }}
                                            />
                                            <ShoppingCartIcon
                                                sx={{
                                                    width: "1.7em",
                                                    height: "1.7em",
                                                    position: "absolute",
                                                    top: 62,
                                                    right: 15,
                                                    backgroundColor: "#F9F9F9",
                                                    padding: "5px",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </>
                                    )}
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" textAlign="center" color="text.secondary">
                            Không có sản phẩm giảm giá nào.
                        </Typography>
                    )}
                </Grid>
            </Box>
            <ProductPopup open={isPopupOpen} handleClose={handleClosePopup} id={selectedProductId} />
        </ArgonBox>
    );
}
