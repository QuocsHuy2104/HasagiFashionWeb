import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/client/assets/css/style1.css';
import '../../components/client/assets/js/script';
import '../../components/client/assets/js/plugins';
import logoImage from '../../components/client/assets/images/Hasagi.png';
import banner1 from '../../components/client/assets/images/product-thumb-1.png';
import banner2 from '../../components/client/assets/images/product-thumb-2.png';
import adImg1 from '../../components/client/assets/images/ad-image-1.png';
import adImg2 from '../../components/client/assets/images/ad-image-2.png';
import cate1 from '../../components/client/assets/images/icon-animal-products-drumsticks.png';
import brand1 from '../../components/client/assets/images/product-thumb-11.jpg';
import pd1 from '../../components/client/assets/images/thumb-avocado.png';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


import HasagiHeader from "../../components/client/HasagiHeader";
import axios from "axios";
import ArgonInput from "components/ArgonInput";
import { Carousel } from 'react-responsive-carousel';
import Cookies from "js-cookie";
import ProductService from "../../services/ProductServices";
import CategoryService from "../../services/CategoryServices";
import BrandService from "../../services/BrandServices";
import ColorService from "../../services/ColorServices";
import SizeService from "../../services/SizeServices";


function MyComponent() {
  // Thêm scripts bằng useEffect nếu cần thiết
  useEffect(() => {
    const bootstrapScript = document.createElement('script');
    const popperScript = document.createElement('script');
    const jqueryScript = document.createElement('script');

    // Đường dẫn tới các thư viện
    jqueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js";
    popperScript.src = "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js";
    bootstrapScript.src = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js";

    // Đặt thuộc tính async
    jqueryScript.async = true;
    popperScript.async = true;
    bootstrapScript.async = true;

    // Thêm các thẻ script vào body
    document.body.appendChild(jqueryScript);
    document.body.appendChild(popperScript);
    document.body.appendChild(bootstrapScript);

    // Cleanup function để xóa các thẻ script khi component unmount
    return () => {
      document.body.removeChild(jqueryScript);
      document.body.removeChild(popperScript);
      document.body.removeChild(bootstrapScript);
    };
  }, []);


  useEffect(() => {
    // Khởi tạo Swiper
    const swiper = new Swiper('.category-carousel', {
      slidesPerView: 2,
      spaceBetween: 15,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.category-carousel-next',
        prevEl: '.category-carousel-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 30,
        },
      },
    });

    // Hàm xử lý cho sự kiện click
    const handleNext = () => swiper.slideNext();
    const handlePrev = () => swiper.slidePrev();

    // Gắn các sự kiện cho nút điều hướng
    const nextButton = document.querySelector('.category-carousel-next');
    const prevButton = document.querySelector('.category-carousel-prev');

    nextButton.addEventListener('click', handleNext);
    prevButton.addEventListener('click', handlePrev);

    // Dọn dẹp khi component unmount
    return () => {
      swiper.destroy();
      // Xóa sự kiện
      nextButton.removeEventListener('click', handleNext);
      prevButton.removeEventListener('click', handlePrev);
    };

  }, []); // Chỉ chạy 1 lần khi component mount


  useEffect(() => {
    const swiper = new Swiper('.brand-carousel', {
      slidesPerView: 3, // Số lượng slide hiển thị
      spaceBetween: 30, // Khoảng cách giữa các slide
      navigation: {
        nextEl: '.brand-swiper-next', // Nút tiếp theo
        prevEl: '.brand-swiper-prev', // Nút trước đó
      },
      breakpoints: {
        // Thiết lập responsive
        768: {
          slidesPerView: 4,
        },
        480: {
          slidesPerView: 1,
        },
      },
    });
  }, []);



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


  const handleCategoryChange = (category) => {
    const categoryId = category.id; // Assuming each category has an `id` property
    if (categoryId === 'all') {
      // Logic to show all categories
      setSelectedCategory(''); // Reset selected category for "all"
      setCurrentCategoryPage(0); // Reset current page for all categories
    } else {
      setSelectedCategory(categoryId);
      setCurrentPage(1); // Reset current page when selecting a new category
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "" || product.categoryId === Number(selectedCategory);
    return matchesCategory;
  });


  return (
    <>
      <div>
        <header>
          <HasagiHeader />
        </header>
      </div>
      <hr />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between mb-5">
              <h2 className="section-title">Danh mục</h2>
              <div className="d-flex align-items-center">
                <a href="#" className="btn-link text-decoration-none">Tất cả danh mục →</a>
                <div className="swiper-buttons">
                  <button className="swiper-prev category-carousel-prev btn btn-yellow">❮</button>
                  <button className="swiper-next category-carousel-next btn btn-yellow">❯</button>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="category-carousel swiperCate">
              <div className="swiper-wrapper">
                {categories.map((category, index) => (
                  <a
                    key={index}
                    className="nav-link category-item swiper-slide p-0 pt-3"
                    onClick={() => handleCategoryChange(category)} // Pass the category directly
                    href="#!" // Prevent the default behavior
                  >
                    <img
                      src={category.image || cate1}
                      alt="Category Thumbnail"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} // Adjust image size
                    />
                    <h3 className="category-title">{category.name}</h3>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      <section className="py-5 overflow-hidden p-1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header">
                <h2 className="section-title">Thương hiệu</h2>
                <div className="d-flex align-items-center">
                  <a href="#" className="btn-link text-decoration-none">Tất cả thương hiệu →</a>
                  <div className="swiper-buttons">
                    <button className="brand-swiper-prev brand-carousel-prev btn btn-yellow">❮</button>
                    <button className="brand-swiper-next brand-carousel-next btn btn-yellow">❯</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row p-0">
            <div className="col-md-12">
              <div className="brand-carousel swiper">
                <div className="swiper-wrapper">
                  {brands.map((brand, index) => (
                    <div className="swiper-slide" key={index}>
                      <div className="brand-item">
                        <div className="row p-0">
                          <div className="col-md-4 p-0">
                            <img
                              src={brand.image || "default-image.jpg"} // Make sure image is coming from your brand object
                              className="img-fluid rounded"
                              alt={brand.name}
                              style={{ width: '200px', height: '80px', objectFit: 'cover', borderRadius: '10 px', marginLeft: '10px' }}
                            />
                          </div>
                          <div className="col-md-8 p-0">
                            <div className="card-body py-0">
                              <p className="text-muted mb-0"
                                style={{
                                  fontSize: '40px',
                                  fontWeight: 'bold',  // Đảm bảo dùng đúng giá trị cho fontWeight
                                  fontFamily: 'Arial, sans-serif',  // Chọn font-family cho đẹp
                                  color: '#333333',  // Màu chữ
                                  textDecoration: 'underline'  // Ví dụ về gạch chân văn bản
                                }}
                              >{brand.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <div className="row">
        <div className="tabs-header d-flex justify-content-between border-bottom my-5 mt-2 mb-1">
          <h3>Sản phẩm mới nhất</h3>
        </div>
        {filteredProducts.map((product, index) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" key={index}>
            <div className="product-card">
              <div
                className="image-container"
                onClick={() => (window.location.href = `/ShopDetail?id=${product.id}`)}
              >
                <img
                  src={product.image || pd1}
                  className="product-image"
                  alt={product.name}

                />

                <span className="discount-badge">-30%</span>
              </div>
              <div className="card-body">
                <h5
                  className="card-title"
                  onClick={() => (window.location.href = `/ShopDetail?id=${product.id}`)}
                >
                  {product.name}
                </h5>
                <p className="card-text">⭐ {product.rating || '4.5'}</p>
                <p className="card-text">Số lượng: {product.importQuantity || 'Hết hàng'}</p>
                <p className="card-price">
                  {product.importPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>


    </>
  );
}

export default MyComponent;
