import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import "components/client/assets/css/style.css";
// import "components/client/assets/css/Client.css";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import Footer from "components/client/HasagiFooter";
import HasagiNav from "components/client/HasagiHeader";
import HasagiCau from "components/client/HasagiCarousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// import "bootstrap";
import { Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineSearch,
  AiOutlineArrowUp,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import aboutImage from "components/client/assets/images/hinh1.jpg";
import aboutImage1 from "components/client/assets/images/y1.png";
import aboutImage2 from "components/client/assets/images/m1.jpg";
import aboutImage3 from "components/client/assets/images/m2.jpg";
import aboutImage4 from "components/client/assets/images/k1r.jpg";
import aboutImage5 from "components/client/assets/images/t4.jpg";
import aboutImage6 from "components/client/assets/images/t5.jpg";
import aboutImage7 from "components/client/assets/images/t6.jpg";
import CheckIcon from "@mui/icons-material/Check";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import SwapHorizSharpIcon from "@mui/icons-material/SwapHorizSharp";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EggOutlinedIcon from "@mui/icons-material/EggOutlined";
import DiamondIcon from "@mui/icons-material/Diamond";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import StreamIcon from "@mui/icons-material/Stream";
import SettingsAccessibilityOutlinedIcon from "@mui/icons-material/SettingsAccessibilityOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import axios from "axios";
import ArgonInput from "components/ArgonInput";
import { Carousel } from "react-responsive-carousel";

const Body = () => {
  return (
    <>
      {/* Features Section */}
      <ArgonBox className="container-fluid feature bg-light py-1">
        <ArgonBox className="container py-1">
          <div className="row g-4 feature-container" style={{ marginTop: "-80px" }}>
            <FeatureItem
              icon={
                <CheckIcon
                  className="feature-icon"
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out",
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Sản phẩm chất lượng</span>}
              delay="0.2s"
            />
            <FeatureItem
              icon={
                <AirportShuttleIcon
                  className="feature-icon"
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out",
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Miễn phí vận chuyển</span>}
              delay="0.4s"
            />
            <FeatureItem
              icon={
                <SwapHorizSharpIcon
                  className="feature-icon"
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out",
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Hoàn trả trong 14 ngày</span>}
              delay="0.6s"
            />
            <FeatureItem
              icon={
                <PhoneInTalkIcon
                  className="feature-icon"
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out",
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Hỗ trợ 24/7</span>}
              delay="0.8s"
            />
          </div>
        </ArgonBox>
      </ArgonBox>

      {/* About Section */}
      <ArgonBox className="container-fluid about overflow-hidden py-5">
        <ArgonBox className="container py-0">
          <div className="row g-0">
            <div className="col-xl-6 wow fadeInLeft" data-wow-delay="0.2s">
              <div className="about-img rounded h-100">
                <img
                  src={aboutImage}
                  className="img-fluid rounded h-100 w-100"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
                <div className="about-exp">
                  <span>2 năm kinh nghiệm</span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
              <ArgonBox className="about-item">
                <ArgonTypography
                  variant="h2"
                  fontWeight="bold"
                  mb={3}
                  style={{ marginLeft: "20px" }}
                >
                  Chúng tôi cung cấp cho bạn những sản phẩm chất lượng
                </ArgonTypography>

                <ArgonBox className="bg-light rounded p-4 mb-4">
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex">
                        <div className="pe-4">
                          <div
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <SupportAgentIcon
                              style={{
                                fontSize: "48px",
                                width: "48px",
                                height: "48px",
                                color: "white",
                                transition: "transform 0.5s ease-in-out", // Smooth transition
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "rotate(360deg)"; // Spin the icon
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "rotate(0deg)"; // Reset the spin
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <ArgonTypography variant="h4" component="a" href="#" mb={3}>
                            Sự hài lòng của khách hàng
                          </ArgonTypography>
                          <ArgonTypography style={{ textAlign: "justify", lineHeight: "1.5" }}>
                            Sự hài lòng của khách hàng là yếu tố vô cùng quan trọng trong thời trang
                            ngành công nghiệp. Để đạt được sự hài lòng của khách hàng, các thương
                            hiệu thời trang và cửa hàng cần tập trung vào nhiều yếu tố, từ chất
                            lượng sản phẩm đến dịch vụ khách hàng.
                          </ArgonTypography>
                        </div>
                      </div>
                    </div>
                  </div>
                </ArgonBox>
                <ArgonBox className="bg-light rounded p-4 mb-4">
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex">
                        <div className="pe-4">
                          <div
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <VolunteerActivismIcon
                              style={{
                                fontSize: "48px",
                                width: "48px",
                                height: "48px",
                                color: "white",
                                transition: "transform 0.5s ease-in-out", // Smooth transition
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "rotate(360deg)"; // Spin the icon
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "rotate(0deg)"; // Reset the spin
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <ArgonTypography variant="h4" component="a" href="#" mb={3}>
                            Sản phẩm chất lượng
                          </ArgonTypography>
                          <ArgonTypography style={{ textAlign: "justify", lineHeight: "1.5" }}>
                            Chất lượng sản phẩm: Khách hàng luôn mong muốn nhận được sản phẩm chất
                            lượng cao, từ chất liệu đến đường may và kiểu dáng. Sản phẩm phải bền
                            đẹp và thoải mái khi mặc.
                          </ArgonTypography>
                        </div>
                      </div>
                    </div>
                  </div>
                </ArgonBox>
                <ArgonBox className="bg-light rounded p-4 mb-4">
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex">
                        <div className="pe-4">
                          <div
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <EggOutlinedIcon
                              style={{
                                fontSize: "48px",
                                width: "48px",
                                height: "48px",
                                color: "white",
                                transition: "transform 0.5s ease-in-out", // Smooth transition
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "rotate(360deg)"; // Spin the icon
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "rotate(0deg)"; // Reset the spin
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <ArgonTypography variant="h4" component="a" href="#" mb={3}>
                            Dịch vụ khách hàng
                          </ArgonTypography>
                          <ArgonTypography style={{ textAlign: "justify", lineHeight: "1.5" }}>
                            Dịch vụ khách hàng: Tư vấn nhiệt tình, chu đáo và thân thiện là điều bất
                            kỳ khách hàng nào cũng mong đợi. Khả năng giải quyết vấn đề nhanh chóng
                            và hiệu quả cũng góp phần tạo nên sự hài lòng.
                          </ArgonTypography>
                        </div>
                      </div>
                    </div>
                  </div>
                </ArgonBox>
              </ArgonBox>
            </div>
          </div>
        </ArgonBox>
      </ArgonBox>

      {/* Counter Section */}
      <div className="container-fluid counter py-5">
        <div className="container py-5">
          <div className="row g-5">
            <CounterItem
              icon={
                <ThumbUpOutlinedIcon
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out", // Smooth transition
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "rotate(360deg)"; // Spin the icon
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "rotate(0deg)"; // Reset the spin
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Happy Clients</span>}
              count="456"
              delay="0.2s"
            />
            <CounterItem
              icon={
                <FavoriteOutlinedIcon
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out", // Smooth transition
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "rotate(360deg)"; // Spin the icon
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "rotate(0deg)"; // Reset the spin
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Transport</span>}
              count="513"
              delay="0.4s"
            />
            <CounterItem
              icon={
                <PeopleAltOutlinedIcon
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out", // Smooth transition
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "rotate(360deg)"; // Spin the icon
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "rotate(0deg)"; // Reset the spin
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Employees</span>}
              count="53"
              delay="0.6s"
            />
            <CounterItem
              icon={
                <LocalShippingOutlinedIcon
                  style={{
                    fontSize: "48px",
                    width: "48px",
                    height: "48px",
                    color: "white",
                    transition: "transform 0.5s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "rotate(360deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "rotate(0deg)";
                  }}
                />
              }
              title={<span style={{ fontWeight: "bold" }}>Years Experience</span>}
              count="17"
              delay="0.8s"
            />
          </div>
        </div>
      </div>

      {/* Service Section */}
      <div className="container-fluid service bg-light overflow-hidden py-0">
        <div className="container py-0">
          <div
            className="text-center mx-auto pb-0 wow fadeInUp"
            data-wow-delay="0.2s"
            style={{ maxWidth: "900px" }}
          >
            <ArgonTypography variant="h1" fontWeight="bold" mb={3} className="color-changing-text">
              Bảo vệ phong cách của bạn với những lựa chọn thời trang hàng đầu
            </ArgonTypography>
          </div>
          <div className="row gx-0 gy-3 align-items-center">
            <div
              className="col-lg-1 col-xl-4 wow fadeInLeft"
              data-wow-delay="0.2s"
              // style={{ marginLeft: "40px" }}
            >
              <ServiceItem
                icon={
                  <DiamondIcon
                    style={{ fontSize: "48px", width: "48px", height: "48px", color: "white" }}
                  />
                }
                description={
                  <div style={{ lineHeight: "1.6" }}>
                    Thời trang cao cấp và những thương hiệu độc quyền vẫn giữ một vị trí quan trọng.
                  </div>
                }
              />

              <ServiceItem
                icon={
                  <EmojiPeopleIcon
                    style={{ fontSize: "48px", width: "48px", height: "48px", color: "white" }}
                  />
                }
                description={
                  <div style={{ lineHeight: "1.5" }}>
                    Cho phép mọi người tự do thể hiện phong cách riêng của mình.
                  </div>
                }
              />
              <ServiceItem
                icon={
                  <StreamIcon
                    style={{ fontSize: "48px", width: "48px", height: "48px", color: "white" }}
                  />
                }
                description="Ngành công nghiệp thời trang ngày càng tập trung vào tính bền vững."
              />
            </div>
            <div className="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-transparent">
                <img src={aboutImage1} className="img-fluid w-100" alt="About Image" />
              </div>
            </div>
            <div
              className="col-lg-6 col-xl-4 wow fadeInRight"
              data-wow-delay="0.2s"
              style={{ marginLeft: "-45px" }}
            >
              <ServiceItem
                icon={
                  <SettingsAccessibilityOutlinedIcon
                    style={{ fontSize: "48px", width: "48px", height: "48px", color: "white" }}
                  />
                }
                description={
                  <div style={{ textAlign: "justify", lineHeight: "1.5" }}>
                    Quần áo như đồ thể thao và đồ mặc nhà đang ngày càng trở nên phổ biến.
                  </div>
                }
              />
              <ServiceItem
                icon={
                  <AutoFixHighOutlinedIcon
                    style={{ fontSize: "48px", width: "48px", height: "48px", color: "white" }}
                  />
                }
                description="Thời trang ngày nay không chỉ là bề ngoài mà còn là tính thực dụng."
              />
              <ServiceItem
                icon={
                  <ReplayOutlinedIcon
                    style={{ fontSize: "48px", width: "48px", height: "48px", color: "white" }}
                  />
                }
                description="Thời trang ngày nay thay đổi liên tục với tốc độ nhanh chóng nhờ mạng xã hội."
              />
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="btn btn-primary border-3 border-primary rounded-circle back-to-top">
        <AiOutlineArrowUp />
      </a>
    </>
  );
};

// FeatureItem Component
const FeatureItem = ({ icon, title, delay, ...rest }) => (
  <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay={delay}>
    <div className="feature-item text-center">
      <div className="feature-icon mb-4">{icon}</div>
      <h4 className="mb-3">{title}</h4>
    </div>
  </div>
);

FeatureItem.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  delay: PropTypes.string.isRequired,
};

// CounterItem Component
const CounterItem = ({ icon, title, count, delay }) => (
  <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay={delay}>
    <div className="counter-item">
      <div className="counter-item-icon mx-auto">{icon}</div>
      <h4 className="text-white my-4">{title}</h4>
      <div className="counter-counting">
        <span className="text-white fs-2 fw-bold" data-toggle="counter-up">
          {count}
        </span>
        <span className="h1 fw-bold text-white">+</span>
      </div>
    </div>
  </div>
);

CounterItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  delay: PropTypes.string.isRequired,
};

// ServiceItem Component
const ServiceItem = ({ icon, title, description }) => (
  <div className="service-item rounded p-4 mb-4">
    <div className="row">
      <div className="col-12">
        <div className="d-flex">
          <div className="pe-4">
            <div className="service-btn">{icon}</div>
          </div>
          <div className="service-content">
            <a href="#" className="h4 d-inline-block mb-3">
              {title}
            </a>
            <p className="mb-0">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

ServiceItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
const ProductItem = ({ imgSrc, description, title, price }) => (
  <div className="col-lg-6 col-xl-4 wow fadeInUp">
    <ArgonBox className="product-item">
      <ArgonBox className="product-image">
        <img
          src={components / client / assets / images / imgSrc}
          alt={title}
          className="img-fluid"
        />
      </ArgonBox>
      <ArgonBox className="product-content bg-light text-center rounded-bottom p-4">
        <ArgonTypography>{description}</ArgonTypography>
        <ArgonTypography variant="h4" component="a" href="#" mb={3}>
          {title}
        </ArgonTypography>
        <ArgonTypography variant="h4" color="primary" mb={3}>
          {price}
        </ArgonTypography>
        <ArgonButton color="secondary" rounded="pill" py={2} px={4}>
          Read More
        </ArgonButton>
      </ArgonBox>
    </ArgonBox>
  </div>
);

ProductItem.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};
export default Body;
