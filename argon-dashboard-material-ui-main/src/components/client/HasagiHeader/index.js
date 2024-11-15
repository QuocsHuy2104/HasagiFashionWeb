import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useCartQuantity from "../HasagiQuantity";
import "layouts/assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "components/client/assets/js/script";
import "components/client/assets/js/plugins";
import logo from "components/client/assets/images/logo.png";
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
import ProfileServices from "services/ProfileServices";

const Header = ({ onSearch }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();
    const [cartProducts, setCartProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { favoriteCount } = useFavoriteCount();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value); // Gọi hàm tìm kiếm từ prop
    };

    let timeoutId;
    let timeoutIdCard;

    const handleMouseEnter = () => {
        clearTimeout(timeoutId); // Xóa bỏ timeout nếu có
        setDropdownOpen(true); // Mở dropdown
    };

    const handleMouseLeave = () => {
        // Trì hoãn việc ẩn dropdown
        timeoutId = setTimeout(() => {
            setDropdownOpen(false);
        }, 200); // 200ms delay trước khi ẩn dropdown
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
                return;
            }

            try {
                const [cartResponse] = await Promise.all([
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
        clearTimeout(timeoutIdCard); // Xóa bỏ timeout nếu có
        setCartDropdownOpen(true);
    };

    const handleCartMouseLeave = () => {
        timeoutIdCard = setTimeout(() => {
            setCartDropdownOpen(false);
        }, 200);
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
            marginLeft: "0px",
            width: "180px",
            height: "50px",
        },
        navLink: {
            fontSize: "16px",
            fontWeight: "500",
            color: "white",
            marginLeft: "30px",
            transition: "color 0.3s ease-in-out",
        },
        formControl: {
            border: "1px solid #ddd",
            padding: "10px 20px",
            fontSize: "14px",
            width: "350px",
        },
        searchButton: {
            height: "35px",
            marginTop: "-0px",
            marginLeft: "-45px",
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
            backgroundColor: "#ffd333",
            color: "black",
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

    const fetchUserData = async () => {
            const profileData = await ProfileServices.getProfile();
            setUsername(profileData.username || "");
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            <div className="container-fluid bg-secondary">
                <header className="navbar navbar-expand-lg" style={styles.header}>
                    <div className="main-logo">
                        {position === true ? (
                            <a href="/dashboard" className="navbar-brand">
                                <img src={logo} alt="logo" className="img-fluid" style={styles.logo} />
                            </a>
                        ) : (
                            <a href="/#" className="navbar-brand">
                                <img src={logo} alt="logo" style={styles.logo} />
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
                            <a href="/chatBot" className="nav-item nav-link" style={styles.navLink}>
                                Chat Bot
                            </a>
                        </div>
                    </div>

                    <div className="d-flex align-items-center" style={{ paddingRight: "35px" }}>
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
                                style={{ marginRight: "10px", position: "relative" }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <a
                                    className="rounded-circle"
                                    style={{
                                        ...styles.userIcon,
                                        ...(dropdownOpen ? styles.userIconHover : {}),
                                        display: "flex",
                                        flexDirection: "row", // Xếp ảnh và tên trên cùng một hàng
                                        alignItems: "center", // Canh giữa dọc
                                    }}
                                >
                                    {user == null ? (
                                        <FontAwesomeIcon icon={faUser} className="icon" style={styles.icon} />
                                    ) : (
                                        <>
                                            <img
                                                src={user.profileImageUrl || aboutImage5} // URL ảnh người dùng
                                                alt="User Avatar"
                                                style={{
                                                    width: "24px", // Kích thước nhỏ gọn của ảnh
                                                    height: "24px",
                                                    borderRadius: "50%",
                                                    marginRight: "10px",
                                                }}
                                            />
                                            <span style={{ fontSize: "14px", color: "white", whiteSpace: "nowrap" }}>
                                                Xin chào, {username}
                                            </span>
                                        </>
                                    )}
                                </a>

                                <ul
                                    className={`dropdown-menu icon-user ${dropdownOpen ? "show" : ""}`}
                                    style={{
                                        position: "absolute",
                                        top: "100%", // Đặt ngay bên dưới icon
                                        left: "50%",
                                        transform: "translateX(-50%)", // Căn giữa với icon
                                        marginTop: "5px",
                                        zIndex: 1,
                                    }}
                                    onMouseEnter={handleMouseEnter} // Giữ menu mở khi di chuột vào dropdown
                                    onMouseLeave={handleMouseLeave}
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
                                    <li
                                        style={{ position: "relative", marginTop: "2%" }}
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
                                                    marginTop: "12%",
                                                    top: "100%",
                                                    marginLeft: "-700%",
                                                    width: "900%",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                    overflowY: "auto",
                                                    display: "block",
                                                    zIndex: 1000,
                                                }}
                                            >
                                                {cartProducts.length > 0 && (
                                                    <h6 style={{ padding: "10px", marginLeft: "2%" }}>Sản Phẩm Mới Thêm</h6>
                                                )}

                                                {/* Các phần tử khác trong dropdown */}
                                                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                                    {/* Các sản phẩm trong giỏ hàng */}
                                                    {cartProducts.length > 0 ? (
                                                        <>
                                                            {cartProducts.slice(0, 4).map((product, index) => (
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
                                                                    <div
                                                                        style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                fontSize: "16px",
                                                                                fontWeight: "normal",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                display: "block",
                                                                                maxWidth: "90%",
                                                                            }}
                                                                        >
                                                                            {product.name.length > 25
                                                                                ? `${product.name.substring(0, 25).trim()}...`
                                                                                : product.name}
                                                                        </span>
                                                                    </div>
                                                                    <span
                                                                        style={{
                                                                            textDecoration: "underline",
                                                                            fontSize: "10px",
                                                                            fontWeight: "normal",
                                                                            transform: "translateY(-1px)",
                                                                            display: "inline-block",
                                                                            color: "red",
                                                                        }}
                                                                    >
                                                                        đ
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            marginLeft: "1px",
                                                                            color: "red",
                                                                            fontSize: "16px",
                                                                            textAlign: "right",
                                                                            marginRight: "5%",
                                                                        }}
                                                                    >
                                                                        {new Intl.NumberFormat("vi-VN").format(product.price)}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <li className="text-center" style={{ padding: "20%" }}>
                                                            Giỏ hàng trống
                                                        </li>
                                                    )}
                                                </ul>

                                                {/* Nút "Xem Giỏ Hàng" */}
                                                {cartProducts.length > 0 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "10px 0",
                                                        }}
                                                    >
                                                        {cartProducts.length > 4 && (
                                                            <span
                                                                style={{
                                                                    fontSize: "15px",
                                                                    color: "#333",
                                                                    marginLeft: "6%",
                                                                    marginTop: "3%",
                                                                }}
                                                            >
                                                                {cartProducts.length - 4} sản phẩm khác
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => navigate("/Cart")}
                                                            style={{
                                                                backgroundColor: "#f4511e",
                                                                color: "white",
                                                                fontSize: "13px",
                                                                fontWeight: "bold",
                                                                padding: "8px",
                                                                border: "none",
                                                                borderRadius: "5px",
                                                                cursor: "pointer",
                                                                transition: "background-color 0.3s",
                                                                marginLeft: "auto",
                                                                marginRight: "4%",
                                                                marginBottom: "-3%",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#d84315";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#f4511e";
                                                            }}
                                                        >
                                                            Xem Giỏ Hàng
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                    <li style={{ marginTop: "2%", marginRight: "-30px", marginLeft: "10px" }}>
                                        <a
                                            href="/Favorite"
                                            style={{
                                                position: "relative",
                                                padding: "10px",
                                                textDecoration: "none",
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faHeart} className="icon" style={styles.icon} />
                                            {favoriteCount > 0 && (
                                                <span className="badge" style={styles.badge}>
                                                    {favoriteCount}
                                                </span>
                                            )}
                                        </a>
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
