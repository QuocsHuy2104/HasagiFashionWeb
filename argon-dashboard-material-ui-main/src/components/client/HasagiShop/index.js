import React, { useEffect, useState } from "react";
import 'layouts/assets/css/style.css';
import { Link } from "react-router-dom";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ProductService from "../../../services/ProductServices";
import CategoryService from "../../../services/CategoryServices";
import BrandService from "../../../services/BrandServices";

function Shop() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 700);
    }, []);

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

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "" || product.categoryId === Number(selectedCategory);
        const matchesBrand = selectedBrand === "" || product.brandId === Number(selectedBrand);
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesBrand && matchesSearchTerm;
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
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            {isLoading && (
                <div className="loader">
                    <div className="loader-inner">
                        <div className="circle"></div>
                    </div>
                </div>
            )}
            <HasagiNav onSearch={handleSearch}/>
            <div className="container-fluid">
                <div className="row px-xl-5 py-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/feature-section">Trang chủ</a>
                            <span className="breadcrumb-item active">Sản phẩm</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-3">
                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="bg-white pr-3">Lọc theo:</span>
                        </h5>
                        <div className="sort-options d-flex flex-column">
                            <label className="mt-2">
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
                            <label className="mt-2">
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
                            <label className="mt-2">
                                <select
                                    id="fashion-sorting"
                                    name="sorting"
                                    className="form-select stylish-select"
                                    onChange={handleSortChange}
                                    value={sortOption}
                                >
                                    <option value="default">-----Sắp xếp----</option>
                                    <option value="price-asc">Giá thấp nhất</option>
                                    <option value="price-desc">Giá cao nhất</option>
                                    <option value="popularity">Phổ biến</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="col-9">
                        <div className="row pb-3">
                            {currentProducts.map((product, index) => (
                                <div className="col-lg-3 col-md-6 col-sm-6 pb-1" key={index}>
                                    <div className="product-item bg-light mb-4">
                                        <div className="product-img position-relative overflow-hidden">
                                            <Link to={`/ShopDetail?id=${product.id}`}>
                                                <img
                                                    className="img-fluid w-100"
                                                    src={product.image || aboutImage5}
                                                    alt={product.name || 'Product Name'}
                                                />
                                            </Link>
                                        </div>
                                        <div className="text-center py-4">
                                            <a
                                                className="h6 text-decoration-none text-truncate"
                                                href={`/ShopDetail?id=${product.id}`}
                                            >
                                                {product.name || "Product Name Goes Here"}
                                            </a>
                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                                <h5>
                                                    {product.importPrice.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </h5>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small className="fa fa-star text-warning mr-1"></small>
                                                <small>({product.rating || 99})</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="col-12" style={{ marginTop: "-30px" }}>
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                            <a className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                <i className="ni ni-bold-left" />
                                            </a>
                                        </li>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
                                                <a className="page-link" onClick={() => handlePageChange(index + 1)}>
                                                    {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                            <a className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                <i className="ni ni-bold-right" />
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Shop;
