import React, { useEffect, useState } from "react";
import "components/client/assets/css/ShopDetail.css";
import "components/client/assets/css/style.css";
import "bootstrap";
import ArgonBox from "components/ArgonBox";

import { Link } from 'react-router-dom';
import aboutImage from "components/client/assets/images/single-item.jpg";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import axios from "axios";
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineUser, AiFillStar } from 'react-icons/ai';
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

                if (Array.isArray(productResponse.data) && Array.isArray(categoryResponse.data) && Array.isArray(brandResponse.data)) {
                    setProducts(productResponse.data);
                    setCategories(categoryResponse.data);
                    setBrands(brandResponse.data); // Set brand data

                    const maxProductPrice = Math.max(...productResponse.data.map(product => product.importPrice), 1000);
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



    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

    // Filter products based on category, price, and search query
    const filteredProducts = products
        .filter(product => selectedCategory === "" || product.categoryId === Number(selectedCategory))
        .filter(product => selectedBrand === "" || product.trademarkId === Number(selectedBrand))
        .filter(product => product.importPrice <= price)
        .filter(product => product.name && typeof product.name === 'string' && product.name.toLowerCase().includes(searchQuery));

    // Sort products based on the selected option
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
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };



    return (
        <>
    <div className="container-fluid fixed-top">
        <HasagiNav/>
    </div>
    <div className="container-fluid page-header py-5" >
        <h1 className="text-center text-white display-6">Shop</h1>
        <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active text-white">Shop</li>
        </ol>
    </div>
    <div className="container-fluid fruite py-0">
        <div className="container py-0">

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="row g-4">

                        <div className="col-9"></div>
                        <div className="col-xl-1">
                            <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">

                            </div>

                        </div>

                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <h4>Categories:</h4>
                                        <select
                                            className="form-select stylish-select"
                                            aria-label="Select category"
                                            onChange={handleCategoryChange}
                                            value={selectedCategory}
                                        >
                                            <option value="">All Categories</option>
                                            {categories.length > 0 ? categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            )) : <option>No categories available</option>}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <h4>Brands:</h4>
                                        <select
                                            className="form-select stylish-select"
                                            aria-label="Select brand"
                                            onChange={handleBrandChange}
                                            value={selectedBrand}
                                        >
                                            <option value="">All Brands</option>
                                            {brands.length > 0 ? brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            )) : <option>No brands available</option>}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <h4>Sort By:</h4>
                                        <select id="fashion-sorting" name="sorting" className="form-select stylish-select" onChange={handleSortChange}>
                                            <option value="default">Default</option>
                                            <option value="popularity">Popularity</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <h4 className="mb-2">Price</h4>
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
                                        <output id="amount" name="amount" htmlFor="rangeInput">
                                            {price}.000 VND
                                        </output>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="row g-4 justify-content-center">
                                {currentProducts.map(product => (
                                    <div key={product.id} className="col-md-6 col-lg-6 col-xl-4">
                                        <a href={`/ShopDetail?id=${product.id}`} className="text-decoration-none">
                                            <div className="rounded position-relative fruite-item">
                                                <div className="fruite-img text-center">
                                                    <img src={aboutImage4 || product.image} className="img-fluid w-100 rounded-top" />
                                                </div>
                                                <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                                    <h4 style={{ textAlign: 'center', color: 'black' }}>{product.name || "Product Name"}</h4>
                                                    <a href="/Favorite">
                                                        <button className="btn-favorite">
                                                            <AiOutlineHeart />
                                                        </button>
                                                    </a>
                                                    <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'black' }}>{product.description || "No description available"}</p>
                                                    <div className="d-flex justify-content-between flex-lg-wrap">
                                                        <p className="product-price text-dark fs-6 fw-bold mb-0" style={{ marginRight: '15px' }}>
                                                        {product.importPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                        </p>
                                                        <div className="rating-stars" style={{ display: 'flex', alignItems: 'center' }}>
                                                            {Array.from({ length: 5 }, (_, index) => (
                                                                <AiFillStar key={index} className="star" style={{ color: '#ffd700', margin: '0 2px' }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                            <div className="col-12">
                                <div className="pagination d-flex justify-content-center mt-6">
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