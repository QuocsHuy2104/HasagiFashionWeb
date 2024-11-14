import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import useCartQuantity from "../HasagiQuantity";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/client/assets/js/script';
import 'components/client/assets/js/plugins';
import logo from 'components/client/assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import useFavoriteCount from "../HasagiFavoriteCount";
import { useNavigate } from 'react-router-dom';
import { Dropdown, Button, Badge } from 'react-bootstrap';

const Header = ({ onSearch }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();
    const [searchTerm, setSearchTerm] = useState("");
    const { favoriteCount } = useFavoriteCount();
    const navigate = useNavigate();
    // Tạo state để quản lý việc mở/đóng dropdown
    const [isOpen, setIsOpen] = useState(false);

    // Hàm để toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(prevState => !prevState);
    };



    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
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

                // Speak the recognized text
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
    const handleLogout = () => {

        Cookies.remove('user');
        Cookies.remove('accountId')
        navigate('/feature-section');
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
        }

    const [scrolling, setScrolling] = useState(false);
    const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const styles = {
        // topNav: {
        //     backgroundColor: 'gold',  // Nền đen
        //     color: 'black',  // Chữ vàng
        //     padding: '10px 0',
        // },
        // text: {
        //     color: 'black',  // Màu chữ vàng
        //     fontSize: '16px',
        //     margin: '0 10px 0 0',  // Khoảng cách bên phải giữa các thẻ p
        // },
        // socialLinks: {
        //     display: 'flex',
        //     gap: '15px',
        // },
        // socialLink: {
        //     color: 'black',
        //     fontSize: '18px',
        //     transition: 'color 0.3s ease',
        // },
        // socialLinkHover: {
        //     color: '#fff',  // Màu icon khi hover
        // },
        // row: {
        //     display: 'flex',
        //     justifyContent: 'space-between',
        //     alignItems: 'center',
        //     with: '880px'
        // },
        // colAuto: {
        //     flex: '0 0 auto',
        //     display: 'flex',
        //     alignItems: 'right', 

        // },
        // colText: {
        //     display: 'flex',
        //     alignItems: 'center',
        // },

        header: {
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: 'black',
            transition: 'top 0.1s ease',
        },
        logo: {
            marginLeft: "50px",
            width: '150px',
            height: '50px',
        },
        navLink: {
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
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
            backgroundColor: "white",
            borderColor: 'white',
            color: 'black',
            transition: 'background-color 0.3s, color 0.3s',
        },
        icon: {
            color: "white",
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
            <div className="container-fluid bg-secondary px-0" data-bs-spy="scroll" data-bs-target="navbar">
                {/* <nav className="top-nav" id="home" style={styles.topNav}>
                    <Container className="mx-5">
                        <Row style={styles.row}>
                            <Col xs="auto" style={styles.colAuto}>
                                <div style={styles.colText}>
                                    <p style={styles.text}>
                                        <FaEnvelope />
                                        <span style={{ marginRight: '50px' }}> hasagifashion@gmail.com</span>
                                    </p>
                                    <p style={styles.text}>
                                        <FaPhoneAlt />
                                        <span>+84 917 465 863</span>
                                    </p>
                                </div>
                            </Col>

                            <Col xs="auto" style={styles.colAuto}>
                                <div className="social-links" style={styles.socialLinks}>
                                        <a href="#" style={styles.socialLink}>
                                            <BsFacebook />
                                        </a>
                                        <a href="#" style={styles.socialLink}>
                                            <BsTiktok />
                                        </a>
                                        <a href="#" style={styles.socialLink}>
                                            <BsInstagram />
                                        </a>
                                        <a href="#" style={styles.socialLink}>
                                            <BsYoutube />
                                        </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </nav> */}

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
                            </a>
                        ) : (
                            <a href="/#" className="navbar-brand">
                                <img
                                    src={logo}
                                    alt="logo"
                                    style={styles.logo}
                                />
                            </a>
                        )}
                    </div>
                    <div className="collapse navbar-collapse">
                        <div className="nav-menu d-flex">
                            <a href="/feature-section" className="nav-item nav-link" style={styles.navLink}>Trang Chủ</a>
                            <a href="/Shop" className="nav-item nav-link" style={styles.navLink}>Sản Phẩm</a>
                            <a href="#about" className="nav-item nav-link" style={styles.navLink}>Giới Thiệu</a>
                            <a href="#contact" className="nav-item nav-link" style={styles.navLink}>Liên Hệ</a>
                            <a href="#faq" className="nav-item nav-link" style={styles.navLink}>Hỏi Đáp</a>
                            <a href="/chatbot" className="nav-item nav-link" style={styles.navLink}>Chat bot</a>


                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Button
                                    variant="secondary"
                                    onClick={toggleDropdown}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '30px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: '1px solid #007bff',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease',
                                        marginLeft: '40px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                                >
                                    Dropdown
                                </Button>

                                {/* Dropdown Menu */}
                                {isOpen && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '45px',
                                            left: '60%',
                                            transform: 'translateX(-50%)',
                                            marginTop: '10px',
                                            padding: '10px 0',
                                            width: '200px',
                                            borderRadius: '12px',
                                            backgroundColor: '#fff',
                                            border: '1px solid white',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                            zIndex: 999,
                                            opacity: 1,
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <span
                                            style={{
                                                content: '""',
                                                position: 'absolute',
                                                top: '-8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '0',
                                                height: '0',
                                                borderLeft: '8px solid transparent',
                                                borderRight: '8px solid transparent',
                                                borderBottom: '8px solid #fff',
                                            }}
                                        />
                                        <ul className="flex flex-col gap-2 text-gray-700">
                                            <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md text-sm transition duration-200 ease-in-out">
                                                Option 1
                                            </li>
                                            <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md text-sm transition duration-200 ease-in-out">
                                                Option 2
                                            </li>
                                            <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md text-sm transition duration-200 ease-in-out">
                                                Option 3
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

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
                                                <a href="" className="dropdown-item" onClick={handleLogout}>Đăng xuất</a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                            {user && (
                                <>
                                    <li>
                                        <a href="/Favorite" style={{ position: 'relative', padding: '10px', textDecoration: 'none' }}>
                                            <FontAwesomeIcon icon={faHeart} className='icon' style={styles.icon} />
                                            {favoriteCount > 0 && (
                                                <span className="badge" style={styles.badge}>{favoriteCount}</span>
                                            )}
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

Header.propTypes = {
    onSearch: () => { }
};

export default Header;
