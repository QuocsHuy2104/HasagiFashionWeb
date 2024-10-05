import React from "react";
import "components/client/assets/css/ShopDetail.css";
import "components/client/assets/css/style.css";
import "bootstrap";
import logoImage from 'components/client/assets/images/Hasagi.png';
import aboutImage from "components/client/assets/images/payment.png";
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="py-5 bg-secondary" style={{ color: 'black' }}>
            <div className="container-fluid">
                <div className="row">

                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer-menu">
                            <div className="main-logo">
                                <a href="/" className="logo-link">
                                    <img
                                        src={logoImage}
                                        alt="logo"
                                        className="img-fluid logo-image"
                                    />
                                    <span className="logo-text">Hasagi Fashion</span>
                                </a>
                            </div>
                            <div className="social-links mt-5">
                                <ul className="d-flex list-unstyled gap-2">
                                    <li>
                                        <a href="#" className="btn btn-outline-light" aria-label="Facebook">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.05.28-1.73 1.76-1.73Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="btn btn-outline-light" aria-label="Twitter">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M22.991 3.95a1 1 0 0 0-1.51-.86a7.48 7.48 0 0 1-1.874.794a5.152 5.152 0 0 0-3.374-1.242a5.232 5.232 0 0 0-5.223 5.063a11.032 11.032 0 0 1-6.814-3.924a1.012 1.012 0 0 0-.857-.365a.999.999 0 0 0-.785.5a5.276 5.276 0 0 0-.242 4.769l-.002.001a1.041 1.041 0 0 0-.496.89a3.042 3.042 0 0 0 .027.439a5.185 5.185 0 0 0 1.568 3.312a.998.998 0 0 0-.066.77a5.204 5.204 0 0 0 2.362 2.922a7.465 7.465 0 0 1-3.59.448A1 1 0 0 0 1.45 19.3a12.942 12.942 0 0 0 7.01 2.061a12.788 12.788 0 0 0 12.465-9.363a12.822 12.822 0 0 0 .535-3.646l-.001-.2a5.77 5.77 0 0 0 1.532-4.202Zm-3.306 3.212a.995.995 0 0 0-.234.702c.01.165.009.331.009.488a10.824 10.824 0 0 1-.454 3.08a10.685 10.685 0 0 1-10.546 7.93a10.938 10.938 0 0 1-2.55-.301a9.48 9.48 0 0 0 2.942-1.564a1 1 0 0 0-.602-1.786a3.208 3.208 0 0 1-2.214-.935q.224-.042.445-.105a1 1 0 0 0-.08-1.943a3.198 3.198 0 0 1-2.25-1.726a5.3 5.3 0 0 0 .545.046a1.02 1.02 0 0 0 .984-.696a1 1 0 0 0-.4-1.137a3.196 3.196 0 0 1-1.425-2.673c0-.066.002-.133.006-.198a13.014 13.014 0 0 0 8.21 3.48a1.02 1.02 0 0 0 .817-.36a1 1 0 0 0 .206-.867a3.157 3.157 0 0 1-.087-.729a3.23 3.23 0 0 1 3.226-3.226a3.184 3.184 0 0 1 2.345 1.02a.993.993 0 0 0 .921.298a9.27 9.27 0 0 0 1.212-.322a6.681 6.681 0 0 1-1.026 1.524Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="btn btn-outline-light" aria-label="Instagram">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M23 9.71a8.5 8.5 0 0 0-.91-4.13a2.92 2.92 0 0 0-1.72-1A78.36 78.36 0 0 0 12 4.27a78.45 78.45 0 0 0-8.34.3a2.87 2.87 0 0 0-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 0 0 0 6.48a9.55 9.55 0 0 0 .3 2a3.14 3.14 0 0 0 .71 1.36a2.86 2.86 0 0 0 1.49.78a45.18 45.18 0 0 0 6.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 0 0 1.53-.78a2.49 2.49 0 0 0 .61-1a10.58 10.58 0 0 0 .52-3.4c.04-.56.04-3.94.04-4.54ZM9.74 14.85V8.66l5.92 3.11c-1.66.92-3.85 1.96-5.92 3.08Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="btn btn-outline-light" aria-label="LinkedIn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M17.34 5.46a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2Zm4.6 2.42a7.59 7.59 0 0 0-.46-2.43a4.94 4.94 0 0 0-1.16-1.77a4.7 4.7 0 0 0-1.77-1.15a7.3 7.3 0 0 0-2.43-.47C15.06 2 14.72 2 12 2s-3.06 0-4.12.06a7.3 7.3 0 0 0-2.43.47a4.78 4.78 0 0 0-1.77 1.15a4.7 4.7 0 0 0-1.15 1.77a7.3 7.3 0 0 0-.47 2.43c0 1.06 0 1.38 0 2.68s0 1.62 0 2.67c0 1.07 0 1.39 0 2.68a1 1 0 0 0 1 1h5.57v4h-4a1 1 0 0 0 0 2h6.67v-4h-1.67v-4h2.34l-2-4h-1.67v-2a1 1 0 0 0 1-1h2.66a1 1 0 0 0 1-1v-1c0-.39-.35-.5-.61-.5a1 1 0 0 0-1 1h-2v1a1 1 0 0 0 1 1h.67Z" />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <h5 className="text-uppercase">Help</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-dark" >FAQ</a></li>
                            <li><a href="#" className="text-dark">Contact Us</a></li>
                            <li><a href="#" className="text-dark">Returns</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <h5 className="text-uppercase">Company</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-dark">About Us</a></li>
                            <li><a href="#" className="text-dark">Careers</a></li>
                            <li><a href="#" className="text-dark">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <h5 className="text-uppercase">Stay Connected</h5>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" placeholder="Your email" />
                            </div>
                            <button type="submit" className="btn btn-light">Subscribe</button>
                        </form>
                    </div>

                </div>
            </div>
        </footer>

    )
}

export default Footer;