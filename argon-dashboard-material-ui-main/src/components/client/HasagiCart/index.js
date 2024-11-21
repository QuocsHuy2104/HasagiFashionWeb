import React, { useState, useEffect, useRef } from "react";
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
import logo from "components/client/assets/images/logo1.png";
import ProductService from "services/ProductServices";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
import ProductVariant from "./ProductVariant";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accountExists, setAccountExists] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedColor] = useState("");
    const [selectedSize] = useState("");
    const [currentCartDetailId] = useState(null);
    const [currentProductId] = useState(null);
    const navigate = useNavigate();
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
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
            console.log("Cart Response:", cartResponse.data);
            console.log("Address Response:", addressResponse.data);
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
        console.log("Selected Items:", selectedItems);
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

    const countSelectedItems = () => {
        return cartItems.filter((item) => item.selected).length;
    };


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


    const fetchProductOptionsById = async (productId) => {
        try {
            console.log("Fetching API for Product ID:", productId); // Log kiểm tra
            const response = await fetch(`http://localhost:3000/api/cart/option/${productId}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            console.log("API Response:", data); // Log dữ liệu trả về từ API

            const uniqueColors = [...new Map(data.colors.map(color => [color.id, color])).values()];
            const uniqueSizes = [...new Map(data.sizes.map(size => [size.id, size])).values()];
            setSizes(uniqueSizes);
            setColors(uniqueColors);
        } catch (error) {
            console.error("Error fetching product options:", error);
            resetSelections();
            setError("Failed to fetch product options. Please try again later.");
        }
    };
    useEffect(() => {
        // Duyệt qua tất cả cartItems, gọi API cho sản phẩm có isDropdownVisible là true
        cartItems.forEach((item) => {
            if (item.isDropdownVisible) {
                console.log("Calling fetchProductOptionsById with Product ID:", item.productId); // Log kiểm tra
                fetchProductOptionsById(item.productId);
            }
        });
    }, [cartItems]); // Trigger effect khi cartItems thay đổi


    const variantColor = colors.map((color) => ({
        id: color.id,
        name: color.name,
        disabled: false,
    }));

    const variantSize = sizes.map((size) => ({
        id: size.id,
        name: size.name,
        disabled: false,
    }));

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (productId, cartDetailId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                const isCurrentItem = item.cartdetailid === cartDetailId && item.productId === productId;
                return {
                    ...item,
                    isDropdownVisible: isCurrentItem
                        ? !item.isDropdownVisible // Toggle nếu là sản phẩm hiện tại
                        : false, // Đóng dropdown của sản phẩm khác
                };
            })
        );
    };

    const closeDropdown = async (id) => {
        try {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, isDropdownVisible: false } : item
                )
            );
            const response = await CartService.getCart();
            setCartItems(response.data); 
        } catch (error) {
            console.error("Error fetching updated cart:", error);
        }
    };

    // Handle outside click to close the dropdown
    const handleOutsideClick = (event, id) => {
        const dropdown = document.getElementById(`dropdown-${id}`);
        if (dropdown && !dropdown.contains(event.target)) {
            closeDropdown(id);
        }
    };

    // Event listener để xử lý click bên ngoài dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            cartItems.forEach((item) => {
                if (item.isDropdownVisible) handleOutsideClick(event, item.id);
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cartItems]);

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            backgroundColor: 'white',
        },
        logo: {
            marginLeft: "20px",
            width: "180px",
            height: "70px",
        },
        cart: {
            marginRight: '1150px',
            fontSize: '1.1em',
            color: 'black',
        }
    };

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
                <div style={styles.container}>
                    <div style={styles.logo}>
                        <a href="/feature-section" className="navbar-brand">
                            <img src={logo} alt="logo" className="img-fluid" style={styles.logo} />
                        </a>
                    </div>
                    <div style={styles.cart}>
                        <a href="/feature-section" className="navbar-brand">
                            Giỏ Hàng
                        </a>
                    </div>
                </div>
                <div className="row px-xl-5">
                    <div className="col-lg-12 mb-5" id="tableAddCart">
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
                                                    <img src={item.image} style={{ width: 80 }} alt={item.name} /> {item.name}
                                                </Link>
                                            </td>
                                            <td className="align-middle" style={{ border: "none", position: "relative" }}>
                                                {/* Nút bấm */}
                                                <button
                                                    onMouseDown={(event) => toggleDropdown(item.productId, item.cartdetailid)}
                                                    style={{
                                                        alignItems: "center", // Canh giữa nội dung theo chiều dọc
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        color: "black",
                                                        cursor: "pointer",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <span>Phân Loại Hàng:</span>
                                                    <span
                                                        style={{
                                                            marginLeft: "10px", // Khoảng cách giữa text và mũi tên
                                                            display: "inline-block",
                                                            width: "0", // Không có chiều rộng
                                                            height: "0", // Không có chiều cao
                                                            borderLeft: "5px solid transparent", // Tạo cạnh trái
                                                            borderRight: "5px solid transparent", // Tạo cạnh phải
                                                            borderTop: `7px solid gray`, // Tạo cạnh trên để làm hình tam giác, màu xám khi mở
                                                            transform: item.isDropdownVisible
                                                                ? "rotate(180deg)" // Mở: mũi tên hướng lên
                                                                : "rotate(3deg)", // Đóng: mũi tên hướng xuống
                                                            transition: "transform 0.1s ease-in-out",
                                                        }}
                                                    />
                                                    <br />
                                                    {/* Hiển thị màu và kích thước dưới phân loại hàng */}
                                                    <div
                                                        style={{
                                                            fontSize: "15px",
                                                            color: "gray",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        <span style={{ color: item.color || "black" }}>
                                                            {item.color || "Chưa chọn màu"}
                                                        </span>
                                                        , {item.size || "Chưa chọn kích thước"}
                                                    </div>
                                                </button>

                                                {/* Hiển thị dropdown nếu `isDropdownVisible` */}
                                                {item.isDropdownVisible && (
                                                    <div
                                                        id={`dropdown-${item.cartdetailid}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: "110%",
                                                            marginLeft: "0",
                                                            transform: "translateX(-10%)",
                                                            width: "100%",
                                                            backgroundColor: "#fff",
                                                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                            zIndex: 2000,
                                                            opacity: 1,
                                                            transition: "all 0.3s ease",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                content: '""',
                                                                position: "absolute",
                                                                top: "-14px",
                                                                left: "45%",
                                                                transform: "translateX(-50%)",
                                                                width: "0px",
                                                                height: "0px",
                                                                border: "1px solid #dddd", // Viền xung quanh tam giác
                                                                borderLeft: "10px solid transparent", // Tạo cạnh trái trong suốt để tạo tam giác
                                                                borderRight: "10px solid transparent", // Tạo cạnh phải trong suốt để tạo tam giác
                                                                borderBottom: "14px solid #dddd", // Tạo đáy tam giác có màu viền
                                                            }}
                                                        />
                                                        <ProductVariant
                                                            variantColor={variantColor}
                                                            variantSize={variantSize}
                                                            productId={item.productId}
                                                            cartDetailId={item.cartdetailid}
                                                            onClose={() => closeDropdown(item.cartdetailid)}
                                                            colorId={item.colorId}
                                                            sizeId={item.sizeId}
                                                        />
                                                    </div>
                                                )}
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
                    <div style={{ marginTop: "20px", padding: "0 10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h6 style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem", fontWeight: "500", paddingBottom: "1rem" }}>
                                Có Thể Bạn Cũng Thích
                            </h6>
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
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 1fr)",
                                gap: "10px",
                            }}
                        >
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: "95%",
                                        height: "365px",
                                        cursor: "pointer",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        backgroundColor: "#fff",
                                        transition: "transform 0.3s",
                                        position: "relative",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                    {product.discount && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                left: "10px",
                                                backgroundColor: "#ff4d4f",
                                                color: "#fff",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                padding: "2px 5px",
                                                borderRadius: "3px",
                                            }}
                                        >
                                            Giảm {product.discount}%
                                        </div>
                                    )}
                                    <a href={`/ShopDetail?id=${product.id}`}>
                                        <img
                                            src={product.image || aboutImage5}
                                            alt={product.name || "Product"}
                                            style={{ width: "100%", height: "250px", objectFit: "cover" }}
                                        />
                                        <div style={{ padding: "10px" }}>
                                            <h6
                                                style={{
                                                    fontSize: "0.9rem",
                                                    color: "#333",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    marginBottom: "-5px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {product.name}
                                            </h6>
                                            {product.discount && (
                                                <p style={{ color: "#ff6600", fontWeight: "bold", fontSize: "0.8rem", marginTop: "5px" }}>
                                                    Giảm {product.discount}%
                                                </p>
                                            )}
                                        </div>
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
                                </div>
                            ))}
                        </div>
                    </div>
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
