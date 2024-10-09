import React, { useEffect, useState } from "react";
import "components/client/assets/css/ShopDetail.css";
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
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        console.log("Fetched products:", response.data);
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

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

  // Filter products based on category, price, and search query
  const filteredProducts = products
    .filter((product) => selectedCategory === "" || product.categoryId === Number(selectedCategory))
    .filter((product) => selectedBrand === "" || product.trademarkId === Number(selectedBrand))
    .filter((product) => product.importPrice <= price)
    .filter(
      (product) =>
        product.name &&
        typeof product.name === "string" &&
        product.name.toLowerCase().includes(searchQuery)
    );

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
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    const navHeight = 211; // Chiều cao của thanh nav
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
                <div className="col-9" style={{ position: "absolute", width: "64%" }}>
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
                          {/* <option value="popularity">
                            <input
                              type="range"
                              className="form-range w-100"
                              id="rangeInput"
                              name="rangeInput"
                              min="0"
                              max={maxPrice}
                              value={price}
                              onChange={handleRangeChange}
                            />
                            <output
                              id="amount"
                              name="amount"
                              htmlFor="rangeInput"
                              style={{ fontSize: "17px" }}
                            >
                              {price}.000 VND
                            </output>
                          </option> */}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                {/* <div className="col-xl-1">
                  <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4"></div>
                </div> */}
              </div>
              <div className="row g-4" style={{ marginTop: "120px" }}>
              <div className="col-lg-12">
  <div className="row g-4 justify-content-center">
    {filteredProducts.map((product) => (
      <div key={product.id} className="col-6 col-md-4 col-lg-3 col-xl-3">
        <a href={`/ShopDetail?id=${product.id}`} className="text-decoration-none">
          <div className="rounded position-relative fruite-item">
            <div className="fruite-img text-center">
              {/* Use a fallback image if product.image is null */}
              <img
                src={product.image || aboutImage4}
                className="img-fluid w-100 rounded-top"
                alt={product.name || "Product Image"}
              />
            </div>
            <div className="p-4 border border-secondary border-top-0 rounded-bottom">
              <h4 style={{ textAlign: "center", color: "black" }}>
                {product.name || "Product Name"}
              </h4>
              <a href="/Favorite">
                <button className="btn-favorite">
                  <AiOutlineHeart />
                </button>
              </a>
              <p style={{ textAlign: "center", fontSize: "0.7rem", color: "black" }}>
                {product.description || "No description available"}
              </p>
              <div className="d-flex justify-content-between flex-lg-wrap">
                <p
                  className="product-price text-dark fs-6 fw-bold mb-0"
                  style={{ marginRight: "15px" }}
                >
                  {/* Ensure importPrice is formatted even when it's null */}
                  {(product.importPrice !== null
                    ? product.importPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "No price available")}
                </p>
                <div className="rating-stars" style={{ display: "flex", alignItems: "center" }}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <AiFillStar
                      key={index}
                      className="star"
                      style={{ color: "#ffd700", margin: "0 2px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    ))}
  </div>

  {/* Pagination */}
  <div className="col-12">
    <div className="pagination d-flex justify-content-center mt-6 mb-0">
      <a
        href="#"
        className="rounded"
        onClick={() => handlePageChange(currentPage - 1)}
        aria-disabled={currentPage === 1}
        style={{ pointerEvents: currentPage === 1 ? "none" : "auto", opacity: currentPage === 1 ? 0.5 : 1 }}
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
        style={{ pointerEvents: currentPage === totalPages ? "none" : "auto", opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        &raquo;
      </a>
    </div>
  </div>
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
