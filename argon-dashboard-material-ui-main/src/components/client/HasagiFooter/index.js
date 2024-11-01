import React from "react";
import "layouts/assets/css/style.css";
import "bootstrap";
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="container-fluid bg-black text-secondary mt-5">
            <div className="row px-xl-5 pt-5" style={{fontSize: "16px", paddingTop: "20px"}}>
                <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
                    <h5 className="text-secondary text-uppercase mb-4">Liên hệ</h5>
                    <p className="mb-4">Chúng tôi luôn sẵn sàng hỗ trợ bạn! Nếu bạn có bất kỳ câu hỏi nào về sản phẩm, đơn hàng, hoặc cần hỗ trợ thêm, xin vui lòng liên hệ với chúng tôi qua các kênh sau</p>
                    <p className="mb-2"><i className="fa fa-map-marker-alt text-warning mr-3"></i>123 Lê Bình, Quận Ninh Kiều, Thành phố Cần Thơ</p>
                    <p className="mb-2"><i className="fa fa-envelope text-warning mr-3"></i>hasagifashion@gmail.com</p>
                    <p className="mb-0"><i className="fa fa-phone-alt text-warning mr-3"></i>0942767262</p>
                </div>
                <div className="col-lg-8 col-md-12">
                    <div className="row">
                        <div className="col-md-4 mb-5">
                            <h5 className="text-secondary text-uppercase mb-4">Về Hasagifashion</h5>
                            <div className="d-flex flex-column justify-content-start">
                                <a className="text-secondary mb-2" href="/feature-section"><i className="fa fa-angle-right mr-2"></i>Trang chủ</a>
                                <a className="text-secondary mb-2" href="/Shop"><i className="fa fa-angle-right mr-2"></i>Sản phẩm</a>
                                <a className="text-secondary mb-2" href="/Cart"><i className="fa fa-angle-right mr-2"></i>Giỏ hàng</a>
                                <a className="text-secondary mb-2" href="/History"><i className="fa fa-angle-right mr-2"></i>Đơn hàng</a>
                                <a className="text-secondary mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Giới thiệu</a>
                                <a className="text-secondary" href="#"><i className="fa fa-angle-right mr-2"></i>Liên hệ</a>
                            </div>
                        </div>
                        <div className="col-md-4 mb-5">
                            <h5 className="text-secondary text-uppercase mb-4">Tài khoản</h5>
                            <div className="d-flex flex-column justify-content-start">
                                <a className="text-secondary mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Đăng nhập</a>
                                <a className="text-secondary mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Đăng ký</a>
                                <a className="text-secondary mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Đổi mật khẩu</a>
                                <a className="text-secondary mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Quên mật khẩu</a>
                                <a className="text-secondary mb-2" href="/History"><i className="fa fa-angle-right mr-2"></i>Đơn mua</a>
                                <a className="text-secondary" href="#"><i className="fa fa-angle-right mr-2"></i>Thông tin tài khoản</a>
                            </div>
                        </div>
                        <div className="col-md-4 mb-5">
                            <h5 className="text-secondary text-uppercase mb-4">Newsletter</h5>
                            <p>Duo stet tempor ipsum sit amet magna ipsum tempor est</p>
                            <form action="">
                                <div className="input-group">
                                    <input type="email" className="form-control" placeholder="Your Email Address" aria-label="Your Email Address" required />
                                    <div className="input-group-append">
                                        <button className="btn btn-warning" type="submit">Sign Up</button>
                                    </div>
                                </div>
                            </form>
                            <h6 className="text-secondary text-uppercase mt-4 mb-3">Theo dõi chúng tôi trên</h6>
                            <div className="d-flex">
                                <a className="btn btn-warning btn-square mr-2" href="#" aria-label="Twitter"><FaTwitter /></a>
                                <a className="btn btn-warning btn-square mr-2" href="#" aria-label="Facebook"><FaFacebookF /></a>
                                <a className="btn btn-warning btn-square mr-2" href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                                <a className="btn btn-warning btn-square" href="#" aria-label="Instagram"><FaYoutube /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default Footer;
