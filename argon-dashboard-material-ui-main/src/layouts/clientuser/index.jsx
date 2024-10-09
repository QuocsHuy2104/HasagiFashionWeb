
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "components/client/assets/css/style.css";
import "components/client/assets/css/Client.css";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import Footer from "components/client/HasagiFooter";
import HasagiNav from "components/client/HasagiHeader";
import HasagiCau from "components/client/HasagiCarousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Spinner from "../../components/client/HasagiSpiner";
import Search from "../../components/client/HasagiSearch";

// import "bootstrap";
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineHeart, AiFillStar, AiOutlineSearch, AiOutlineArrowUp, AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import aboutImage from "components/client/assets/images/hinh1.jpg";
import aboutImage1 from "components/client/assets/images/y1.png";
import aboutImage2 from "components/client/assets/images/m1.jpg";
import aboutImage3 from "components/client/assets/images/m2.jpg";
import aboutImage4 from "components/client/assets/images/k1r.jpg";
import aboutImage5 from "components/client/assets/images/t4.jpg";
import aboutImage6 from "components/client/assets/images/t5.jpg";
import aboutImage7 from "components/client/assets/images/t6.jpg";
import CheckIcon from '@mui/icons-material/Check';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EggOutlinedIcon from '@mui/icons-material/EggOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import StreamIcon from '@mui/icons-material/Stream';
import SettingsAccessibilityOutlinedIcon from '@mui/icons-material/SettingsAccessibilityOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import axios from "axios";
import ArgonInput from "components/ArgonInput";
import { Carousel } from 'react-responsive-carousel';
import Cookies from "js-cookie";
import ProductService from "../../services/ProductServices";
import CategoryService from "../../services/CategoryServices";
import BrandService from "../../services/BrandServices";
import ColorService from "../../services/ColorServices";
import SizeService from "../../services/SizeServices";



