import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import 'layouts/assets/css/style.css';
import HasagiNav from "components/client/HasagiHeader";
import { useLocation, Link } from 'react-router-dom';
import Footer from "components/client/HasagiFooter";
import cartService from "../../../services/ProductDetail";
import Cookies from "js-cookie";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import reviewsService from "services/ReviewsServices";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { Modal, Box } from '@mui/material';
import ReviewList from "../HasagiReview/reviewList";

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
    const productId = query.get('id');
    const [favoriteCount, setFavoriteCount] = useState(0);
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [selectedStar, setSelectedStar] = useState(null);
    const [open, setOpen] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');

    const fetchReviews = async (productId) => {
        try {
            const productReviews = await reviewsService.getReviewsByProduct(productId);
            console.log('Fetched reviews for product:', productReviews);

            if (Array.isArray(productReviews)) {
                const sortedReviews = productReviews.sort((a, b) => b.star - a.star);
                setReviews(sortedReviews);
            } else {
                console.error('Expected an array but got:', productReviews);
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews for product:', error);
            setReviews([]);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const productId = query.get('id');

        if (productId) {
            fetchReviews(productId);
        }
    }, [location]);

    const getUniqueSizes = (sizes) => {
        return sizes.reduce((unique, size) => {
            if (!unique.some(item => item.id === size.id)) {
                unique.push(size);
            }
            return unique;
        }, []);
    };

    const getUniqueColors = (colors) => {
        return colors.reduce((unique, color) => {
            if (!unique.some(item => item.id === color.id)) {
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
        if (!product || !selectedColor || !selectedSize) {
            toast.error('Vui lòng chọn màu sắc và kích thước.');
            return;
        }

        try {
            cartService.addToCart({
                colorId: selectedColor,
                sizeId: selectedSize,
                quantity,
                productId,
            });
            Cookies.set('productId', productId);
            toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
        }
    };

    const fetchFavoriteCount = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/favorites/count`, {
                params: { productId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching favorite count:', error);
            return 0;
        }
    };
    const checkFavoriteStatus = async (productId) => {
        try {
            // Await the response from cartService.checkFavorite
            const favoriteResponse = await cartService.checkFavorite(productId);

            // Log the full response to check its structure
            console.log(favoriteResponse);

            // Ensure the data property exists and then use it
            if (favoriteResponse && favoriteResponse.data !== undefined) {
                setIsFavorite(favoriteResponse.data);  // This should now work
            } else {
                console.error('Favorite response is missing data');
            }
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };


    const fetchProductDetail = async () => {
        const accountId = Cookies.get('accountId');
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }
        try {
            if (!productId) throw new Error("Product ID is missing");
            const response = await cartService.getProductDetail(productId);
            const productData = response.data;
            console.log("Fetched Product Data:", productData);

            setProduct(productData);
            setTotalPrice(productData.importPrice);
            const countRSN = await fetchFavoriteCount(productId);
            setFavoriteCount(countRSN);
            checkFavoriteStatus(productId);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        fetchProductDetail();
        fetchReviews();
    }, [productId]);

    const fetchPrice = async (productId, colorId, sizeId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/product-detail/price`, {
                params: { productId, colorId, sizeId }
            });
            setTotalPrice(response.data * quantity); // cập nhật giá với số lượng
        } catch (error) {
            console.error('Error fetching price:', error);
            toast.error('Đã xảy ra lỗi khi lấy giá sản phẩm. Vui lòng thử lại sau.');
        }
    };

    // Gọi API để cập nhật giá mỗi khi chọn color hoặc size
    useEffect(() => {
        if (selectedColor && selectedSize) {
            fetchPrice(productId, selectedColor, selectedSize);
        }
    }, [selectedColor, selectedSize, quantity]);

    const handleAddFavorite = async () => {
        const accountId = Cookies.get('accountId');
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
            console.error('Error adding to favorites:', error.response?.data || error.message);
        }
    };

    const handleRemoveFavorite = async () => {
        const accountId = Cookies.get('accountId');
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
            console.error('Error removing from favorites:', error.response?.data || error.message);
        }
    };

    const handleByNow = async () => {
        if (!product || !selectedColor || !selectedSize) {
            toast.error('Vui lòng chọn màu sắc và kích thước.');
            return;
        }

        try {
            await cartService.addToCart({
                colorId: selectedColor,
                sizeId: selectedSize,
                quantity,
                productId,
            });
            navigate('/Cart')
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
        }
    };
    const [activeTab, setActiveTab] = useState('tab-pane-1');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
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
                <div className="row px-xl-5 py-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/feature-section">Trang chủ</a>
                            <a className="breadcrumb-item text-dark" href="/Shop">Sản phẩm</a>
                            <span className="breadcrumb-item active">Sản phẩm chi tiết</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid pb-5" style={{ maxWidth: "1400px" }}>
                <div className="row px-xl-5">
                    <div className="col-lg-5 mb-30">
                        <div className="product-thumbnail">
                            <img src={product.image} alt="" className="product-thumbnail-img" />
                        </div>
                    </div>
                    <div className="col-lg-7 h-auto mb-30">
                        <div className="h-100 bg-light p-30 pt-4">
                            <h3 className="font-weight-semi-bold mb-3" style={{ fontFamily: `"Times New Roman", Times, serif` }}>{product.name}</h3>
                            <div className="d-flex mb-3">
                                <div className="text-primary mr-3">
                                    <small className="fas fa-star"></small>
                                    <small className="fas fa-star"></small>
                                    <small className="fas fa-star"></small>
                                    <small className="fas fa-star-half-alt"></small>
                                    <small className="far fa-star"></small>
                                </div>
                                <small className="pt-1">(99 Reviews)</small>
                            </div>
                            <h3 className="font-weight-semi-bold mb-3" style={{ fontFamily: `"Times New Roman", Times, serif` }}>{totalPrice}</h3>
                            <h3 className="font-medium-semi-bold mb-3" style={{ fontFamily: `"Times New Roman", Times, serif` }}>Số lượng: {product.importQuantity || "N/A"}</h3>
                            <div className="d-flex mb-3" id="size-input-list">
                                <strong className="text-dark mr-3">Sizes:</strong>
                                {product.sizes.length > 0 ? (
                                    <form>
                                        {uniqueSizes.map((size) => (
                                            <div key={size.id} className="custom-control custom-radio custom-control-inline">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id={`size-${size.id}`}
                                                    name="size"
                                                    value={size.id}
                                                    onChange={(e) => setSelectedSize(e.target.value)} // Update size state
                                                />
                                                <label className="custom-control-label" htmlFor={`size-${size.id}`}>
                                                    {size.name}
                                                </label>
                                            </div>
                                        ))}
                                    </form>
                                ) : (
                                    <span>No sizes available.</span>
                                )}
                            </div>
                            <div className="d-flex mb-4" id="color-input-list">
                                <strong className="text-dark mr-3">Colors:</strong>
                                {product.colors.length > 0 ? (
                                    <form>
                                        {uniqueColors.map((color) => (
                                            <div key={color.id} className="custom-control custom-radio custom-control-inline">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id={`color-${color.id}`}
                                                    name="color"
                                                    value={color.id}
                                                    onChange={(e) => setSelectedColor(e.target.value)}
                                                />
                                                <label className="custom-control-label" htmlFor={`color-${color.id}`}>
                                                    {color.name}
                                                </label>
                                            </div>
                                        ))}
                                    </form>
                                ) : (
                                    <span>No colors available.</span>
                                )}
                            </div>

                            <div className="d-flex align-items-center mb-4 pt-1">
                                <div className="input-group quantity mr-3" style={{ width: '130px' }}>
                                    <div className="input-group-btn">
                                        <button
                                            className="btn btn-primary btn-minus"
                                            onClick={() => setQuantity(quantity - 1)}
                                            disabled={quantity <= 1}
                                            style={{ marginRight: '5px' }}
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input
                                        id="inputAmount"
                                        type="text"
                                        className="form-control bg-secondary border-0 text-center"
                                        value={quantity}
                                        readOnly
                                    />
                                    <div className="input-group-btn">
                                        <button
                                            className="btn btn-primary btn-plus"
                                            onClick={() => setQuantity(quantity + 1)}
                                            style={{ marginLeft: '5px' }}
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center py-1">
                                <button id="cartBtn" onClick={handleAddToCart} className="btn btn-primary px-3 mr-2">
                                    <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
                                </button>
                                <button className="btn btn-primary px-3" onClick={handleByNow}>
                                    Mua ngay
                                </button>
                            </div>
                            <div className="d-flex align-items-center py-2">
                                {isFavorite ? (
                                    <span
                                        onClick={handleRemoveFavorite}
                                        className="d-flex align-items-center"
                                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                    >
                                        <AiFillHeart size={24} className="text-danger" />
                                        <span style={{ marginLeft: '10px', color: 'black' }}>Yêu thích ({favoriteCount})</span>
                                    </span>
                                ) : (
                                    <span
                                        onClick={handleAddFavorite}
                                        className="d-flex align-items-center"
                                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                    >
                                        <AiOutlineHeart size={24} className="text-danger" />
                                        <span style={{ marginLeft: '10px', color: 'black' }}>Yêu thích ({favoriteCount})</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row px-xl-5">
                    <div className="col">
                        <div className="bg-light p-30">
                            <div className="nav nav-tabs mb-4">
                                <a
                                    className={`nav-item nav-link text-dark ${activeTab === 'tab-pane-1' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tab-pane-1')}
                                >
                                    Description
                                </a>
                                <a
                                    className={`nav-item nav-link text-dark ${activeTab === 'tab-pane-2' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tab-pane-2')}
                                >
                                    Information
                                </a>
                                <a
                                    className={`nav-item nav-link text-dark ${activeTab === 'tab-pane-3' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tab-pane-3')}
                                >
                                    Reviews ({reviews.length})
                                </a>
                            </div>
                            <div className="tab-content">
                                <div className={`tab-pane fade ${activeTab === 'tab-pane-1' ? 'show active' : ''}`} id="tab-pane-1">
                                    <h4 className="mb-3">Product Description</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea...</p>
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'tab-pane-2' ? 'show active' : ''}`} id="tab-pane-2">
                                    <h4 className="mb-3">Additional Information</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea...</p>
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'tab-pane-3' ? 'show active' : ''}`} id="tab-pane-3">
                                <ReviewList />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ShopDetail;
