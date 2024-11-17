import React, { useState, useEffect } from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Backup from "components/client/HasagiBackup";
import ColorSelectionModal from "../HasagiPhanLoai";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import aboutImage from "layouts/assets/img/shopping.png";
import CartService from "../../../services/CartService";
import styled from "styled-components";
import ProductService from "services/ProductServices";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accountExists, setAccountExists] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [cartSizesForColor, setCartSizesForColor] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [currentCartDetailId, setCurrentCartDetailId] = useState(null);
    const [currentProductId, setCurrentProductId] = useState(null);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        const accountId = Cookies.get("accountId");

        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }

        try {
            const [cartResponse, addressResponse] = await Promise.all([
                CartService.getCart(),
                axios.get(`http://localhost:3000/api/addresses/exists?accountId=${accountId}`, {
                    withCredentials: true,
                }),
            ]);
            setCartItems(cartResponse.data);
            setAccountExists(addressResponse.data.exists);
            setAddress(addressResponse.data.addressId);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const calculateSubtotal = () => {
        return cartItems
            .filter((item) => item.selected)
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const subtotal = calculateSubtotal();
    const total = subtotal;

    const handleQuantityChange = async (itemId, change) => {
        const updatedCartItems = cartItems.map((item) =>
            item.cartdetailid === itemId
                ? { ...item, quantity: Math.max(1, item.quantity + change) }
                : item
        );
        setCartItems(updatedCartItems);
        try {
            const updatedItem = updatedCartItems.find((item) => item.cartdetailid === itemId);
            await axios.put(`http://localhost:3000/api/cart/update/${updatedItem.cartdetailid}`, null, {
                params: { quantity: updatedItem.quantity },
            });
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        const accountId = Cookies.get("accountId");
        try {
            await axios.delete(`http://localhost:3000/api/cart/remove/${itemId}?accountId=${accountId}`);
            setCartItems(cartItems.filter((item) => item.cartdetailid !== itemId));
            toast.success("Xóa sản phẩm thành công.");
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Error removing item.");
        }
    };

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map((item) => ({ ...item, selected: newSelectAll })));
    };

    const handleCheckboxChange = (itemId) => {
        const updatedCartItems = cartItems.map((item) =>
            item.cartdetailid === itemId ? { ...item, selected: !item.selected } : item
        );
        setCartItems(updatedCartItems);

        const allSelected = updatedCartItems.every((item) => item.selected);
        setSelectAll(allSelected);
    };

    const handleCheckout = () => {
        const selectedItems = cartItems.filter((item) => item.selected);
        if (selectedItems.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
            return;
        }
        localStorage.setItem("cartItemsBackup", JSON.stringify(selectedItems));
        if (!accountExists) {
            setShowBackupModal(true);
        } else {
            navigate(`/Checkout?id=${address}`);
            toast.success("Chuyển đến trang thanh toán.");
        }
    };

    const handleCloseBackupModal = () => {
        setShowBackupModal(false);
        if (accountExists) {
            navigate(`/Checkout?id=${address}`);
            toast.success("Chuyển đến trang thanh toán.");
        }
    };

    const handleDeleteSelected = async () => {
        const selectedIds = cartItems.filter((item) => item.selected).map((item) => item.cartdetailid);
        if (selectedIds.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để xóa.");
            return;
        }
        try {
            await axios.delete("http://localhost:8080/api/cart/delete", { data: selectedIds });
            setCartItems(cartItems.filter((item) => !selectedIds.includes(item.cartdetailid)));
            setSelectAll(false);
            toast.success("Xóa sản phẩm thành công.");
        } catch (error) {
            console.error("Error deleting items:", error);
            toast.error("Có lỗi xảy ra khi xóa sản phẩm.");
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleColorSelect = (color) => {
        const updatedItems = cartItems.map((item) =>
            item.cartdetailid === currentProductId ? { ...item, color } : item
        );
        setCartItems(updatedItems);
        setModalOpen(false);
        fetchCartItems();
    };

    const handleSizeSelect = (size) => {
        const updatedItems = cartItems.map((item) =>
            item.cartdetailid === currentProductId ? { ...item, size } : item
        );
        setCartItems(updatedItems);
        setModalOpen(false);
        fetchCartItems();
    };

    const toggleModal = (itemId) => {
        const currentItem = cartItems.find((item) => item.cartdetailid === itemId);
        if (currentItem) {
            setSelectedColor(currentItem.colorId);
            setSelectedSize(currentItem.sizeId);
            setCurrentProductId(currentItem.productId);
            setCurrentCartDetailId(currentItem.cartdetailid);
            const cartSizesForColor = cartItems
                .filter((item) => item.color === currentItem.color)
                .map((item) => item.sizeId);
            setCartSizesForColor(cartSizesForColor);
            setModalOpen(true);
        }
    };

    const countSelectedItems = () => {
        return cartItems.filter((item) => item.selected).length;
    };

    const goBack = () => {
        const productId = Cookies.get("productId");

        if (!productId) {
            navigate("/feature-section");
        } else {
            navigate(`/ShopDetail?id=${productId}`);
        }
    };

    // Container for the main content
    const Container = styled.div`
margin-top: 20px;
padding: 0 10px;
`;

    // Title component styling
    const Title = styled.h6`
color: rgba(0, 0, 0, 0.54);
font-size: 1.3rem;
font-weight: 500;
padding-bottom: 1rem;
`;

    // Grid container for displaying products
    const ProductGrid = styled.div`
display: grid;
grid-template-columns: repeat(5, 1fr); /* 5 products per row */
gap: 10px; /* Optional: add spacing between cards */
`;

    // Product card styling
    const ProductCard = styled.div`
width: 95%;
height: 365px;
cursor: pointer;
border: 1px solid #ddd;
border-radius: 8px;
overflow: hidden;
background-color: #fff;
transition: transform 0.3s;
position: relative;

&:hover {
  transform: scale(1.05);
}
`;

    // Product image styling
    const ProductImage = styled.img`
width: 100%;
height: 250px;
object-fit: cover; /* Ensures image scales properly */
`;

    // Badge component styling for special offers or discounts
    const Badge = styled.div`
position: absolute;
top: 10px;
left: 10px;
background-color: #ff4d4f;
color: #fff;
font-size: 0.8rem;
font-weight: bold;
padding: 2px 5px;
border-radius: 3px;
`;

    // Container for product information
    const ProductInfo = styled.div`
padding: 10px;
`;

    // Product title styling
    const ProductTitle = styled.h6`
font-size: 0.9rem;
color: #333;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
margin-bottom: -5px;
text-align: center;
`;

    // Discount information styling
    const Discount = styled.p`
color: #ff6600;
font-weight: bold;
font-size: 0.8rem;
margin-top: 5px;
`;

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <ToastContainer />
            {isLoading && (
                <div className="loader">
                    <div className="loader-inner">
                        <div className="circle"></div>
                    </div>
                </div>
            )}
            <HasagiNav />
            <div className="container-fluid" style={{ marginTop: "100px" }}>
                <div className="row px-xl-5">
                    <div className="col-lg-12 mb-5" id="tableAddCart">
                        <div className="header">
                            <button className="back-button" onClick={() => goBack()}>
                                <i className="ni ni-bold-left" />
                            </button>
                            <h5
                                className="mb-1"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                    color: "#343a40",
                                    marginLeft: "-15px",
                                }}
                            >
                                Giỏ Hàng
                            </h5>
                        </div>
                        {cartItems.length === 0 ? (
                            <div className="text-center py-3">
                                <img src={aboutImage} style={{ height: "60px", width: "60px" }} />
                                <p style={{ fontSize: "18px", color: "#6c757d" }}>Giỏ hàng của bạn đang trống.</p>
                                <button
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "16px",
                                        backgroundColor: "#f29913",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => (window.location.href = "/Shop")}
                                >
                                    MUA NGAY
                                </button>
                            </div>
                        ) : (
                            <table
                                className="table text-center mb-0"
                                style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
                            >
                                <thead className="bg-primary text-white" style={{ fontSize: "14px" }}>
                                    <tr>
                                        <th
                                            scope="col"
                                            style={{ width: "5%", textAlign: "center", padding: "10px", border: "none" }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAllChange}
                                                aria-label="Select All"
                                                style={{ transform: "scale(1.5)" }}
                                            />
                                        </th>
                                        <th
                                            scope="col"
                                            style={{ width: "20%", textAlign: "left", padding: "10px", border: "none" }}
                                        >
                                            Sản Phẩm
                                        </th>
                                        <th scope="col" style={{ width: "25%", padding: "10px", border: "none" }}></th>
                                        <th
                                            scope="col"
                                            style={{
                                                width: "10%",
                                                textAlign: "center",
                                                padding: "10px",
                                                border: "none",
                                                color: "gray",
                                            }}
                                        >
                                            Đơn Giá
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                width: "15%",
                                                textAlign: "center",
                                                padding: "10px",
                                                border: "none",
                                                color: "gray",
                                            }}
                                        >
                                            Số Lượng
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                width: "10%",
                                                textAlign: "center",
                                                padding: "10px",
                                                border: "none",
                                                color: "gray",
                                            }}
                                        >
                                            Tổng
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                width: "10%",
                                                textAlign: "center",
                                                padding: "10px",
                                                border: "none",
                                                color: "gray",
                                            }}
                                        >
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="align-middle" style={{ fontSize: "16px" }}>
                                    {cartItems.map((item) => (
                                        <tr
                                            key={item.cartdetailid}
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "10px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <td className="align-middle" style={{ border: "none" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={item.selected}
                                                    onChange={() => handleCheckboxChange(item.cartdetailid)}
                                                    style={{ transform: "scale(1.5)" }}
                                                />
                                            </td>
                                            <td
                                                className="align-middle"
                                                style={{ textAlign: "left", paddingLeft: "20px", border: "none" }}
                                            >
                                                <Link to={`/ShopDetail?id=${item.productId}`} style={{ color: "black" }}>
                                                    <img src={item.image} style={{ width: 60 }} alt={item.name} /> {item.name}
                                                </Link>
                                            </td>
                                            <td className="align-middle" style={{ border: "none" }}>
                                                <button
                                                    onClick={() => toggleModal(item.cartdetailid)}
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        color: "black",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Phân Loại Hàng: <br />
                                                    {item.color || "Chưa chọn màu"} , {item.size || "Chưa chọn kích thước"}
                                                </button>
                                            </td>
                                            <td className="align-middle" style={{ border: "none" }}>
                                                <span
                                                    style={{
                                                        textDecoration: "underline",
                                                        fontSize: "10px",
                                                        fontWeight: "normal",
                                                        transform: "translateY(-3px)", // Adjust the value as needed
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    đ
                                                </span>
                                                <span style={{ marginLeft: "1px" }}>
                                                    {new Intl.NumberFormat("vi-VN").format(item.price)}
                                                </span>
                                            </td>

                                            <td className="align-middle" style={{ border: "none" }}>
                                                <div
                                                    className="input-group quantity mx-auto"
                                                    style={{
                                                        width: "120px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <div className="input-group-btn">
                                                        <button
                                                            className="btn btn-warning btn-minus"
                                                            onClick={() => handleQuantityChange(item.cartdetailid, -1)}
                                                            aria-label={`Decrease quantity of ${item.name}`}
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <i className="fa fa-minus"></i>
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm text-center"
                                                        value={item.quantity}
                                                        readOnly
                                                        style={{
                                                            maxWidth: "40px",
                                                            height: "30px",
                                                            margin: "0 5px",
                                                        }}
                                                    />
                                                    <div className="input-group-btn">
                                                        <button
                                                            className="btn btn-warning btn-plus"
                                                            onClick={() => handleQuantityChange(item.cartdetailid, 1)}
                                                            aria-label={`Increase quantity of ${item.name}`}
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align-middle" style={{ border: "none" }}>
                                                <span
                                                    style={{
                                                        textDecoration: "underline",
                                                        fontSize: "10px",
                                                        fontWeight: "normal",
                                                        transform: "translateY(-3px)", // Adjust the value as needed
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    đ
                                                </span>
                                                <span style={{ marginLeft: "1px" }}>
                                                    {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)}
                                                </span>
                                            </td>
                                            <td className="align-middle" style={{ border: "none" }}>
                                                <button
                                                    onClick={() => handleRemoveItem(item.cartdetailid)}
                                                    className="btn btn-danger"
                                                    style={{ padding: "0.5rem 1rem" }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {cartItems.length > 0 && (
                            <div className="d-flex align-items-center justify-content-between w-100 py-2">
                                <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                        style={{ transform: "scale(1.5)", marginBottom: "0" }}
                                    />
                                    <label style={{ marginLeft: "5px", marginBottom: "0" }}>
                                        Chọn Tất Cả ({countSelectedItems()})
                                    </label>
                                    <button
                                        onClick={handleDeleteSelected}
                                        className="btn"
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: "black",
                                            fontSize: "20px",
                                            fontWeight: "normal",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                                <div className="d-flex align-items-center">
                                    <h5 className="font-weight-medium mb-0">
                                        Tổng thanh toán ({countSelectedItems()} sản phẩm):{" "}
                                        <span
                                            style={{
                                                textDecoration: "underline",
                                                fontSize: "13px",
                                                fontWeight: "normal",
                                                transform: "translateY(-4px)", // Adjust the value as needed
                                                display: "inline-block",
                                            }}
                                        >
                                            đ
                                        </span>
                                        <span style={{ marginLeft: "1px" }}>
                                            {new Intl.NumberFormat("vi-VN").format(total)}
                                        </span>
                                    </h5>
                                    <button
                                        onClick={handleCheckout}
                                        className="btn btn-warning rounded-pill d-inline-flex flex-shrink-0 py-1.5 px-4 ms-3"
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* có thể bạn thích */}
                    <Container>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Title>Có Thể Bạn Cũng Thích</Title>
                            <a
                                href="/Shop"
                                className="view-all-button"
                                style={{
                                    color: "#FF4500",
                                    fontSize: "16px",
                                    textDecoration: "none",
                                    marginBottom: "25px",
                                    marginRight: "15px",
                                }}
                            >
                                Xem Tất Cả
                                <span style={{ marginLeft: "5px", fontSize: "23px" }}>›</span>
                            </a>
                        </div>
                        <ProductGrid>
                            {products.map((product, index) => (
                                <ProductCard key={index}>
                                    {product.discount && <Badge>Giảm {product.discount}%</Badge>}
                                    <a href={`/ShopDetail?id=${product.id}`}>
                                        <ProductImage
                                            src={product.image || aboutImage5}
                                            alt={product.name || "Product"}
                                        />
                                        <ProductInfo>
                                            <ProductTitle>{product.name}</ProductTitle>
                                            {/* <Price>₫{product.price}</Price> */}
                                            {/* {product.originalPrice && (
                                                <OriginalPrice>₫{product.originalPrice}</OriginalPrice>
                                            )} */}
                                            {product.discount && <Discount>Giảm {product.discount}%</Discount>}
                                        </ProductInfo>
                                        <div className="text-center">
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small style={{ color: "black" }}>({product.rating || 99})</small>
                                            </div>
                                        </div>
                                    </a>
                                </ProductCard>
                            ))}
                        </ProductGrid>
                    </Container>
                </div>
            </div>

            <Backup show={showBackupModal} onClose={handleCloseBackupModal} />
            {isModalOpen && (
                <ColorSelectionModal
                    show={isModalOpen}
                    onClose={handleCloseModal}
                    onColorSelect={handleColorSelect}
                    onSizeSelect={handleSizeSelect}
                    productId={currentProductId}
                    cartDetailId={currentCartDetailId}
                    colorId={selectedColor}
                    sizeId={selectedSize}
                />
            )}
            <Footer />
        </>
    );
};

export default Cart;