const FeaturesAndAbout = () => {

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);

  const pageSize = 16;
  const categoryPages = [];

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setLoading(false);
      }
    };
    console.log('AccountId from cookie:', Cookies.get('accountId'));
    fetchData();
  }, []);


  for (let i = 0; i < categories.length; i += pageSize) {
    categoryPages.push(categories.slice(i, i + pageSize));
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAllCategories();
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await BrandService.getAllBrands();
        setBrands(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };


    fetchProducts();
    fetchCategories();
    fetchBrands()
  }, []);
  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      // Logic to show all categories
      setSelectedCategory('');
      setCurrentCategoryPage(0);
    } else {
      setSelectedCategory(categoryId);
      setCurrentPage(1);
    }
  };

  const handleBrandChange = (trademarkId) => {
    setSelectedBrand(trademarkId);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "" || product.categoryId === Number(selectedCategory);
    const matchesBrand = selectedBrand === "" || product.trademarkId === Number(selectedBrand);
    const matchesSearch = product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "price-asc") {
      return (a.importPrice || 0) - (b.importPrice || 0);
    } else if (sortOption === "price-desc") {
      return (b.importPrice || 0) - (a.importPrice || 0);
    } else if (sortOption === "popularity") {
      return (b.popularity || 0) - (a.popularity || 0);
    } else if (sortOption === "newest") {
      return (new Date(b.date) - new Date(a.date));
    } else {
      return 0;
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };
  return (
    <>
      <Spinner loading={loading} />
      <Search />
      <div className="container-fluid position-relative p-0">
        <HasagiNav />
        <HasagiCau />
      </div>


      {/* Features Section */}
      <ArgonBox className="container-fluid feature bg-light py-100">
        <ArgonBox className="container py-5">
          <ArgonBox className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" sx={{ maxWidth: "800px" }}>
            <ArgonTypography variant="h4" color="primary" textTransform="uppercase">Our Feature</ArgonTypography>
            <ArgonTypography variant="h1" fontWeight="bold" mb={3}>A Trusted Name In Bottled Water
              Industry</ArgonTypography>
          </ArgonBox>
          <div className="row g-4 feature-container">
            <FeatureItem
              icon={
                <CheckIcon
                  className="feature-icon"
                  style={{
                    fontSize: '48px',
                    width: '48px',
                    height: '48px',
                    color: 'white',
                    transition: 'transform 0.5s ease-in-out',
                  }}
                />
              }
              title={<span style={{ fontWeight: 'bold' }}>Quality Product</span>}
              delay="0.2s"
            />
            <FeatureItem
              icon={
                <AirportShuttleIcon
                  className="feature-icon"
                  style={{
                    fontSize: '48px',
                    width: '48px',
                    height: '48px',
                    color: 'white',
                    transition: 'transform 0.5s ease-in-out',
                  }}
                />
              }
              title={<span style={{ fontWeight: 'bold' }}>Free Shipping</span>}
              delay="0.4s"
            />
            <FeatureItem
              icon={
                <SwapHorizSharpIcon
                  className="feature-icon"
                  style={{
                    fontSize: '48px',
                    width: '48px',
                    height: '48px',
                    color: 'white',
                    transition: 'transform 0.5s ease-in-out',
                  }}
                />
              }
              title={<span style={{ fontWeight: 'bold' }}>14-Day Return</span>}
              delay="0.6s"
            />
            <FeatureItem
              icon={
                <PhoneInTalkIcon
                  className="feature-icon"
                  style={{
                    fontSize: '48px',
                    width: '48px',
                    height: '48px',
                    color: 'white',
                    transition: 'transform 0.5s ease-in-out',
                  }}
                />
              }
              title={<span style={{ fontWeight: 'bold' }}>24/7 Support</span>}
              delay="0.8s"
            />
          </div>

        </ArgonBox>
      </ArgonBox>

      {/* About Section */}
      <ArgonBox className="container-fluid about overflow-hidden py-5">
        <ArgonBox className="container py-5">
          <div className="row g-5">
            <div className="col-xl-6 wow fadeInLeft" data-wow-delay="0.2s">
              <div className="about-img rounded h-100">
                <img src={aboutImage} className="img-fluid rounded h-100 w-100" style={{ objectFit: "cover" }} alt="" />
                <div className="about-exp"><span>2 năm kinh nghiệm</span></div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
              <ArgonBox className="about-item">
                <ArgonTypography variant="h4" color="primary" textTransform="uppercase">Về chúng tôi</ArgonTypography>
                <ArgonTypography variant="h1" fontWeight="bold" mb={3}>Chúng tôi cung cấp cho bạn những sản phẩm chất
                  lượng.</ArgonTypography>

                <ArgonBox className="bg-light rounded p-4 mb-4">
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex">
                        <div className="pe-4">
                          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}>
                            <SupportAgentIcon className="feature-icon" />
                          </div>
                        </div>
                        <div>
                          <ArgonTypography variant="h4" component="a" href="#" mb={3}>Hài lòng khách
                            hàng</ArgonTypography>
                          <ArgonTypography>
                            Hài lòng khách hàng là một yếu tố cực kỳ quan trọng trong ngành thời trang. Để đạt được sự
                            hài lòng của khách hàng, các thương hiệu và cửa hàng thời trang cần chú trọng đến nhiều yếu
                            tố,
                            từ chất lượng sản phẩm đến dịch vụ khách hàng
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
                          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}>
                            <VolunteerActivismIcon className="feature-icon" />
                          </div>
                        </div>
                        <div>
                          <ArgonTypography variant="h4" component="a" href="#" mb={3}>Sản phẩm chất
                            lượng</ArgonTypography>
                          <ArgonTypography>
                            Chất lượng sản phẩm: Khách hàng luôn mong muốn nhận được những sản phẩm có chất lượng cao,
                            từ chất liệu đến đường may và thiết kế. Sản phẩm phải đảm bảo bền, đẹp và thoải mái khi mặc.
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
                          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "80px" }}>
                            <EggOutlinedIcon className="feature-icon" />
                          </div>
                        </div>
                        <div>
                          <ArgonTypography variant="h4" component="a" href="#" mb={3}>Dịch vụ khách
                            hàng</ArgonTypography>
                          <ArgonTypography>
                            Dịch vụ khách hàng: Tư vấn nhiệt tình, chu đáo và thân thiện là điều mà bất kỳ khách hàng
                            nào cũng mong đợi.
                            Khả năng giải quyết các vấn đề phát sinh nhanh chóng và hiệu quả cũng góp phần tạo nên sự
                            hài lòng.
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
              icon={<ThumbUpOutlinedIcon style={{
                fontSize: '48px',
                width: '48px',
                height: '48px',
                color: 'white',
                transition: 'transform 0.5s ease-in-out', // Smooth transition
              }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'rotate(360deg)'; // Spin the icon
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'rotate(0deg)'; // Reset the spin
                }} />}
              title={<span style={{ fontWeight: 'bold' }}>Happy Clients</span>}
              count="456"
              delay="0.2s"
            />
            <CounterItem
              icon={<FavoriteOutlinedIcon style={{
                fontSize: '48px',
                width: '48px',
                height: '48px',
                color: 'white',
                transition: 'transform 0.5s ease-in-out', // Smooth transition
              }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'rotate(360deg)'; // Spin the icon
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'rotate(0deg)'; // Reset the spin
                }} />}
              title={<span style={{ fontWeight: 'bold' }}>Transport</span>}
              count="513"
              delay="0.4s"
            />
            <CounterItem
              icon={<PeopleAltOutlinedIcon style={{
                fontSize: '48px',
                width: '48px',
                height: '48px',
                color: 'white',
                transition: 'transform 0.5s ease-in-out', // Smooth transition
              }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'rotate(360deg)'; // Spin the icon
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'rotate(0deg)'; // Reset the spin
                }} />}
              title={<span style={{ fontWeight: 'bold' }}>Employees</span>}
              count="53"
              delay="0.6s"
            />
            <CounterItem
              icon={<LocalShippingOutlinedIcon style={{
                fontSize: '48px',
                width: '48px',
                height: '48px',
                color: 'white',
                transition: 'transform 0.5s ease-in-out',
              }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'rotate(360deg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'rotate(0deg)';
                }} />}
              title={<span style={{ fontWeight: 'bold' }}>Years Experience</span>}
              count="17"
              delay="0.8s"
            />
          </div>
        </div>
      </div>

      {/* Service Section */}
      <div className="container-fluid service bg-light overflow-hidden py-5">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: "800px" }}>
            <ArgonTypography variant="h4" color="primary" textTransform="uppercase">
              Our Service
            </ArgonTypography>
            <ArgonTypography variant="h1" fontWeight="bold" mb={3}>
              Protect Your Family with Best Water
            </ArgonTypography>
          </div>
          <div className="row gx-0 gy-4 align-items-center">
            <div className="col-lg-6 col-xl-4 wow fadeInLeft" data-wow-delay="0.2s">
              <ServiceItem
                icon={<DiamondIcon className="icon-large" />}

                description="Thời trang cao cấp và những thương hiệu độc quyền vẫn giữ một vị trí quan trọng."
              />
              <ServiceItem
                icon={<EmojiPeopleIcon className="icon-large" />}

                description="Cho phép mọi người tự do thể hiện phong cách riêng của mình."
              />
              <ServiceItem
                icon={<StreamIcon className="icon-large" />}

                description="Ngành thời trang ngày càng chú trọng đến sự bền vững."
              />
            </div>
            <div className="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-transparent">
                <img src={aboutImage1} className="img-fluid w-100" alt="About Image" />
              </div>
            </div>
            <div className="col-lg-6 col-xl-4 wow fadeInRight" data-wow-delay="0.2s">
              <ServiceItem
                icon={<SettingsAccessibilityOutlinedIcon className="icon-large" />}

                description="Trang phục như đồ thể thao và trang phục nhà đang ngày càng được ưa chuộng."
              />
              <ServiceItem
                icon={<AutoFixHighOutlinedIcon className="icon-large" />}

                description="Thời trang hiện nay không chỉ về vẻ bề ngoài mà còn về tính thực dụng."
              />
              <ServiceItem
                icon={<ReplayOutlinedIcon className="icon-large" />}

                description="Thời trang hiện nay thay đổi liên tục với tốc độ nhanh chóng, nhờ vào việc truyền thông xã hội."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="unrelated-container">
        <section id="features" className="features">
          <div className="container">
            <div className="section-title" data-aos="fade-up">
              <h2>
                <a href="#" onClick={(event) => {
                  event.preventDefault();
                  handleCategoryChange('all');
                }}>All Categories</a>
              </h2>
            </div>
            <div className="carousel-wrapper">
              <div className="category-grid">

                {categoryPages[currentCategoryPage] && categoryPages[currentCategoryPage].map((category) => (
                  <div key={category.id} className="icon-box" data-aos="zoom-in" data-aos-delay="50">
                    <h3>
                      <a href="#" onClick={(event) => {
                        event.preventDefault();
                        handleCategoryChange(category.id);
                      }}>{category.name}</a>
                    </h3>
                  </div>
                ))}
              </div>

              {/* Custom Navigation Buttons */}
              <button
                type="button"
                className="carousel-control-prev"
                aria-label="Previous"
                onClick={() => setCurrentCategoryPage((prevPage) => (prevPage === 0 ? categoryPages.length - 1 : prevPage - 1))}
                disabled={currentCategoryPage === 0}
              >
                <AiOutlineDoubleLeft />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                type="button"
                className="carousel-control-next"
                aria-label="Next"
                onClick={() => setCurrentCategoryPage((prevPage) => (prevPage === categoryPages.length - 1 ? 0 : prevPage + 1))}
                disabled={currentCategoryPage === categoryPages.length - 1}
              >
                <AiOutlineDoubleRight />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>
      </div>


      {/* Product Section */}
      <ArgonBox className="container-fluid product py-0">
        <ArgonBox className="container py-0">
          <div className="row g-4 align-items-center">
            <div className="col-lg-3">
              <h1 className="color-changing-text" style={{ whiteSpace: 'nowrap' }}>
                Our Timeless Fashion Collection
              </h1>
            </div>
            <div className="col-lg-9">
              <div className="d-flex justify-content-end align-items-center">


                <select
                  className="form-select stylish-select"
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  style={{ maxWidth: '200px', marginRight: '5px' }}
                >
                  <option value="">All brands</option>
                  {brands.length > 0 ? (
                    brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No brands found.</option>
                  )}
                </select>

                <select
                  id="fashion-sorting"
                  name="sorting"
                  className="form-select stylish-select"
                  onChange={handleSortChange}
                  style={{ maxWidth: '200px', marginRight: '5px' }} // Adjust the width as needed
                >
                  <option value="default">Default</option>
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>


          <div className="row g-4" style={{ marginTop: '10px' }}>
            {filteredProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`col-md-6 col-lg-3 bounce-in-glow`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <a href={`/ShopDetail?id=${product.id}`} className="text-decoration-none">
                    <div className="rounded position-relative fruite-item">
                      <div className="fruite-img text-center">
                        <img src={aboutImage4 || product.image} className="img-fluid w-100 rounded-top" alt="Product Image" />
                      </div>
                      <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                        <h5 className="text-center" style={{ color: 'black' }}>{product.name}</h5>
                        {/* <a href="/Favorite">
                          <button className="btn-favorite">
                            <AiOutlineHeart />
                          </button>
                        </a> */}
                        <p className="text-center" style={{ fontSize: '0.7rem', color: 'black' }}>{product.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="text-dark fs-6 fw-bold mb-0 custom-price">
                            {product.importPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>
                          <div className="rating-stars" style={{ display: 'flex', alignItems: 'center' }}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <AiFillStar key={index} className="star" style={{ color: '#ffd700', margin: '0 2px', fontSize: '1rem' }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">No products found.</div>
            )}

            {/* <div className="col-12">
              <div className="pagination d-flex justify-content-center mt-5" style={{ marginBottom: '-10px', paddingTop: '-3px' }}>
                <a
                  href="#"
                  className="rounded"
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1}
                >
                  &laquo;
                </a>
                {Array.from({ length: totalPages }, (_, index) => (
                  <a
                    key={index + 1}
                    href="#"
                    className={`rounded ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </a>
                ))}
                <a
                  href="#"
                  className="rounded"
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-disabled={currentPage === totalPages}
                >
                  &raquo;
                </a>
              </div>
            </div> */}
          </div>
        </ArgonBox>
      </ArgonBox>

      {/* Footer Section */}

      <Footer />
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
      <div className="feature-icon mb-4">
        {icon}
      </div>
      <h4 className="mb-3">{title}</h4>
    </div>
  </div>
);

FeatureItem.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  delay: PropTypes.string.isRequired
};

