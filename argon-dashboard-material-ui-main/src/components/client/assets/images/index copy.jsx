import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

//css
import 'bootstrap/dist/css/bootstrap.min.css'; // Sử dụng bootstrap từ npm
import '../../components/client/assets/css/style1.css'; // Giữ nguyên nếu đây là style tùy chỉnh của bạn

//js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'swiper/swiper-bundle.min.css';
import '../../components/client/assets/js/script';


//image
import logoImage from '../../components/client/assets/images/logo.png';
import banner1 from '../../components/client/assets/images/product-thumb-1.png';
import banner2 from '../../components/client/assets/images/product-thumb-2.png';
import adImg1 from '../../components/client/assets/images/ad-image-1.png';
import adImg2 from '../../components/client/assets/images/ad-image-2.png';
import cate1 from '../../components/client/assets/images/icon-animal-products-drumsticks.png';
import cate2 from '../../components/client/assets/images/icon-bread-baguette.png';
import cate3 from '../../components/client/assets/images/icon-bread-herb-flour.png';
import cate4 from '../../components/client/assets/images/icon-soft-drinks-bottle.png';
import cate5 from '../../components/client/assets/images/icon-vegetables-broccoli.png';
import cate6 from '../../components/client/assets/images/icon-wine-glass-bottle.png';

//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';


import 'swiper/swiper-bundle.min.css'; // Nhập styles của Swiper

// Cài đặt các modules mà bạn 

