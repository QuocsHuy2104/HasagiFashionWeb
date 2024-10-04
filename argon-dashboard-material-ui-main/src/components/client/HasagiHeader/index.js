import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import AnchorTemporaryDrawer from 'components/client/HasagiDrawer'
import useCartQuantity from "../HasagiQuantity/useCartQuantity";
import { useLocation, Link } from 'react-router-dom';

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
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0 app">
            {
                position == true ?
                    <a href="/dashboard" className="navbar-brand p-0">
                        <h1 className="text-primary"><i className="fas fa-hand-holding-water me-3"></i>HasagiFashion</h1>
                        {/* <img src="img/logo.png" alt="Logo /"> */}
                    </a>
                    :
                    <a href="#" className="navbar-brand p-0">
                        <h1 className="text-primary"><i className="fas fa-hand-holding-water me-3"></i>HasagiFashion</h1>
                        {/* <img src="img/logo.png" alt="Logo /"> */}
                    </a>
            }

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0">
                    <a href="/feature-section" className="nav-item nav-link">Home</a>
                    <a href="/Shop" className="nav-item nav-link">Shop</a>
                    <a href="/Contact" className="nav-item nav-link">Contact</a>
                </div>
                <div className="d-none d-xl-flex me-3">
                    <div className="d-flex flex-column pe-3 border-end border-primary">
                        <span className="text-body">Get Free Delivery</span>
                        <a href="tel:+4733378901"><span className="text-primary">Free: 84 + 398 948 675</span></a>
                    </div>
                </div>
                <button className="btn btn-primary btn-md-square d-flex flex-shrink-0 mb-3 mb-lg-0 rounded-circle me-3" data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fas fa-search"></i></button>

                {
                    user == null ?
                        <>
                            <a href="/authentication/sign-in" className="nav-item nav-link">Login</a>
                            <a href="/authentication/sign-up" className="nav-item nav-link">Sign-up</a>
                        </> :
                        <>
                            <Link to="/Cart" className="btn btn-primary rounded-pill d-inline-flex flex-shrink-0 py-2 px-4 ms-2">
                                        <AiOutlineShoppingCart size={24} />
                                        {totalQuantity > 0 && (
                                            <span className="badge bg-primary ms-2">{totalQuantity}</span>
                                        )}
                                    </Link>
                        </>
                }
                 
            </div>
        </nav>

    )
}

export default HasagiNav;