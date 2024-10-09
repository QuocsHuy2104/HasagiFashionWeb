import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import useCartQuantity from "../HasagiQuantity/useCartQuantity";
import PropTypes from 'prop-types';
import 'layouts/assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/client/assets/js/script';
import 'components/client/assets/js/plugins';
import logo from 'components/client/assets/images/Hasagi.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';


const Header = ({ onSearch }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();
    const [searchTerm, setSearchTerm] = useState("");

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
            recognition.lang = 'vi-VN';
            recognition.interimResults = false;
    
            recognition.onstart = () => {
                console.log('Voice recognition started. Speak into the microphone.');
            };
    
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                onSearch(transcript);
                
                const utterance = new SpeechSynthesisUtterance(transcript);
                utterance.lang = 'vi-VN';
                window.speechSynthesis.speak(utterance);
            };
    
            recognition.onerror = (event) => {
                console.error('Error occurred in recognition: ' + event.error);
            };
    
            recognition.start();
        } else {
            alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.');
        }
    };

    useEffect(() => {
        fetchTotalQuantity();
    }, [fetchTotalQuantity]);

    // Check login
    const user = Cookies.get('user');
    let position = false;
    if (user === null) position = false;
    else
        try {
            const token = jwtDecode(user);
            if (token.scope !== 'USER')
                position = true;
        } catch (error) {
            position = false;
            console.error(error);
        }

    // Inline styles
    const styles = {
        header: {
            backgroundColor: '#e9ecef',
            padding: '1rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
        },
        logo: {
            marginLeft: "50px",
            width: '50px',
            height: '50px',
        },
        navLink: {
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
            marginLeft: '20px',
            transition: 'color 0.3s ease-in-out',
        },
        formControl: {
            border: '1px solid #ddd',
            padding: '10px 20px',
            fontSize: '14px',
            width: '300px',
        },
        searchButton: {
            borderColor: 'black',
            color: 'black',
            transition: 'background-color 0.3s, color 0.3s',
        },
        icon: {
            fontSize: '20px',
            transition: 'transform 0.2s ease',
        },
        badge: {
            position: 'absolute',
            top: '-5px',
            right: '-10px',
            fontSize: '12px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#007678',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        userIcon: {
            padding: '10px',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
        },
    };

    return (
        <>
            <div className="container-fluid bg-secondary">
                <header className="navbar navbar-expand-lg" style={styles.header}>
                    <div className="main-logo">
                        {position === true ? (
                            <a href="/dashboard" className="navbar-brand">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="img-fluid"
                                    style={styles.logo}
                                />
                                <span className="mt-5" style={{ fontWeight: 1000 }}>Hasagi Fashion</span>
                            </a>
                        ) : (
                            <a href="/#" className="navbar-brand">
                                <img
                                    src={logo}
                                    alt="logo"
                                    style={styles.logo}
                                />
                                <span className="mt-5" style={{ fontWeight: 1000 }}>Hasagi Fashion</span>
                            </a>
                        )}
                    </div>
                    <div className="collapse navbar-collapse">
                        <div className="nav-menu d-flex">
                            <a href="/feature-section" className="nav-item nav-link" style={styles.navLink}>Trang Chủ</a>
                            <a href="/Shop" className="nav-item nav-link" style={styles.navLink}>Sản Phẩm</a>
                            <a href="#about" className="nav-item nav-link" style={styles.navLink}>Giới Thiệu</a>
                            <a href="#contact" className="nav-item nav-link" style={styles.navLink}>Liên Hệ</a>
                            <a href="#faq" className="nav-item nav-link" style={styles.navLink}>Yêu thích</a>
                        </div>
                    </div>

                    <div className="d-flex align-items-center" style={{ paddingRight: '38px' }}>
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
                            <li className="user-menu dropdown" style={{ marginRight: "10px" }}
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
                                    <FontAwesomeIcon icon={faUser} className='icon' style={styles.icon} />
                                </a>
                                <ul className={`dropdown-menu icon-user ${dropdownOpen ? 'show' : ''}`}>
                                    {user == null ? (
                                        <>
                                            <li>
                                                <a href="/authentication/sign-in" className="dropdown-item">Đăng nhập</a>
                                            </li>
                                            <li>
                                                <a href="/authentication/sign-up" className="dropdown-item">Đăng ký</a>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <a href="logout" className="dropdown-item">Tài khoản của tôi</a>
                                            </li>
                                            <li>
                                                <a href="/History" className="dropdown-item">Lịch sử đơn hàng</a>
                                            </li>
                                            <li>
                                                <a href="logout" className="dropdown-item">Đăng xuất</a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                            {user && (
                                <>
                                    <li>
                                        <a href="" style={{ padding: '10px', textDecoration: 'none' }}>
                                            <FontAwesomeIcon icon={faHeart} className='icon' style={styles.icon} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/Cart" style={{ position: 'relative', padding: '10px', textDecoration: 'none' }}>
                                            <FontAwesomeIcon icon={faShoppingCart} className='icon' style={styles.icon} />
                                            {totalQuantity > 0 && (
                                                <span className="badge" style={styles.badge}>{totalQuantity}</span>
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

// Add prop types validation
Header.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default Header;