function MyComponent() {



  return (
    <>




      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasCart" aria-labelledby="My Cart">
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">3</span>
            </h4>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Growers cider</h6>
                  <small className="text-body-secondary">Brief description</small>
                </div>
                <span className="text-body-secondary">$12</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Fresh grapes</h6>
                  <small className="text-body-secondary">Brief description</small>
                </div>
                <span className="text-body-secondary">$8</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Heinz tomato ketchup</h6>
                  <small className="text-body-secondary">Brief description</small>
                </div>
                <span className="text-body-secondary">$5</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>$20</strong>
              </li>
            </ul>

            <button className="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
          </div>
        </div>
      </div>


      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasSearch"
        aria-labelledby="Search">
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Search</span>
            </h4>
            <form role="search" action="index.html" method="get" className="d-flex mt-3 gap-0">
              <input className="form-control rounded-start rounded-0 bg-light" type="email"
                placeholder="What are you looking for?" aria-label="What are you looking for?" />
              <button className="btn btn-dark rounded-end rounded-0" type="submit">Search</button>
            </form>
          </div>
        </div>
      </div>




      <header>
        <div className="container-fluid">
          <div className="row py-3 border-bottom">
            <div className="col-sm-4 col-lg-3 text-center text-sm-start">
              <div className="main-logo">
                <a href="/">
                  <img
                    src={logoImage}
                    alt="logo"
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

            <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
              <div className="search-bar row p-2 rounded-4" style={{ backgroundColor: '#c4d3d3' }}>
                <div className="col-md-4 d-none d-md-block">
                  <select className="form-select border-0 bg-transparent">
                    <option>Tất cả danh mục</option>
                    <option>Áo</option>
                    <option>Quần</option>
                    <option>Giày</option>
                  </select>
                </div>
                <div className="col-11 col-md-7">
                  <form id="search-form" className="text-center" action="index.html" method="post">
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </form>
                </div>
                <div className="col-1">
                  <FontAwesomeIcon icon={faSearch} style={{ fontSize: '20px', color: 'black' }} />
                </div>
              </div>
            </div>

            <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
              <div className="support-box text-end d-none d-xl-block">
                <span className="fs-6 text-muted">Hỗ trợ ?</span>
                <h5 className="mb-0">+84 917 465 863</h5>
              </div>

              <ul className="d-flex justify-content-end list-unstyled m-0">
                <li>
                  <a href="#" className="rounded-circle bg-light p-2 mx-1">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', color: 'black' }} />
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-circle bg-light p-2 mx-1">
                    <FontAwesomeIcon icon={faHeart} style={{ fontSize: '20px', color: 'black' }} />
                  </a>
                </li>
                <li className="d-lg-none">
                  <a href="#" className="rounded-circle bg-light p-2 mx-1" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use xlinkHref="#cart"></use>
                    </svg>
                  </a>
                </li>
                <li className="d-lg-none">
                  <a href="#" className="rounded-circle bg-light p-2 mx-1" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSearch" aria-controls="offcanvasSearch">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use xlinkHref="#search"></use>
                    </svg>
                  </a>
                </li>
              </ul>

              <div className="cart text-end d-none d-lg-block dropdown">
                <button className="border-0 bg-transparent d-flex flex-column gap-2 lh-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                  <span className="fs-6 text-muted dropdown-toggle">Giỏ hàng</span>
                  <span className="cart-total fs-5 fw-bold">500.000đ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row py-3">
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
                    <select className="filter-categories border-0 mb-0 me-5">
                      <option>Shop by Departments</option>
                      <option>Groceries</option>
                      <option>Drinks</option>
                      <option>Chocolates</option>
                    </select>

                    <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                      <li className="nav-item active">
                        <a href="#women" className="nav-link">Trang chủ</a>
                      </li>
                      <li className="nav-item dropdown">
                        <a href="#men" className="nav-link">Sản phẩm</a>
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
                          <li><a href="index.html" className="dropdown-item">Contact Us</a></li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>


      {/* <section className="py-3">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">

              <div className="banner-blocks">

                <div className="banner-ad large bg-info block-1">

                  <div className="swiper main-swiper">
                    <div className="swiper-wrapper">

                      <div className="swiper-slide">
                        <div className="row banner-content p-5">
                          <div className="content-wrapper col-md-7">
                            <div className="categories my-3">100% natural</div>
                            <h3 className="display-4">Fresh Smoothie & Summer Juice</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.</p>
                            <a href="#"
                              className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 px-4 py-3 mt-3">Shop Now</a>
                          </div>
                          <div className="img-wrapper col-md-5">
                            <img src={banner1} className="img-fluid" />
                          </div>
                        </div>
                      </div>

                      <div className="swiper-slide">
                        <div className="row banner-content p-5">
                          <div className="content-wrapper col-md-7">
                            <div className="categories mb-3 pb-3">100% natural</div>
                            <h3 className="banner-title">Fresh Smoothie & Summer Juice</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.</p>
                            <a href="#" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">Shop
                              Collection</a>
                          </div>
                          <div className="img-wrapper col-md-5">
                            <img src={banner1} className="img-fluid" />
                          </div>
                        </div>
                      </div>

                      <div className="swiper-slide">
                        <div className="row banner-content p-5">
                          <div className="content-wrapper col-md-7">
                            <div className="categories mb-3 pb-3">100% natural</div>
                            <h3 className="banner-title">Heinz Tomato Ketchup</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.</p>
                            <a href="#" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">Shop
                              Collection</a>
                          </div>
                          <div className="img-wrapper col-md-5">
                            <img src={banner2} className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="swiper-pagination"></div>

                  </div>
                </div>

                <div className="banner-ad bg-success-subtle block-2"
                  style={{
                    backgroundImage: `url(${adImg1})`, // Sử dụng dấu backtick cho template literals
                    backgroundRepeat: 'no-repeat', // Đặt giá trị đúng dạng chuỗi
                    backgroundSize: 'cover' // Đặt giá trị đúng dạng chuỗi
                  }}>
                  <div className="row banner-content p-5">

                    <div className="content-wrapper col-md-7">
                      <div className="categories sale mb-3 pb-3">20% off</div>
                      <h3 className="banner-title">Fruits & Vegetables</h3>
                      <a href="#" className="d-flex align-items-center nav-link">Shop Collection <svg width="24" height="24">
                        <use xlinkHref="#arrow-right"></use>
                      </svg></a>
                    </div>

                  </div>
                </div>

                <div className="banner-ad bg-danger block-3"
                  style={{
                    backgroundImage: `url(${adImg2})`, // Sử dụng dấu backtick cho template literals
                    backgroundRepeat: 'no-repeat', // Đặt giá trị đúng dạng chuỗi
                    backgroundSize: 'cover' // Đặt giá trị đúng dạng chuỗi
                  }}>
                  <div className="row banner-content p-5">

                    <div className="content-wrapper col-md-7">
                      <div className="categories sale mb-3 pb-3">15% off</div>
                      <h3 className="item-title">Baked Products</h3>
                      <a href="#" className="d-flex align-items-center nav-link">Shop Collection <svg width="24" height="24">
                        <use xlinkHref="#arrow-right"></use>
                      </svg></a>
                    </div>

                  </div>
                </div>

              </div>


            </div>
          </div>
        </div>
      </section> */}





      <section className="py-5">
        <div className="container-fluid">

          <div className="row">
            <div className="col-md-12">

              <div className="bootstrap-tabs product-tabs">
                <div className="tabs-header d-flex justify-content-between border-bottom my-5">
                  <h3>Trending Products</h3>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <a href="#" className="nav-link text-uppercase fs-6 active" id="nav-all-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-all">All</a>
                      <a href="#" className="nav-link text-uppercase fs-6" id="nav-fruits-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-fruits">Fruits & Veges</a>
                      <a href="#" className="nav-link text-uppercase fs-6" id="nav-juices-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-juices">Juices</a>
                    </div>
                  </nav>
                </div>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab">

                    <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">

                      <div className="col">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">-30%</span>
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">-30%</span>
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-biscuits.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-cucumber.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-milk.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-biscuits.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-cucumber.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-milk.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-biscuits.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                    </div>
                    /

                  </div>

                  <div className="tab-pane fade" id="nav-fruits" role="tabpanel" aria-labelledby="nav-fruits-tab">

                    <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">

                      <div className="col">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">-30%</span>
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-cucumber.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">-30%</span>
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-milk.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">-30%</span>
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-orange-juice.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-raspberries.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                  <div className="tab-pane fade" id="nav-juices" role="tabpanel" aria-labelledby="nav-juices-tab">

                    <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-cucumber.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-milk.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-tomatoes.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-tomatoketchup.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist"><svg width="24" height="24">
                            <use xlinkHref="#heart"></use>
                          </svg></a>
                          <figure>
                            <a href="index.html" title="Product Title">
                              <img src="images/thumb-bananas.png" className="tab-image" />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span><span className="rating"><svg width="24" height="24"
                            className="text-primary">
                            <use xlinkHref="#star-solid"></use>
                          </svg> 4.5</span>
                          <span className="price">$18.00</span>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="input-group product-qty">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number"
                                  data-type="minus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#minus"></use>
                                  </svg>
                                </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" className="form-control input-number" value="1" />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number"
                                  data-type="plus">
                                  <svg width="16" height="16">
                                    <use xlinkHref="#plus"></use>
                                  </svg>
                                </button>
                              </span>
                            </div>
                            <a href="#" className="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart" /></a>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default MyComponent;
