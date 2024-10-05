import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import useCartQuantity from "../HasagiQuantity/useCartQuantity";
import { useLocation, Link } from 'react-router-dom';

import CategoryService from "../../../services/CategoryServices";
import ProductList from '../../../layouts/clientuser/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/client/assets/css/style1.css';
import 'components/client/assets/js/script';
import 'components/client/assets/js/plugins';
import logoImage from 'components/client/assets/images/Hasagi.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const HasagiNav = () => {
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();

    useEffect(() => {
        fetchTotalQuantity();
    }, [fetchTotalQuantity]);
    // Check login
    const user = Cookies.get('user');
    var position = false;
    if (user === null) position = flase;
    else
        try {
            const token = jwtDecode(user);
            if (token.scope !== 'USER')
                position = true;
        } catch (error) {
            position = false;
            console.error(error);
        }

    return (
        <>
            <div className="container-fluid bg-secondary">
                <div className="row py-3 border-bottom">
                    <div className="col-sm-4 col-lg-3 text-center text-sm-start">
                        <div className="main-logo">
                            {position == true ?
                                <a href="/dashboard" className="logo-link">
                                    <img
                                        src={logoImage}
                                        alt="logo"
                                        className="img-fluid logo-image"
                                    />
                                    <span className="logo-text">Hasagi Fashion</span>
                                </a>
                                :
                                <a href="/#" className="logo-link">
                                    <img
                                        src={logoImage}
                                        alt="logo"
                                        className="img-fluid logo-image"
                                    />
                                    <span className="logo-text">Hasagi Fashion</span>
                                </a>
                            }
                        </div>

                    </div>

                    <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block pt-3">
                        <div className="search-bar row p-2 rounded-4" style={{ backgroundColor: '#d3d3d5' }}>
                            <div className="col-11 col-md-11">
                                <form id="search-form" className="text-center" action="index.html" method="post">
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light"
                                        placeholder="Nhập tên sản phẩm"
                                    />
                                </form>
                            </div>
                            <a href="" className="col-1">
                                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '20px', color: 'black' }} />
                            </a>
                        </div>
                    </div>

                    <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
                        <div className="support-box text-end d-none d-xl-block">
                            <span className="fs-6 text-muted">Hỗ trợ ?</span>
                            <h5 className="mb-0">+84 917 465 863</h5>
                        </div>

                        <ul className="d-flex justify-content-end list-unstyled m-0">
                            <li className="user-menu dropdown">
                                <a href="#" className="rounded-circle bg-light p-2 mx-1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', color: 'black' }} />
                                </a>
                                <ul className="dropdown-menu">
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
                                        <li>
                                            <a href="#logout" className="dropdown-item">Đăng xuất</a>
                                        </li>
                                    )}
                                </ul>
                            </li>
                            {user && (
                                <>
                                    <li>
                                        <a href="#" className="rounded-circle bg-light p-2 mx-1">
                                            <FontAwesomeIcon icon={faHeart} style={{ fontSize: '20px', color: 'black' }} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/Cart" className="rounded-circle bg-light p-2 mx-1">
                                            <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '20px', color: 'black' }} />
                                            {totalQuantity > 0 && (
                            <span className="badge bg-primary ms-2">{totalQuantity}</span> // Display total quantity
                        )}
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>


            <div className="container-fluid">
                <div className="row pt-0 pb-0 py-3">
                    <div className="d-flex justify-content-center justify-content-sm-between align-items-center">
                        <nav className="main-menu d-flex navbar navbar-expand-lg">
                            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                                <div className="offcanvas-header justify-content-center">
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>

                                <div className="offcanvas-body">


                                    <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                                        <li className="nav-item active">
                                            <a href="/feature-section" className="nav-link">Trang chủ</a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a href="/Shop" className="nav-link">Sản phẩm</a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">Thêm</a>
                                            <ul className="dropdown-menu" aria-labelledby="pages">
                                                <li><a href="index.html" className="dropdown-item">Giới thiệu</a></li>
                                                <li><a href="index.html" className="dropdown-item">Shop</a></li>
                                                <li><a href="index.html" className="dropdown-item">Single Product</a></li>
                                                <li><a href="index.html" className="dropdown-item">Cart</a></li>
                                                <li><a href="index.html" className="dropdown-item">Liên hệ</a></li>
                                                <li><a href="index.html" className="dropdown-item">Hỏi đáp</a></li>
                                                <li><a href="/Contact" className="dropdown-item">Contact Us</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>


    )
}

export default HasagiNav;