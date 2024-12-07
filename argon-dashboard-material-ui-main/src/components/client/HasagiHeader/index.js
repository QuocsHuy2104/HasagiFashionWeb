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
import { useNavigate } from "react-router-dom";
import CartService from "../../../services/CartService";
import axios from "axios";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
import ProfileServices from "services/ProfileServices";
import AddressService from "../../../services/AddressServices";

const Header = ({ onSearch }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { totalQuantity, fetchTotalQuantity } = useCartQuantity();
  const [cartProducts, setCartProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [images, setImages] = useState([]);

  const handleMouseDropdownMenuEnter = (index) => setHovered(index);
  const handleMouseDropdownMenuLeave = () => setHovered(null);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  let timeoutId;
  let timeoutIdCard;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsHovered(true);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsHovered(false);
      setDropdownOpen(false);
    }, 200);
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

      try {
        const [cartResponse] = await Promise.all([
          CartService.getCart(),
          AddressService.getAddress(),
        ]);
        const reversedCartData = cartResponse.data.reverse();
        setCartProducts(reversedCartData);
        // Gọi API hình ảnh dựa trên dữ liệu từ cartResponse
        const imageRequests = reversedCartData.map((item) =>
          axios
            .get(`http://localhost:3000/api/public/webShopDetail/product-detail/${item.productId}`)
            .then((res) => ({ productId: item.productId, data: res.data }))
        );

        // Chờ tất cả API hoàn thành
        const imagesData = await Promise.all(imageRequests);

        // Chuyển đổi thành object để dễ truy cập
        const imagesMap = imagesData.reduce((acc, { productId, data }) => {
          acc[productId] = data;
          return acc;
        }, {});

        // Cập nhật state với hình ảnh
        setImages(imagesMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleCartMouseEnter = () => {
    clearTimeout(timeoutIdCard);
    setCartDropdownOpen(true);
  };

  const handleCartMouseLeave = () => {
    timeoutIdCard = setTimeout(() => {
      setCartDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {}, [fetchTotalQuantity()]);

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
    searchButton: {
      height: "35px",
      marginTop: "-0px",
      marginLeft: "-45px",
      backgroundColor: "white",
      borderColor: "white",
      color: "black",
      transition: "background-color 0.3s, color 0.3s",
      boxShadow: "none",
      zIndex: 1002,
    },
  };

  const fetchUserData = async () => {
    try {
      const profileData = await ProfileServices.getProfile();

      setUsername(profileData.username || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const menuItems = user
    ? [
        { href: "/profile", label: "Tài khoản của tôi" },
        { href: "/History", label: "Lịch sử đơn hàng" },
        { href: "", label: "Đăng xuất", onClick: handleLogout },
      ]
    : [
        { href: "/authentication/sign-in", label: "Đăng nhập" },
        { href: "/authentication/sign-up", label: "Đăng ký" },
      ];

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
              <a href="/About" className="nav-item nav-link" style={styles.navLink}>
                Giới Thiệu
              </a>
              <a href="/Contact" className="nav-item nav-link" style={styles.navLink}>
                Liên Hệ
              </a>
              <a href="/Q&A" className="nav-item nav-link" style={styles.navLink}>
                Hỏi Đáp
              </a>
            </div>
          </div>

          <div className="d-flex align-items-center" style={{ paddingRight: "35px" }}>
            <form className="d-flex form-search" role="search" style={{ marginRight: "20px" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="form-control rounded-pill me-2"
                  aria-label="Search"
                  style={{ ...styles.formControl, paddingRight: "35px" }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange({ target: { value: "" } })}
                    style={{
                      position: "absolute",
                      right: "45px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "17px",
                      lineHeight: "1",
                      padding: "2px",
                    }}
                  >
                    ✖
                  </button>
                )}
              </div>
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
                  href="/profile"
                  className="rounded-circle"
                  style={{
                    ...styles.userIcon,
                    ...(dropdownOpen ? styles.userIconHover : {}),
                    display: "flex",
                    flexDirection: "row", // Xếp ảnh và tên trên cùng một hàng
                    alignItems: "center", // Canh giữa dọc
                    cursor: "pointer",
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
                      <span
                        style={{
                          fontSize: "14px",
                          color: isHovered ? "#cccccc" : "white", // Chuyển sang màu tối khi hover
                          whiteSpace: "nowrap",
                          transition: "color 0.3s ease",
                        }}
                      >
                        Xin chào, {username}
                      </span>
                    </>
                  )}
                </a>

                <ul
                  className={`dropdown-menu icon-user ${dropdownOpen ? "show" : ""}`}
                  style={{
                    paddingTop: "0px",
                    paddingBottom: "0px",
                    position: "absolute",
                    borderRadius: "0px",
                    top: "100%",
                    left: "50%",
                    marginTop: "10px",
                    transform: "translateX(-50%)",
                    backgroundColor: "#fff",
                    zIndex: 1000,
                    opacity: 1,
                  }}
                  onMouseEnter={handleMouseEnter} // Giữ menu mở khi di chuột vào dropdown
                  onMouseLeave={handleMouseLeave}
                >
                  <span
                    style={{
                      content: '""',
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "0px",
                      height: "0px",
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: "15px solid #fff",
                    }}
                  />
                  <>
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          onClick={item.onClick}
                          className="dropdown-item"
                          style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            backgroundColor: hovered === index ? "#f9f9f9" : "transparent",
                            color: hovered === index ? (user ? "#fbc02d" : "#616161") : "black",
                            transition: "background-color 0.3s ease, color 0.3s ease",
                          }}
                          onMouseEnter={() => handleMouseDropdownMenuEnter(index)}
                          onMouseLeave={handleMouseDropdownMenuLeave}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </>
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
                        style={{
                          position: "absolute",
                          top: "100%",
                          marginLeft: "-200%",
                          transform: "translateX(-50%)",
                          marginTop: "10px",
                          padding: "10px 0",
                          width: "900%",
                          backgroundColor: "#fff",
                          border: "1px solid white",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          zIndex: 1000,
                          opacity: 1,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            content: '""',
                            position: "absolute",
                            top: "-14px",
                            left: "78.55%",
                            transform: "translateX(-50%)",
                            width: "0px",
                            height: "0px",
                            borderLeft: "10px solid transparent",
                            borderRight: "10px solid transparent",
                            borderBottom: "14px solid #fff",
                          }}
                        />

                        {cartProducts.length > 0 && (
                          <h6 style={{ padding: "10px", marginLeft: "2%" }}>Sản Phẩm Mới Thêm</h6>
                        )}

                        {/* Các phần tử khác trong dropdown */}
                        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                          {/* Các sản phẩm trong giỏ hàng */}
                          {cartProducts.length > 0 ? (
                            <>
                              {cartProducts.slice(0, 4).map((product, index) => {
                                const matchingImage = images[product.productId]?.find(
                                  (image) => image.colorsDTO.id === product.colorId
                                );
                                return (
                                  <li
                                    key={index}
                                    onClick={() => navigate(`/ShopDetail?id=${product.productId}`)}
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
                                    {matchingImage && (
                                      <img
                                        src={matchingImage.imageDTOResponse[0]?.url}
                                        alt={product.name}
                                        style={{
                                          marginLeft: "4%",
                                          marginRight: "10px",
                                          objectFit: "contain",
                                          borderRadius: "5px",
                                          width: "40px",
                                          height: "40px",
                                          backgroundColor: "#f5f5f5",
                                        }}
                                      />
                                    )}
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
                                        marginLeft: "1px",
                                        color: "red",
                                        fontSize: "16px",
                                        textAlign: "right",
                                        marginRight: "5%",
                                      }}
                                    >
                                      {new Intl.NumberFormat("vi-VN").format(product.price)}đ
                                    </span>
                                  </li>
                                );
                              })}
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
  onSearch: () => {},
};

export default Header;