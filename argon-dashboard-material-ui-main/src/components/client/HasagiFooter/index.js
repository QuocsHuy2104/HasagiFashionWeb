import React from "react";
import "layouts/assets/css/style.css";
import "bootstrap";
import { FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="container-fluid bg-black text-secondary mt-5">
      <div className="row px-xl-5 pt-5" style={{ fontSize: "16px", paddingTop: "20px" }}>
        <div
          className="d-flex justify-content-between"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap", // Không xuống dòng
          }}
        >
          {/* Cột 1 - Liên hệ */}
          <div
            style={{
              flex: "2", // Chiếm gấp đôi diện tích so với các cột khác
              marginRight: "15px",
              color: "white",
            }}
          >
            <h5 className="text-light text-uppercase mb-4">Liên hệ</h5>
            <p className="mb-4">
              HASAGHIFASHION luôn cam kết, đảm bảo đưa sản phẩm trực tiếp từ nhà sản xuất đến tay người dùng và kiểm soát được chất lượng để đáp ứng được nhu cầu ngày càng cao của khách hàng.
            </p>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt mr-3" style={{ color: 'yellow' }}></i>
              Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ, Việt Nam
            </p>
            <p className="mb-2">
              <i className="fa fa-envelope mr-3" style={{ color: 'yellow' }}></i>
              hasagifashion@gmail.com
            </p>
            <p className="mb-0">
              <i className="fa fa-phone-alt mr-3" style={{ color: 'yellow' }}></i>
              +84 398 948 675
            </p>
          </div>

          {/* Cột 2 - Cửa hàng */}
          <div
            style={{
              flex: "1",
              margin: "0 20px",
              minWidth: "100px",
            }}
          >
            <h5 className="text-light text-uppercase mb-4">Cửa hàng</h5>
            <div className="d-flex flex-column justify-content-start">
              <a className="text-light mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Trang chủ</a>
              <a className="text-light mb-2" href="/Shop"><i className="fa fa-angle-right mr-2"></i>Sản phẩm</a>
              <a className="text-light mb-2" href="/AboutAbout"><i className="fa fa-angle-right mr-2"></i>Giới thiệu</a>
              <a className="text-light mb-2" href="/ContactContact"><i className="fa fa-angle-right mr-2"></i>Liên hệ</a>
              <a className="text-light mb-2" href="Q&A"><i className="fa fa-angle-right mr-2"></i>Hỏi đáp</a>
            </div>
          </div>

          {/* Cột 3 - Về chúng tôi */}
          <div
            style={{
              flex: "1",
              margin: "0 15px",
              marginRight: "0"
            }}
          >
            <h5 className="text-light text-uppercase mb-4">Về chúng tôi</h5>
            <div className="d-flex flex-column justify-content-start">
              <a className="text-light mb-2" href="/DoiTra"><i className="fa fa-angle-right mr-2"></i>Chính sách đổi trả</a>
              <a className="text-light mb-2" href="/BaoMat"><i className="fa fa-angle-right mr-2"></i>Chính sách bảo mật</a>
              <a className="text-light mb-2" href="/DieuKhoan"><i className="fa fa-angle-right mr-2"></i>Điều khoản dịch vụ</a>
            </div>
          </div>

          {/* Cột 4 - Tài khoản */}
          <div
            style={{
              flex: "1",
              margin: "0 15px",
              minWidth: "150px",
            }}
          >
            <h5 className="text-light text-uppercase mb-4">Tài khoản</h5>
            <div className="d-flex flex-column justify-content-start">
              <a className="text-light mb-2" href="/authentication/sign-in"><i className="fa fa-angle-right mr-2"></i>Đăng nhập</a>
              <a className="text-light mb-2" href="/authentication/sign-upup"><i className="fa fa-angle-right mr-2"></i>Đăng kí</a>
              <a className="text-light mb-2" href="/forgot-password"><i className="fa fa-angle-right mr-2"></i>Quên mật khẩu</a>
            </div>
          </div>

          <div
            style={{
              flex: "1",
              margin: "0 15px",
              minWidth: "150px",
            }}
          >
            <h5 className="text-light text-uppercase mb-4">Theo dõi chúng tôi</h5>
            <div className="d-flex">
              <a className="btn btn-square mr-2" href="https://www.tiktok.com/@hasagifashion" aria-label="Twitter" style={{ color: 'black', backgroundColor: 'yellow' }}><FaTiktok /></a>
              {/* <a className="btn btn-square mr-2" href="#" aria-label="Facebook" style={{color: 'black', backgroundColor: 'yellow'}}><FaFacebookF /></a> */}
              <a className="btn btn-square" href="https://www.youtube.com/channel/UCLs3upaebFjIYnB_EvnTNMQ" aria-label="Instagram" style={{ color: 'black', backgroundColor: 'yellow' }}><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="row border-top mx-xl-5 py-4" style={{fontSize: "16px", marginTop: "10px"}}>
        <div className="col-md-6 text-left">
          <p className="mb-md-0 text-white">
            &copy; <a className="text-warning" href="">2024</a> - Bản quyền thuộc về
            <a className="text-warning" href=""> HasagiFashion</a>
          </p>
        </div>
      </div>


    </div>
  );
}

export default Footer;
