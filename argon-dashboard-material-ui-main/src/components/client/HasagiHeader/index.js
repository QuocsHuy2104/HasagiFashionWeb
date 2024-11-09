import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useCartQuantity from "../HasagiQuantity";
import "layouts/assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "components/client/assets/js/script";
import "components/client/assets/js/plugins";
import logo from "components/client/assets/images/Hasagi.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import useFavoriteCount from "../HasagiFavoriteCount";
import { useNavigate } from "react-router-dom";
import CartService from "../../../services/CartService";
import axios from "axios";
import aboutImage5 from "layouts/assets/img/product-1.jpg";

const Header = ({ onSearch }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();
    //const { cartProducts, fetchCartItems } = useListCart([]);
    const [cartProducts, setCartProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { favoriteCount } = useFavoriteCount();
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value); // Gọi hàm tìm kiếm từ prop
    };

    const handleMouseEnter = () => {
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setDropdownOpen(false);
    };

    const startVoiceSearch = (event) => {
        event.preventDefault();
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "vi-VN";
            recognition.interimResults = false;

            recognition.onstart = () => {
                console.log("Voice recognition started. Speak into the microphone.");
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                onSearch(transcript);

                // Speak the recognized text
                const utterance = new SpeechSynthesisUtterance(transcript);
                utterance.lang = "vi-VN";
                window.speechSynthesis.speak(utterance);
            };

            recognition.onerror = (event) => {
                console.error("Error occurred in recognition: " + event.error);
            };

            recognition.start();
        } else {
            alert("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.");
        }
    };
    const handleLogout = () => {
        Cookies.remove("user");
        Cookies.remove("accountId");
        navigate("/feature-section");
    };
    useEffect(() => {
        const fetchCartItems = async () => {
            const accountId = Cookies.get("accountId");

            if (!accountId) {
                //navigate(`/authentication/sign-in`);
                return;
            }

            try {
                const [cartResponse, addressResponse] = await Promise.all([
                    CartService.getCart(),
                    axios.get(`http://localhost:3000/api/addresses/exists?accountId=${accountId}`, {
                        withCredentials: true,
                    }),
                ]);
                const reversedCartData = cartResponse.data.reverse();
                setCartProducts(reversedCartData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCartItems();
    }, []);

    const handleCartMouseEnter = () => {
        setCartDropdownOpen(true);
    };

    const handleCartMouseLeave = () => {
        setCartDropdownOpen(false);
    };

    useEffect(() => { }, [fetchTotalQuantity()]);

    // Check login
    const user = Cookies.get("user");
    let position = false;
    if (user === null) position = false;
    else
        try {
            const token = jwtDecode(user);
            if (token.scope !== "USER") position = true;
        } catch (error) {
            position = false;
        }

    // Inline styles
    const styles = {
        header: {
            backgroundColor: "black",
            padding: "1rem",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
        },
        logo: {
            marginLeft: "50px",
            width: "50px",
            height: "50px",
        },
        navLink: {
            fontSize: "16px",
            fontWeight: "500",
            color: "white",
            marginLeft: "40px",
            transition: "color 0.3s ease-in-out",
        },
        formControl: {
            border: "1px solid #ddd",
            padding: "10px 20px",
            fontSize: "14px",
            width: "300px",
        },
        searchButton: {
            backgroundColor: "white",
            borderColor: "white",
            color: "black",
            transition: "background-color 0.3s, color 0.3s",
        },
        icon: {
            color: "white",
            fontSize: "20px",
            transition: "transform 0.2s ease",
        },
        badge: {
            position: "absolute",
            top: "-5px",
            right: "-10px",
            fontSize: "12px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#007678",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        userIcon: {
            padding: "10px",
            borderRadius: "50%",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            position: "relative",
        },
    };

    return (
        <>
            <div className="container-fluid bg-secondary">
                <header className="navbar navbar-expand-lg" style={styles.header}>
                    <div className="main-logo">
                        {position === true ? (
                            <a href="/dashboard" className="navbar-brand">
                                <img src={logo} alt="logo" className="img-fluid" style={styles.logo} />
                                <span className="mt-5" style={{ fontWeight: 1000, color: "white" }}>
                                    Hasagi Fashion
                                </span>
                            </a>
                        ) : (
                            <a href="/#" className="navbar-brand">
                                <img src={logo} alt="logo" style={styles.logo} />
                                <span className="mt-5" style={{ fontWeight: 1000, color: "white" }}>
                                    Hasagi Fashion
                                </span>
                            </a>
                        )}
                    </div>
                    <div className="collapse navbar-collapse">
                        <div className="nav-menu d-flex">
                            <a href="/feature-section" className="nav-item nav-link" style={styles.navLink}>
                                Trang Chủ
                            </a>
                            <a href="/Shop" className="nav-item nav-link" style={styles.navLink}>
                                Sản Phẩm
                            </a>
                            <a href="#about" className="nav-item nav-link" style={styles.navLink}>
                                Giới Thiệu
                            </a>
                            <a href="#contact" className="nav-item nav-link" style={styles.navLink}>
                                Liên Hệ
                            </a>
                            <a href="#faq" className="nav-item nav-link" style={styles.navLink}>
                                Hỏi Đáp
                            </a>
                        </div>
                    </div>

                    <div className="d-flex align-items-center" style={{ paddingRight: "38px" }}>
                        <form className="d-flex form-search" role="search" style={{ marginRight: "20px" }}>
                            <input
                                type="search"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="form-control rounded-pill me-2"
                                aria-label="Search"
                                style={styles.formControl}
                            />
                            <button
                                className="btn btn-outline-secondary rounded-pill"
                                type="button"
                                onClick={startVoiceSearch}
                                style={styles.searchButton}
                            >
                                <FontAwesomeIcon icon={faMicrophone} />
                            </button>
                        </form>

                        <ul className="d-flex justify-content-end list-unstyled m-0">
                            <li
                                className="user-menu dropdown"
                                style={{ marginRight: "10px" }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <a
                                    className="rounded-circle"
                                    style={{
                                        ...styles.userIcon,
                                        ...(dropdownOpen ? styles.userIconHover : {}),
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUser} className="icon" style={styles.icon} />
                                </a>
                                <ul
                                    className={`dropdown-menu icon-user ${dropdownOpen ? "show" : ""}`}
                                    style={{ marginLeft: "-150%", marginTop: "20%" }}
                                >
                                    {user == null ? (
                                        <>
                                            <li>
                                                <a href="/authentication/sign-in" className="dropdown-item">
                                                    Đăng nhập
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/authentication/sign-up" className="dropdown-item">
                                                    Đăng ký
                                                </a>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <a href="/profile" className="dropdown-item">
                                                    Tài khoản của tôi
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/History" className="dropdown-item">
                                                    Lịch sử đơn hàng
                                                </a>
                                            </li>
                                            <li>
                                                <a href="" className="dropdown-item" onClick={handleLogout}>
                                                    Đăng xuất
                                                </a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                            {user && (
                                <>
                                    <li>
                                        <a
                                            href="/Favorite"
                                            style={{ position: "relative", padding: "10px", textDecoration: "none" }}
                                        >
                                            <FontAwesomeIcon icon={faHeart} className="icon" style={styles.icon} />
                                            {favoriteCount > 0 && (
                                                <span className="badge" style={styles.badge}>
                                                    {favoriteCount}
                                                </span>
                                            )}
                                        </a>
                                    </li>
                                    <li
                                        style={{ position: "relative" }}
                                        onMouseEnter={handleCartMouseEnter}
                                        onMouseLeave={handleCartMouseLeave}
                                    >
                                        <a
                                            href="/Cart"
                                            style={{ position: "relative", padding: "10px", textDecoration: "none" }}
                                        >
                                            <FontAwesomeIcon icon={faShoppingCart} className="icon" style={styles.icon} />
                                            {totalQuantity > 0 && (
                                                <span className="badge" style={styles.badge}>
                                                    {totalQuantity}
                                                </span>
                                            )}
                                        </a>

                                        {/* Dropdown sản phẩm */}
                                        {cartDropdownOpen && (
                                            <div
                                                className="dropdown-menu"
                                                style={{
                                                    position: "absolute",
                                                    marginTop: "20%",
                                                    top: "100%",
                                                    marginLeft: "-700%",
                                                    width: "900%",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                    overflowY: "auto",
                                                    display: "block",
                                                }}
                                            >
                                                {cartProducts.length > 0 && (
                                                    <h6 style={{ padding: "10px", marginLeft: "2%,"}}>Sản Phẩm Mới Thêm</h6>
                                                )}

                                                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                                    {cartProducts.length > 0 ? (
                                                        cartProducts.map((product, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={() => navigate(`/ShopDetail?id=${product.id}`)}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    padding: "10px 0",
                                                                    borderBottom: "1px solid #ddd",
                                                                    transition: "background-color 0.3s",
                                                                    cursor: "pointer",
                                                                    justifyContent: "space-between",
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                                }}
                                                            >
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    style={{
                                                                        marginLeft: "4%",
                                                                        marginRight: "10px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "5px",
                                                                        width: "15%",
                                                                        height: "15%",
                                                                    }}
                                                                />
                                                                <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
                                                                    <span
                                                                        style={{
                                                                            fontSize: "16px",
                                                                            fontWeight: "normal",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            display: "block", // Thay đổi từ inline-block thành block
                                                                            maxWidth: "90%", // Giới hạn chiều rộng tối đa của span
                                                                        }}
                                                                    >
                                                                        {product.name.length > 10
                                                                            ? `${product.name.substring(0, 25)}...` // Cắt ở 10 ký tự
                                                                            : product.name}
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: "red",
                                                                        fontSize: "16px",
                                                                        textAlign: "right",
                                                                        marginRight: "5%",
                                                                    }}
                                                                >
                                                                    <span>{product.price.toLocaleString()}đ</span>
                                                                </div>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-center" style={{ padding: "20%" }}>
                                                            Giỏ hàng trống
                                                        </li>
                                                    )}
                                                </ul>

                                                {/* Show the button only if there are products in the cart */}
                                                {cartProducts.length > 0 && (
                                                    <button
                                                        onClick={() => navigate("/Cart")}
                                                        style={{
                                                            marginTop: "10px",
                                                            width: "40%",
                                                            padding: "8px",
                                                            backgroundColor: "#ffb524",
                                                            color: "#fff",
                                                            border: "none",
                                                            borderRadius: "4px",
                                                            marginLeft: "200px"
                                                        }}
                                                    >
                                                        Xem Giỏ Hàng
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </header>
            </div>
        </>
    );
};

Header.propTypes = {
    onSearch: () => { },
};

export default Header;
