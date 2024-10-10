import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useCartQuantity from "../HasagiQuantity/useCartQuantity";
import "layouts/assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "components/client/assets/js/script";
import "components/client/assets/js/plugins";
import logo from "components/client/assets/images/Hasagi.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalQuantity, fetchTotalQuantity } = useCartQuantity();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    fetchTotalQuantity();
  }, [fetchTotalQuantity]);

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
      console.error(error);
    }

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Inline styles
  const styles = {
    header: {
      backgroundColor: "#f8f9fa",
      padding: "1rem",
    },
    logo: {
      marginLeft: "50px",
      width: "50px",
      height: "50px",
    },
    navLink: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
      marginLeft: "20px",
      transition: "color 0.3s ease-in-out",
    },
    navLinkHover: {
      color: "#007678",
    },
    formControl: {
      border: "1px solid #ddd",
      padding: "10px 20px",
      fontSize: "14px",
      width: "300px",
    },
    searchButton: {
      borderColor: "black",
      color: "black",
      transition: "background-color 0.3s, color 0.3s",
    },
    iconButton: {
      background: "none",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      padding: "10px",
      transition: "color 0.3s ease",
    },
    icon: {
      fontSize: "20px",
      color: "#333",
    },
    iconHover: {
      color: "#5b5b5c",
    },
    dropdownMenu: {
      backgroundColor: "#343a40",
      padding: "10px 20px",
      borderRadius: "5px",
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
                <span className="mt-5" style={{ fontWeight: 1000 }}>
                  Hasagi Fashion
                </span>
              </a>
            ) : (
              <a href="/#" className="navbar-brand">
                <img src={logo} alt="logo" style={styles.logo} />
                <span className="mt-5" style={{ fontWeight: 1000 }}>
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
              <a href="/Contact" className="nav-item nav-link" style={styles.navLink}>
                Giới Thiệu
              </a>
              <a href="#contact" className="nav-item nav-link" style={styles.navLink}>
                Liên Hệ
              </a>
              <a href="#faq" className="nav-item nav-link" style={styles.navLink}>
                Yêu thích
              </a>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <form className="d-flex form-search" role="search" style={{ marginRight: "20px" }}>
              <input
                type="search"
                placeholder="Tìm kiếm"
                className="form-control rounded-pill me-2"
                aria-label="Search"
                style={styles.formControl}
              />
              <button
                className="btn btn-outline-secondary rounded-pill"
                type="submit"
                style={styles.searchButton}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>

            <ul className="d-flex justify-content-end list-unstyled m-0">
              <li className="user-menu dropdown" style={{ marginRight: "10px" }}>
                <a
                  className="rounded-circle bg-light p-2 mx-1"
                  onClick={toggleDropdown}
                  style={styles.iconButton}
                >
                  <FontAwesomeIcon icon={faUser} className="icon" style={styles.icon} />
                </a>
                <ul className={`dropdown-menu icon-user ${dropdownOpen ? "show" : ""}`}>
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
                        <a href="logout" className="dropdown-item">
                          Tài khoản của tôi
                        </a>
                      </li>
                      <li>
                        <a href="/History" className="dropdown-item">
                          Lịch sử đơn hàng
                        </a>
                      </li>
                      <li>
                        <a href="logout" className="dropdown-item">
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
                      href=""
                      className="rounded-circle bg-light p-2 mx-1"
                      style={styles.iconButton}
                    >
                      <FontAwesomeIcon icon={faHeart} className="icon" style={styles.icon} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="/Cart"
                      className="rounded-circle bg-light p-2 mx-1"
                      style={styles.iconButton}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="icon" style={styles.icon} />
                      {totalQuantity > 0 && (
                        <span className="badge bg-primary ms-2">{totalQuantity}</span>
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

export default Header;
