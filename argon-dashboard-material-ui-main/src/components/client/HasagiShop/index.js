import React, { useEffect, useState } from "react";
import "components/client/assets/css/HasagiShop.css"
import "components/client/assets/css/style.css";
import "bootstrap";
import "../assets/css/HasagiShop.css";
import ArgonBox from "components/ArgonBox";

import { Link } from "react-router-dom";
import aboutImage from "components/client/assets/images/single-item.jpg";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import axios from "axios";
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineUser, AiFillStar } from "react-icons/ai";
import ArgonInput from "components/ArgonInput";
import aboutImage4 from "components/client/assets/images/k1r.jpg";
import ProductService from "../../../services/ProductServices";
import CategoryService from "../../../services/CategoryServices";
import BrandService from "../../../services/BrandServices";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [price, setPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleRangeChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await ProductService.getAllProducts();
        const categoryResponse = await CategoryService.getAllCategories();
        const brandResponse = await BrandService.getAllBrands();

        console.log("Products:", productResponse.data);
        console.log("Categories:", categoryResponse.data);
        console.log("Brands:", brandResponse.data);

        if (
          Array.isArray(productResponse.data) &&
          Array.isArray(categoryResponse.data) &&
          Array.isArray(brandResponse.data)
        ) {
          setProducts(productResponse.data);
          setCategories(categoryResponse.data);
          setBrands(brandResponse.data);

          const maxProductPrice = Math.max(
            ...productResponse.data.map((product) => product.importPrice),
            1000
          );
          setMaxPrice(maxProductPrice);
        } else {
          setProducts([]);
          setCategories([]);
          setBrands([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setCategories([]);
        setBrands([]);
      }
    };

    fetchProductsAndCategories();
  }, []);


  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

  // Filter products based on category, price, and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "" || product.categoryId === Number(selectedCategory);
    return matchesCategory;
  });



  // Sort products based on the selected option
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "price-asc") {
      return (a.importPrice || 0) - (b.importPrice || 0);
    } else if (sortOption === "price-desc") {
      return (b.importPrice || 0) - (a.importPrice || 0);
    } else if (sortOption === "popularity") {
      return (b.popularity || 0) - (a.popularity || 0);
    } else if (sortOption === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return 0;
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    const navHeight = 10; // Chiều cao của thanh nav
    const scrollPosition = window.scrollY;

    // Nếu cuộn xuống dưới chiều cao của thanh nav
    if (scrollPosition >= navHeight) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="container-fluid fixed-top">
        <HasagiNav />
      </div>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Sản phẩm</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="/">Trang chủ</a>
          </li>
          <li className="breadcrumb-item active text-white">Sản phẩm</li>
        </ol>
      </div>
      <div className="container-fluid fruite py-0">
        <div className="container py-0">
          <div className="row g-4">
            <div className="col-lg-12">
              <div className="row g-4">
                <div className="col-9" style={{ position: "absolute", width: "63.22%" }}>
                  <div className={`sort-bar ${isSticky ? "sticky" : ""}`}>
                    <div className="title">Tất cả sản phẩm</div>
                    <div className="sort-options">
                      <span className="label" style={{ fontSize: "15px" }}>
                        Sắp xếp theo:
                      </span>
                      <label>
                        <select
                          className="form-select stylish-select"
                          aria-label="Select category"
                          onChange={handleCategoryChange}
                          value={selectedCategory}
                        >
                          <option value="">Danh mục</option>
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                          ) : (
                            <option>No categories available</option>
                          )}
                        </select>
                      </label>
                      <label>
                        <select
                          className="form-select stylish-select"
                          aria-label="Select brand"
                          onChange={handleBrandChange}
                          value={selectedBrand}
                        >
                          <option value="">Thương hiệu</option>
                          {brands.length > 0 ? (
                            brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))
                          ) : (
                            <option>No brands available</option>
                          )}
                        </select>
                      </label>
                      <label>
                        <select
                          id="fashion-sorting"
                          name="sorting"
                          className="form-select stylish-select"
                          onChange={handleSortChange}
                        >
                          <option value="default">-----Khoảng giá----</option>

                          <option value="price-asc">Giá thấp nhất</option>
                          <option value="price-desc">Giá cao nhất</option>

                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                {/* <div className="col-xl-1">
                  <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4"></div>
                </div> */}
              </div>
              <div className="row" style={{ marginTop: "10%" }}>
                <div className="tabs-header d-flex justify-content-between border-bottom my-5 mt-2 mb-1">
                  <h3>Sản phẩm mới nhất</h3>
                </div>
                {filteredProducts.map((product, index) => (
                  <div className="col-6 col-sm-2 col-md-3 col-lg-3 mb-4" key={index}>
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


              <div className="col-12">
                <div className="pagination d-flex justify-content-center mt-6 mb-0">
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
                      className={`rounded ${currentPage === index + 1 ? "active" : ""}`}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;
