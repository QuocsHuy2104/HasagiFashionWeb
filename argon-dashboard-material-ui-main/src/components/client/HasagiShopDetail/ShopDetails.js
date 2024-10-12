import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import 'layouts/assets/css/style.css';
import HasagiNav from "components/client/HasagiHeader";
import { useLocation, Link } from 'react-router-dom';
import Footer from "components/client/HasagiFooter";
import useCartQuantity from "../HasagiQuantity/useCartQuantity";
import cartService from "../../../services/ProductDetail";
import Cookies from "js-cookie";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
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
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();
    const navigate = useNavigate();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 700);
    }, []);
    const handleAddToCart = async () => {

        const accountId = Cookies.get('accountId');
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }

        if (!product || !selectedColor || !selectedSize) {
            toast.error('Vui lòng chọn màu sắc và kích thước.');
            return;
        }

        if (product.importQuantity <= 0) {
            toast.error("Sản phẩm đã hết hàng!");
            return;
        }

        try {
            const response = await cartService.addToCart({
                accountId,
                colorId: selectedColor,
                sizeId: selectedSize,
                quantity,
                productId,
                price: product.importPrice,
            });

            if (response.status === 201 || response.status === 200) {
                Cookies.set('productId', productId);
                fetchTotalQuantity();
                toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');
                console.log('Cart updated:', response.data);
            } else {
                toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
            }
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
            const countRSN = await fetchFavoriteCount(productId);
            setFavoriteCount(countRSN);
            const favoriteResponse = await axios.get(`http://localhost:8080/api/favorites/check?accountId=${accountId}`, {
                params: { productId },
                withCredentials: true
            });
            setIsFavorite(favoriteResponse.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [productId]);

    useEffect(() => {
        if (product) {
            setTotalPrice(product.importPrice * quantity);
        }
    }, [quantity, product]);


    const handleAddFavorite = async () => {
        const accountId = Cookies.get('accountId');
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }
        if (!product) return;
        try {
            await axios.post(`http://localhost:8080/api/favorites?accountId=${accountId}`, {
                productId: product.id
            }, { withCredentials: true });
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
            const response = await axios.delete(`http://localhost:8080/api/favorites/${productId}?accountId=${accountId}`, {

                withCredentials: true
            });
            if (response.status === 204) {
                setIsFavorite(false);
                // Fetch the updated favorite count
                const count = await fetchFavoriteCount(productId);
                setFavoriteCount(count);
            } else {
                console.error('Failed to remove from favorites');
            }
        } catch (error) {
            console.error('Error removing from favorites:', error.response?.data || error.message);
        }
    };

    const handleByNow = async () => {

        const accountId = Cookies.get('accountId');
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }

        if (!product || !selectedColor || !selectedSize) {
            toast.error('Vui lòng chọn màu sắc và kích thước.');
            return;
        }

        try {
            const response = await cartService.addToCart({
                accountId,
                colorId: selectedColor,
                sizeId: selectedSize,
                quantity,
                productId,
                price: product.importPrice,
            });

            if (response.status === 201 || response.status === 200) {
                fetchTotalQuantity();
                toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');
                navigate('/Cart')
                console.log('Cart updated:', response.data);
            } else {
                toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
        }
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
                            <h3 className="font-weight-semi-bold mb-3" style={{ fontFamily: `"Times New Roman", Times, serif` }}>{product.importPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h3>
                            <h3 className="font-medium-semi-bold mb-3" style={{ fontFamily: `"Times New Roman", Times, serif` }}>Số lượng: {product.importQuantity || "N/A"}</h3>
                            <div className="d-flex mb-3" id="size-input-list">
                                <strong className="text-dark mr-3">Sizes:</strong>
                                {product.sizes.length > 0 ? (
                                    <form>
                                        {product.sizes.map((size) => (
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
                                        {product.colors.map((color) => (
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
                
            </div>
            <Footer />
        </>
    )
}

export default ShopDetail;
