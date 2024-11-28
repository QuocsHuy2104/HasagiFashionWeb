import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "layouts/assets/css/style.css";
import HasagiNav from "components/client/HasagiHeader";
import { useLocation, Link } from "react-router-dom";
import Footer from "components/client/HasagiFooter";
import cartService from "../../../services/ProductDetail";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import reviewsService from "services/ReviewsServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import ReviewList from "../HasagiReview/reviewList";
import aboutImage from "layouts/assets/img/h1.jpg";

function ShopDetail() {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const location = useLocation();
    const [isFavorite, setIsFavorite] = useState(false);
    const query = new URLSearchParams(location.search);
    const productId = query.get("id");
    const [favoriteCount, setFavoriteCount] = useState(0);
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [quantityPDT, setQuantityPDT] = useState(0);

    const fetchReviews = async (productId) => {
        try {
            const productReviews = await reviewsService.getReviewsByProduct(productId);
            console.log("Fetched reviews for product:", productReviews);

            if (Array.isArray(productReviews)) {
                const sortedReviews = productReviews.sort((a, b) => b.star - a.star);
                setReviews(sortedReviews);
            } else {
                console.error("Expected an array but got:", productReviews);
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews for product:", error);
            setReviews([]);
        }
    };

    const calculateAverageStars = () => {
        if (reviews.length === 0) return 0;

        const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / reviews.length).toFixed(1);
    };

    const averageStars = calculateAverageStars();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const productId = query.get("id");

        if (productId) {
            fetchReviews(productId);
        }
    }, [location]);

    const getUniqueSizes = (sizes) => {
        return sizes.reduce((unique, size) => {
            if (!unique.some((item) => item.id === size.id)) {
                unique.push(size);
            }
            return unique;
        }, []);
    };

    const getUniqueColors = (colors) => {
        return colors.reduce((unique, color) => {
            if (!unique.some((item) => item.id === color.id)) {
                unique.push(color);
            }
            return unique;
        }, []);
    };

    const uniqueSizes = product ? getUniqueSizes(product.sizes) : [];
    const uniqueColors = product ? getUniqueColors(product.colors) : [];

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 700);
    }, []);

    const handleAddToCart = async () => {
        try {
            cartService.addToCart({
                colorId: selectedColor,
                sizeId: selectedSize,
                quantity,
                productId,
            });
            toast.success("Sản phẩm đã được thêm vào giỏ hàng thành công!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
        }
    };

    const fetchFavoriteCount = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/favorites/count`, {
                params: { productId },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching favorite count:", error);
            return 0;
        }
    };
    const checkFavoriteStatus = async (productId) => {
        try {
            // Await the response from cartService.checkFavorite
            const favoriteResponse = await cartService.checkFavorite(productId);

            console.log(favoriteResponse);

            if (favoriteResponse && favoriteResponse.data !== undefined) {
                setIsFavorite(favoriteResponse.data);
            } else {
                console.error("Favorite response is missing data");
            }
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    const fetchProductDetail = async () => {
       
        try {
            if (!productId) throw new Error("Product ID is missing");
            const response = await cartService.getProductDetail({
                productId,
                sizeId: selectedSize || null,
                colorId: selectedColor || null,
            });
            const productData = response.data;
            console.log("Fetched Product Data:", productData);

            setProduct(productData);
            setTotalPrice(productData.importPrice);
            if (selectedColor && selectedSize) {
                fetchPrice(productId, selectedColor, selectedSize);
            }
            console.log("Total Price Set To:", productData.importPrice);
            setQuantityPDT(productData.importQuantity);
            const countRSN = await fetchFavoriteCount(productId);
            setFavoriteCount(countRSN);
            checkFavoriteStatus(productId);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId, selectedSize, selectedColor]);

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const fetchPrice = async (productId, colorId, sizeId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/public/webShopDetail/price`, {
                params: { productId, colorId, sizeId },
            });
            const { price, quantity } = response.data;
            setTotalPrice(price);
            setQuantityPDT(quantity);
        } catch (error) {
            console.error("Error fetching price:", error);
            toast.error("Đã xảy ra lỗi khi lấy giá sản phẩm. Vui lòng thử lại sau.");
        }
    };

    useEffect(() => {
        if (selectedColor && selectedSize) {
            fetchPrice(productId, selectedColor, selectedSize);
        }
        if (!selectedColor) {
            fetchProductDetail();
        }
    }, [selectedColor, selectedSize, quantity]);

    const handleAddFavorite = async () => {
        const accountId = Cookies.get("accountId");
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }
        if (!product) return;
        try {
            await cartService.addToFavorites(product.id);
            setIsFavorite(true);
            const count = await fetchFavoriteCount(product.id);
            setFavoriteCount(count);
        } catch (error) {
            console.error("Error adding to favorites:", error.response?.data || error.message);
        }
    };

    const handleRemoveFavorite = async () => {
        const accountId = Cookies.get("accountId");
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }
        if (!product) return;
        try {
            const productId = product.id;
            await cartService.removeFromFavorites(productId);
            setIsFavorite(false);
            const count = await fetchFavoriteCount(productId);
            setFavoriteCount(count);
        } catch (error) {
            console.error("Error removing from favorites:", error.response?.data || error.message);
        }
    };

    const handleByNow = async () => {
        try {
            await cartService.addToCart({
                colorId: selectedColor,
                sizeId: selectedSize,
                quantity,
                productId,
            });
            navigate("/Cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    const [activeTab, setActiveTab] = useState("tab-pane-1");

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const formatImportPrice = (importPrice) => {
        if (typeof importPrice === "number") {
            return new Intl.NumberFormat("vi-VN").format(importPrice);
        }
        if (!importPrice || typeof importPrice !== "string" || !importPrice.includes("-")) {
            return "N/A";
        }
        const [minPrice, maxPrice] = importPrice.split("-").map((price) => parseFloat(price));
        return minPrice === maxPrice
            ? new Intl.NumberFormat("vi-VN").format(minPrice)
            : `${new Intl.NumberFormat("vi-VN").format(minPrice)} - ${new Intl.NumberFormat(
                "vi-VN"
            ).format(maxPrice)}`;
    };

    const formattedPrice = formatImportPrice(totalPrice);

    const renderStars = (average) => {
        const fullStars = Math.floor(average);
        const partialStar = average % 1;
        const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

        return (
            <div style={{ display: "flex", gap: "5px" }}>
                {Array.from({ length: fullStars }).map((_, index) => (
                    <FontAwesomeIcon
                        key={`full-${index}`}
                        icon={solidStar}
                        style={{ color: "orange", fontSize: "20px" }}
                    />
                ))}

                {partialStar > 0 && (
                    <div style={{ position: "relative", width: "24px", overflow: "hidden" }}>
                        <FontAwesomeIcon
                            icon={regularStar}
                            style={{
                                color: "#ccc",
                                fontSize: "20px",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                clipPath: `inset(0 ${100 - partialStar * 100}% 0 0)`,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={solidStar}
                                style={{
                                    color: "orange",
                                    fontSize: "20px",
                                    width: "100%",
                                    height: "100%",
                                    marginBottom: "8px",
                                }}
                            />
                        </div>
                    </div>
                )}

                {Array.from({ length: emptyStars }).map((_, index) => (
                    <FontAwesomeIcon
                        key={`empty-${index}`}
                        icon={regularStar}
                        style={{ color: "#ccc", fontSize: "20px" }}
                    />
                ))}
            </div>
        );
    };

    if (!product) return <div></div>;

    return (
        <>
            {isLoading && (
                <div className="loader">
                    <div className="loader-inner">
                        <div className="circle"></div>
                    </div>
                </div>
            )}
            <HasagiNav />
            <ToastContainer />
            <div className="container-fluid">
                <div className="row px-xl-5" style={{ marginTop: "90px" }}>
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/feature-section">
                                Trang chủ
                            </a>
                            <a className="breadcrumb-item text-dark" href="/Shop">
                                Sản phẩm
                            </a>
                            <span className="breadcrumb-item active">Sản phẩm chi tiết</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid pb-5" style={{ maxWidth: "1400px" }}>
                <div className="row px-xl-5" style={{ marginLeft: "10px" }}>
                    <div className="col-lg-5 mb-30">
                        <div className="product-thumbnail" style={{ textAlign: "center" }}>
                            {/* Main Image */}
                            <img
                                src={product.image}
                                alt="Product"
                                className="product-thumbnail-img"
                                style={{ width: "100%", maxWidth: "450px", maxHeight: "450px" }}
                            />
                            {/* Thumbnail Gallery */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                    marginTop: "10px",
                                }}
                            >
                                {[aboutImage, aboutImage, aboutImage, aboutImage].map((thumbnail, index) => (
                                    <img
                                        key={index}
                                        src={thumbnail}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: "106px",
                                            height: "100px",
                                            cursor: "pointer",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                        }}
                                        onClick={() => setMainImage(thumbnail)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 mb-30" style={{ marginLeft: "-20px" }}>
                        <div className="h-100 bg-white p-30 pt-4">
                            <h3
                                className="font-weight-semi-bold mb-3"
                                style={{ fontFamily: `"Times New Roman", Times, serif` }}
                            >
                                {product.name}
                            </h3>
                            <div className="d-flex align-items-center mb-3">
                                {/* Phần hiển thị số sao và sao */}
                                <div className="d-flex align-items-center">
                                    <span
                                        style={{
                                            color: "#555",
                                            fontWeight: "bold",
                                            marginRight: "5px",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {averageStars}
                                    </span>
                                    <div>{renderStars(averageStars)}</div>
                                </div>

                                {/* Đường phân cách */}
                                <div
                                    style={{
                                        height: "16px",
                                        width: "1px",
                                        backgroundColor: "#ddd",
                                        margin: "0 10px",
                                    }}
                                />

                                {/* Phần hiển thị số lượng đánh giá */}
                                <div className="d-flex align-items-center">
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            marginRight: "3px",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {reviews.length}
                                    </span>
                                    <small>Đánh Giá</small>
                                </div>
                            </div>

                            <h3
                                style={{
                                    fontFamily: `"Times New Roman", Times, serif`,
                                    color: "red",
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                    position: "relative",
                                    display: "inline-block",
                                    marginLeft: "15px",
                                }}
                            >
                                <span
                                    style={{
                                        textDecoration: "underline",
                                        fontSize: "18px",
                                        fontWeight: "normal",
                                        position: "absolute",
                                        top: 0,
                                        left: "-10px",
                                    }}
                                >
                                    đ
                                </span>
                                {formattedPrice}
                            </h3>

                            <h3
                                className="font-medium-semi-bold mb-3"
                                style={{ fontFamily: `"Times New Roman", Times, serif` }}
                            >
                                {quantityPDT}
                            </h3>
                            <div className="d-flex mb-3" id="size-input-list">
                                <strong className="text-dark mr-3">Sizes:</strong>
                                {product.sizes.length > 0 ? (
                                    <div>
                                        {uniqueSizes.map((size) => (
                                            <button
                                                key={size.id}
                                                className={`variant-button ${selectedSize === size.id ? "selected" : ""} ${!size.check ? "disabled" : ""
                                                    }`}
                                                onClick={() =>
                                                    setSelectedSize((prevSelected) =>
                                                        prevSelected === size.id ? null : size.id
                                                    )
                                                }
                                                style={{
                                                    marginRight: "10px",
                                                    cursor: !size.check ? "not-allowed" : "pointer",
                                                    opacity: !size.check ? 0.5 : 1,
                                                }}
                                                disabled={!size.check}
                                            >
                                                {size.name}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <span>No sizes available.</span>
                                )}
                            </div>
                            <div className="d-flex mb-4" id="color-input-list">
                                <strong className="text-dark mr-3">Colors:</strong>
                                {product.colors.length > 0 ? (
                                    <div>
                                        {uniqueColors.map((color) => (
                                            <button
                                                key={color.id}
                                                className={`variant-button ${selectedColor === color.id ? "selected" : ""
                                                    } ${!color.check ? "disabled" : ""}`}
                                                onClick={() =>
                                                    setSelectedColor((prevSelected) =>
                                                        prevSelected === color.id ? null : color.id
                                                    )
                                                }
                                                style={{
                                                    marginRight: "10px",
                                                    cursor: !color.check ? "not-allowed" : "pointer",
                                                    opacity: !color.check ? 0.5 : 1,
                                                }}
                                                disabled={!color.check}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <span>No colors available.</span>
                                )}
                            </div>

                            <div className="d-flex align-items-center mb-4 pt-1">
                                <strong className="text-dark mr-3">Số lượng:</strong>
                                <div className="input-group quantity mr-3" style={{ width: "130px" }}>
                                    <div className="input-group-btn">
                                        <button
                                            className="btn btn-primary btn-minus"
                                            onClick={() => setQuantity(quantity - 1)}
                                            disabled={quantity <= 1}
                                            style={{ marginRight: "5px", backgroundColor: "#ffb524" }}
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input
                                        id="inputAmount"
                                        type="text"
                                        className="form-control bg-white border-0 text-center"
                                        value={quantity}
                                        readOnly
                                    />
                                    <div className="input-group-btn">
                                        <button
                                            className="btn btn-primary btn-plus"
                                            onClick={() => setQuantity(quantity + 1)}
                                            style={{ marginLeft: "5px", backgroundColor: "#ffb524" }}
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center py-1">
                                <button
                                    id="cartBtn"
                                    onClick={handleAddToCart}
                                    className="btn btn-warning px-3 mr-2"
                                >
                                    <i className="fa fa-shopping-cart mr-1"></i> thêm vào giỏ hàng
                                </button>
                                <button className="btn btn-warning px-3" onClick={handleByNow}>
                                    Mua ngay
                                </button>
                            </div>
                            <div className="d-flex align-items-center py-2">
                                {isFavorite ? (
                                    <span
                                        onClick={handleRemoveFavorite}
                                        className="d-flex align-items-center"
                                        style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                                    >
                                        <AiFillHeart size={24} className="text-danger" />
                                        <span style={{ marginLeft: "10px", color: "black" }}>
                                            Yêu thích ({favoriteCount})
                                        </span>
                                    </span>
                                ) : (
                                    <span
                                        onClick={handleAddFavorite}
                                        className="d-flex align-items-center"
                                        style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                                    >
                                        <AiOutlineHeart size={24} className="text-danger" />
                                        <span style={{ marginLeft: "10px", color: "black" }}>
                                            Yêu thích ({favoriteCount})
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row px-xl-5">
                    <div className="col">
                        <div className="bg-light" style={{ marginBottom: "-50px" }}>
                            <div className="nav nav-tabs mb-4">
                                <a
                                    className={`nav-item nav-link text-dark ${activeTab === "tab-pane-1" ? "active" : ""
                                        }`}
                                    onClick={() => handleTabClick("tab-pane-1")}
                                >
                                    Chi tiết sản phẩm
                                </a>
                                <a
                                    className={`nav-item nav-link text-dark ${activeTab === "tab-pane-2" ? "active" : ""
                                        }`}
                                    onClick={() => handleTabClick("tab-pane-2")}
                                >
                                    Mô tả sản phẩm
                                </a>
                                <a
                                    className={`nav-item nav-link text-dark ${activeTab === "tab-pane-3" ? "active" : ""
                                        }`}
                                    onClick={() => handleTabClick("tab-pane-3")}
                                >
                                    Đánh giá ({reviews.length})
                                </a>
                            </div>
                            <div className="tab-content">
                                <div
                                    className={`tab-pane fade ${activeTab === "tab-pane-1" ? "show active" : ""}`}
                                    id="tab-pane-1"
                                >
                                    <p>Danh mục: {product.category}</p>
                                    <p>Kho: {product.importQuantity || "N/A"}</p>
                                    <p>Thương hiệu: {product.trademark}</p>
                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === "tab-pane-2" ? "show active" : ""}`}
                                    id="tab-pane-2"
                                >
                                    <p>{product.description}</p>
                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === "tab-pane-3" ? "show active" : ""}`}
                                    id="tab-pane-3"
                                >
                                    <ReviewList />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ShopDetail;
