import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ArgonBox from "components/ArgonBox";
import HomeService from "services/HomeServices";
import HasagiCard2 from "components/client/HasagiCard/Card2";
import ArgonTypography from "components/ArgonTypography";
import MuiLink from "@mui/material/Link";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Define items per page
    const [loading, setLoading] = useState(true);

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

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const currentProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <ArgonBox py={8} style={{ width: "100%" }}>
            <ArgonBox display="flex" justifyContent="space-between">
                <ArgonTypography variant="h3">Sản phẩm nổi bật</ArgonTypography>
                <MuiLink href="/Shop">
                    <ArgonTypography variant="h4">
                        Xem thêm <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </ArgonTypography>
                </MuiLink>
            </ArgonBox>
            <Box py={3}>
                {loading ? (
                    <div>Đang tải sản phẩm...</div>
                ) : products.length > 0 ? (
                    <>
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            justifyContent="flex-start"
                            sx={{
                                gap: 2, // Khoảng cách giữa các sản phẩm
                            }}
                        >
                            {currentProducts
                               .filter((product) => product.isActive)
                            .map(
                                (product, index) => (
                                <Box
                                    key={product.id || index}
                                    sx={{
                                        width: {
                                            xs: "100%", // Full width trên màn hình nhỏ
                                            sm: "48%", // Chiếm khoảng 50% trên màn hình trung bình
                                            md: "23%", // Chiếm khoảng 1/4 trên màn hình lớn
                                        },
                                    }}
                                >
                                    <HasagiCard2
                                        image={product.image}
                                        name={product.name}
                                        id={product.id}
                                        price={product.importPrice}
                                    />
                                </Box>
                            ))}
                        </Box>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "20px",
                            }}
                        >
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
                                    transition: "background-color 0.3s, transform 0.2s",
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
                                    padding: "5px 10px",
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
                                    transition: "background-color 0.3s, transform 0.2s",
                                }}
                            >
                                <FiChevronRight style={{ fontSize: "20px" }} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div>Không có sản phẩm nổi bật</div>
                )}
            </Box>
        </ArgonBox>
    );
}

export default FeaturedProducts;
