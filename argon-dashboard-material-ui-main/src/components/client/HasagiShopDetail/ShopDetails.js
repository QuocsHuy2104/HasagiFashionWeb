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
            return 0; // Default value if there's an error
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


    const handleAddFavorite = async () => {
        if (!product) return;

        try {
            // Gửi yêu cầu thêm vào danh sách yêu thích
            await axios.post('http://localhost:8080/api/favorites', {
                productId: product.id
            }, { withCredentials: true }); // Gửi cookie cùng với yêu cầu

            setIsFavorite(true); // Cập nhật trạng thái yêu thích

            // Fetch the updated favorite count
            const count = await fetchFavoriteCount(product.id);
            setFavoriteCount(count);
        } catch (error) {
            console.error('Error adding to favorites:', error.response?.data || error.message);
        }
    };

    const handleRemoveFavorite = async () => {
        if (!product) return;

        try {
            const productId = product.id;

            const response = await axios.delete(`http://localhost:8080/api/favorites/${productId}`, {
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
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/feature-section">Home</a>
                            <a className="breadcrumb-item text-dark" href="/Shop">Shop</a>
                            <span className="breadcrumb-item active">Shop Detail</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid pb-5" style={{maxWidth: "1400px"}}>
                <div className="row px-xl-5">
                    <div className="col-lg-5 mb-30">
                        <div className="product-thumbnail">
                            <img src={product.image} alt="" className="product-thumbnail-img" />
                        </div>
                    </div>
                    <div className="col-lg-7 h-auto mb-30">
                        <div className="h-100 bg-light p-30 pt-4">
                            <h3 className="font-weight-semi-bold mb-3">{product.name}</h3>
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
                                                    id={`size-${size}`}
                                                    name="size"
                                                    value={size.id}
                                                    onChange={(e) => setSelectedSize(e.target.value)} // Update size state
                                                />
                                                <label className="custom-control-label" htmlFor={`size-${size}`}>
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
                                                    id={`color-${color.id}`} // Unique ID for each color
                                                    name="color" // Grouping radio buttons
                                                    value={color.id} // Value set to color ID
                                                    onChange={(e) => setSelectedColor(e.target.value)} // Update selected color state
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
                                        <button className="btn btn-primary btn-minus" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
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
                                        <button className="btn btn-primary btn-plus" onClick={() => setQuantity(quantity + 1)}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="d-flex align-items-center py-1">
                            <button id="cartBtn" onClick={handleAddToCart} className="btn btn-primary px-3 mr-2">
                                <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
                            </button>
                            <Link to="/Cart" className="btn btn-primary px-3" onClick={handleAddToCart}>
                                Mua ngay
                            </Link>
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
                                <a className="nav-item nav-link text-dark active" data-toggle="tab"
                                    href="#tab-pane-1">Description</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Information</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Reviews (0)</a>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane fade show active" id="tab-pane-1">
                                    <h4 className="mb-3">Product Description</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam
                                        invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod
                                        consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum
                                        diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam
                                        sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor
                                        aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam
                                        kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.
                                    </p>
                                    <p>Dolore magna est eirmod sanctus dolor, amet diam et eirmod et ipsum. Amet dolore tempor
                                        consetetur sed lorem dolor sit lorem tempor. Gubergren amet amet labore sadipscing clita
                                        clita diam clita. Sea amet et sed ipsum lorem elitr et, amet et labore voluptua sit
                                        rebum. Ea erat sed et diam takimata sed justo. Magna takimata justo et amet magna et.
                                    </p>
                                </div>
                                <div className="tab-pane fade" id="tab-pane-2">
                                    <h4 className="mb-3">Additional Information</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam
                                        invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod
                                        consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum
                                        diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam
                                        sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor
                                        aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam
                                        kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.
                                    </p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item px-0">
                                                    Sit erat duo lorem duo ea consetetur, et eirmod takimata.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Amet kasd gubergren sit sanctus et lorem eos sadipscing at.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Duo amet accusam eirmod nonumy stet et et stet eirmod.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Takimata ea clita labore amet ipsum erat justo voluptua. Nonumy.
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item px-0">
                                                    Sit erat duo lorem duo ea consetetur, et eirmod takimata.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Amet kasd gubergren sit sanctus et lorem eos sadipscing at.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Duo amet accusam eirmod nonumy stet et et stet eirmod.
                                                </li>
                                                <li className="list-group-item px-0">
                                                    Takimata ea clita labore amet ipsum erat justo voluptua. Nonumy.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="tab-pane-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="mb-4">1 review for Product Name</h4>
                                            <div className="media mb-4">
                                                <img src="img/user.jpg" alt="Image" className="img-fluid mr-3 mt-1"
                                                    style={{ width: '45px' }} />
                                                <div className="media-body">
                                                    <h6>John Doe<small> - <i>01 Jan 2045</i></small></h6>
                                                    <div className="text-primary mb-2">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star-half-alt"></i>
                                                        <i className="far fa-star"></i>
                                                    </div>
                                                    <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam
                                                        ipsum et no at. Kasd diam tempor rebum magna dolores sed sed eirmod
                                                        ipsum.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h4 className="mb-4">Leave a review</h4>
                                            <small>Your email address will not be published. Required fields are marked
                                                *</small>
                                            <div className="d-flex my-3">
                                                <p className="mb-0 mr-2">Your Rating * :</p>
                                                <div className="text-primary">
                                                    <i className="far fa-star"></i>
                                                    <i className="far fa-star"></i>
                                                    <i className="far fa-star"></i>
                                                    <i className="far fa-star"></i>
                                                    <i className="far fa-star"></i>
                                                </div>
                                            </div>
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="message">Your Review *</label>
                                                    <textarea id="message" cols="30" rows="5" className="form-control"></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name">Your Name *</label>
                                                    <input type="text" className="form-control" id="name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Your Email *</label>
                                                    <input type="email" className="form-control" id="email" />
                                                </div>
                                                <div className="form-group mb-0">
                                                    <input type="submit" value="Leave Your Review" className="btn btn-primary px-3" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
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
