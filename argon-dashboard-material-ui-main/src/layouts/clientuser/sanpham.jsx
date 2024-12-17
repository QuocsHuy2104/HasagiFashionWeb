import React, { useEffect, useState } from "react";
import ArgonBox from "components/ArgonBox";
import HomeService from "services/HomeServices";
import HasagiCard2 from "components/client/HasagiCard/Card2";
import ArgonTypography from "components/ArgonTypography";
import MuiLink from "@mui/material/Link";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Card, Box, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import reviewsService from 'services/ReviewsServices';
import Header from 'components/client/HasagiHeader';

function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Define items per page
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };
    const filteredProducts = products.filter(product => {

        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearchTerm;
    });
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await HomeService.getNewProducts();
                setProducts(res.data || []);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const fetchReviews = async (productId) => {
        try {
            const productReviews = await reviewsService.getReviewsByProduct(productId);
            console.log('Fetched reviews for product:', productReviews);
            setReviews((prevReviews) => [...prevReviews, ...productReviews]);
        } catch (error) {
            console.error('Error fetching reviews for product:', error);
            setReviews([]);
        }
    };

    useEffect(() => {
        if (products.length > 0) {
            products.forEach((product) => {
                fetchReviews(product.id);
            });
        }
    }, [products]);

    const calculateAverageStars = (productId) => {
        const productReviews = reviews.filter((review) => review.productId === productId);
        if (productReviews.length === 0) return 0;

        const totalStars = productReviews.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / productReviews.length).toFixed(1);
    };

    const formatSoldCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count;
    }

    return (
        <>
            <Header onSearch={handleSearch} />

            <ArgonBox py={6} style={{ width: "100%" }}>
                <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
                    <ArgonTypography variant="h3">Sản phẩm</ArgonTypography>
                    <MuiLink href="/Shop">
                        <ArgonTypography variant="h5" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            Xem Thêm <FontAwesomeIcon icon={faArrowAltCircleRight} />
                        </ArgonTypography>
                    </MuiLink>
                </ArgonBox>

                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"  // Đảm bảo 4 sản phẩm mỗi hàng
                    gap={3}
                    justifyItems="center"
                >
                    {currentProducts
                        .map((product, index) => (
                            <div
                                key={index}
                                className="product-card"
                                style={{
                                    position: "relative",
                                    width: "100%",  // Chiếm toàn bộ cột
                                    maxWidth: "300px",  // Điều chỉnh kích thước tối đa của mỗi card
                                    margin: "10px",  // Thêm khoảng cách giữa các sản phẩm
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    backgroundColor: "#fff",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.03)";
                                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                                }}
                            >
                                <Link to={`/ShopDetail?id=${product.id}`} style={{ textDecoration: "none" }}>
                                    <Card style={{ borderRadius: "8px", display: "flex", flexDirection: "column", height: "100%" }}>
                                        <div style={{ position: "relative", overflow: "hidden" }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: "100%",
                                                    height: "350px",
                                                    objectFit: "cover",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            />
                                            {product.sale > 0 && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        left: "10px",
                                                        backgroundColor: "#f5365c",
                                                        color: "white",
                                                        padding: "5px 10px",
                                                        borderRadius: "5px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    -{product.sale}%
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ padding: "10px" }}>
                                            <div
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    marginBottom: "5px",
                                                    whiteSpace: "normal",  // Ensures wrapping
                                                    wordWrap: "break-word",  // Handles long words breaking to the next line
                                                }}
                                            >
                                                {product.name}
                                            </div>
                                            <div style={{ fontSize: "14px", color: "#555" }}>
                                                {product.importPrice ? (
                                                    <span style={{ color: "#f5365c", fontWeight: "bold" }}>
                                                        {parseFloat(product.importPrice.toString().replace(/\s/g, "")).toLocaleString()}đ
                                                    </span>
                                                ) : (
                                                    <span style={{ color: "#aaa" }}>Giá không khả dụng</span>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    marginTop: "auto",  // Đẩy các phần tử này xuống dưới cùng
                                                    display: "flex",
                                                    justifyContent: "space-between", // Giữa số sao và lượt bán
                                                    alignItems: "center",  // Căn giữa theo chiều dọc
                                                    width: "100%",  // Đảm bảo chiều rộng đầy đủ
                                                }}
                                            >
                                                <Typography variant="body2" style={{ fontWeight: "bold" }}>
                                                    ⭐ {calculateAverageStars(product.id)}
                                                </Typography>
                                                <Typography variant="body2" style={{ fontWeight: "bold", fontSize: "13px" }}>
                                                    Lượt bán: {formatSoldCount(product.sold)}
                                                </Typography>

                                            </div>
                                        </div>

                                    </Card>
                                </Link>
                            </div>
                        ))}
                </Box>


                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: currentPage === 1 ? "#e0e0e0" : "#FFD333",
                            border: "none",
                            borderRadius: "50%",
                            color: "black",
                            fontSize: "18px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        }}
                    >
                        <FiChevronLeft style={{ fontSize: "20px" }} />
                    </button>

                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            margin: "0 15px",
                            color: "#333",
                            textAlign: "center",
                            padding: "10px 10px",
                            backgroundColor: "#f7f7f7",
                            borderRadius: "25px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        Trang {currentPage} / {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => paginate(currentPage + 1)}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: currentPage === totalPages ? "#e0e0e0" : "#FFD333",
                            border: "none",
                            borderRadius: "50%",
                            color: "black",
                            fontSize: "18px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        }}
                    >
                        <FiChevronRight style={{ fontSize: "20px" }} />
                    </button>
                </Box>

            </ArgonBox>
        </>
    );
}

export default FeaturedProducts;
