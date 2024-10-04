import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus, AiFillStar, AiOutlineShoppingCart, AiOutlineSearch, AiFillHeart, AiOutlineDoubleRight, AiOutlineHeart } from 'react-icons/ai';
import aboutImage from "components/client/assets/images/k1r.jpg";
import Footer from "components/client/HasagiFooter";
import "components/client/assets/css/ShopDetail.css";
import "components/client/assets/css/style.css";
import ArgonButton from "components/ArgonButton";
import HasagiNav from "components/client/HasagiHeader";
import cartService from "../../../services/ProductDetail";
import Cookies from "js-cookie";
const mockReviews = [
    { id: 1, username: 'User1', rating: 5, comment: 'Excellent product!' },
    { id: 2, username: 'User2', rating: 4, comment: 'Very good, but could be improved.' },
    { id: 3, username: 'User3', rating: 3, comment: 'It\'s okay, but not what I expected.' },
];

const ShopDetail = () => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [reviews, setReviews] = useState(mockReviews);
    const [newReview, setNewReview] = useState("");
    const location = useLocation();
    const [isFavorite, setIsFavorite] = useState(false);
    const query = new URLSearchParams(location.search);
    const productId = query.get('id');
    const [favoriteCount, setFavoriteCount] = useState(0);
    const handleAddToCart = async () => {
       
        const accountId =Cookies.get('accountId');
      
        if (!accountId) {
          alert("You need to log in before adding products to the cart.");
          return;
        }
    
        if (!product || !selectedColor || !selectedSize) {
          alert('Please select color and size');
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
            console.log('Cart updated:', response.data);
          } else {
            alert('Failed to add product to cart. Please try again.');
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          alert('An error occurred while adding the product to the cart. Please try again later.');
        }
      };
      

    const fetchProductDetail = async () => {
        try {
            if (!productId) throw new Error("Product ID is missing");

            const response = await cartService.getProductDetail(productId);
            const productData = response.data;
            console.log("Fetched Product Data:", productData);

            setProduct(productData);

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

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (newReview.trim()) {
            setReviews([...reviews, { id: reviews.length + 1, username: 'Anonymous', rating: 5, comment: newReview }]);
            setNewReview("");
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <>
            <HasagiNav />
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Shop Detail</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/Shop">Shop</Link></li>
                    <li className="breadcrumb-item active text-white">Shop Detail</li>
                </ol>
            </div>

            <div className="container-fluid py-0 mt-0">
                <div className="container py-3">
                    <div className="row g-4 mb-5">
                        <div className="col-lg-12">
                            <div className="row g-4">
                                <div className="col-lg-6">
                                    <div className="border rounded">
                                        <img src={product.image || aboutImage} className="img-fluid rounded" alt={product.name} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="border rounded p-4">
                                        <h4 className="fw-bold mb-3">Name: {product.name}</h4>
                                        <p className="mb-3">Id: {product.id || "N/A"}</p>
                                        <p className="mb-3">Category: {product.category?.name || "N/A"}</p>
                                        <p className="mb-3">Brand: {product.trademark || "N/A"}</p>
                                        <p className="mb-3">Price: {product.importPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                        <p className="mb-3">Available Quantity: {product.importQuantity || "N/A"}</p>

                                        <p className="mb-3">
                                            Colors:
                                            {product.colors.length > 0 ? (
                                                <select className="form-select ms-2" onChange={(e) => setSelectedColor(e.target.value)}>
                                                    <option value="">Select color</option>
                                                    {product.colors.map((color) => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.color}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span> No colors available.</span>
                                            )}
                                        </p>
                                        <p className="mb-3">
                                            Sizes:
                                            {product.sizes.length > 0 ? (
                                                <select className="form-select ms-2" onChange={(e) => setSelectedSize(e.target.value)}>
                                                    <option value="">Select size</option>
                                                    {product.sizes.map((size) => (
                                                        <option key={size.id} value={size.id}>
                                                            {size.size}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span> No sizes available.</span>
                                            )}
                                        </p>

                                        <div className="d-flex align-items-center mb-3">
                                            <button
                                                className="btn btn-outline-primary me-2"
                                                onClick={() => setQuantity(quantity - 1)}
                                                disabled={quantity <= 1}
                                            >
                                                <AiOutlineMinus size={16} />
                                            </button>
                                            <span className="mx-2" style={{ minWidth: '2.5rem', textAlign: 'center' }}>{quantity}</span>
                                            <button
                                                className="btn btn-outline-primary ms-2"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                <AiOutlinePlus size={16} />
                                            </button>
                                        </div>

                                        <ArgonButton color="primary" onClick={handleAddToCart}>
                                            Add to Cart
                                        </ArgonButton>
                                        <Link to={'/Cart'} className="btn moderate-btn moderate-btn-orange">
                                            Buy Now
                                        </Link>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h4 className="fw-bold mb-4">Product Reviews</h4>
                    <div className="row">
                        <div className="col-lg-8">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="border rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="fw-bold">{review.username}</h6>
                                            <span className="text-warning">{Array(review.rating).fill().map((_, i) => <AiFillStar key={i} />)}</span>
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                        <div className="col-lg-4">
                            <h5 className="fw-bold mb-3">Leave a Review</h5>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                        placeholder="Write your review here..."
                                    />
                                </div>
                                <ArgonButton type="submit" color="primary">Submit</ArgonButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ShopDetail;