// CounterItem Component
const CounterItem = ({ icon, title, count, delay }) => (
  <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay={delay}>
    <div className="counter-item">
      <div className="counter-item-icon mx-auto">
        {icon}
      </div>
      <h4 className="text-white my-4">{title}</h4>
      <div className="counter-counting">
        <span className="text-white fs-2 fw-bold" data-toggle="counter-up">{count}</span>
        <span className="h1 fw-bold text-white">+</span>
      </div>
    </div>
  </div>
);

CounterItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  delay: PropTypes.string.isRequired
};

// ServiceItem Component
const ServiceItem = ({ icon, title, description }) => (
  <div className="service-item rounded p-4 mb-4">
    <div className="row">
      <div className="col-12">
        <div className="d-flex">
          <div className="pe-4">
            <div className="service-btn">
              {icon}
            </div>
          </div>
          <div className="service-content">
            <a href="#" className="h4 d-inline-block mb-3">{title}</a>
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
  description: PropTypes.string.isRequired
};
const ProductItem = ({ imgSrc, description, title, price }) => (
  <div className="col-lg-6 col-xl-4 wow fadeInUp">
    <ArgonBox className="product-item">

      <ArgonBox className="product-image">
        <img src={components / client / assets / images / imgSrc} alt={title} className="img-fluid" />
      </ArgonBox>
      <ArgonBox className="product-content bg-light text-center rounded-bottom p-4">
        <ArgonTypography>{description}</ArgonTypography>
        <ArgonTypography variant="h4" component="a" href="#" mb={3}>{title}</ArgonTypography>
        <ArgonTypography variant="h4" color="primary" mb={3}>{price}</ArgonTypography>
        <ArgonButton color="secondary" rounded="pill" py={2} px={4}>Read More</ArgonButton>
      </ArgonBox>
    </ArgonBox>
  </div>
);


ProductItem.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired
};
export default FeaturesAndAbout;
