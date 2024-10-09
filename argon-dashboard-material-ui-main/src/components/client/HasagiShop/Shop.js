import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ShopService from "services/ShopServices";

function Shop() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); 
    };

    const toggleCategoryOpen = () => {
        setIsCategoryOpen((prev) => !prev);
    };

    const toggleBrandOpen = () => {
        setIsBrandOpen((prev) => !prev);
    };
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 700);
    }, []);

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleCategoryChange = (categoryId) => {
        if (selectedCategory.includes(categoryId)) {
            setSelectedCategory(selectedCategory.filter((id) => id !== categoryId));
        } else {
            setSelectedCategory([...selectedCategory, categoryId]);
        }
        console.log("Selected Category:", selectedCategory);
        setCurrentPage(1);
    };

    const handleBrandChange = (brandId) => {
        if (selectedBrands.includes(brandId)) {
            setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
        } else {
            setSelectedBrands([...selectedBrands, brandId]);
        }
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productResponse = await ShopService.getProductHome();
                const categoryResponse = await ShopService.getCateHome();
                const brandResponse = await ShopService.getBrandHome();

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

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(product.categoryId);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brandId);
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesBrand && matchesSearchTerm;
    });
    

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
            <div className="container-fluid py-5" style={{paddingTop:'5.5rem'}}>
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/feature-section">Home</a>
                            <span className="breadcrumb-item active">Shop</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-3">
                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="bg-secondary pr-3">Lọc theo:</span>
                        </h5>
                        <div className="checkbox-group">
                            <label className="form-label" onClick={() => toggleCategoryOpen()}>
                                Danh mục
                            </label>
                            <div className={`checkbox-list ${isCategoryOpen ? 'open' : ''}`}>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <div key={category.id} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`category-${category.id}`}
                                                value={category.id}
                                                onChange={() => handleCategoryChange(category.id)}
                                                checked={selectedCategory.includes(category.id)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`category-${category.id}`}
                                            >
                                                {category.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <div>No categories available</div>
                                )}
                            </div>
                        </div>

                        <div className="checkbox-group mt-3">
                            <label className="form-label" onClick={() => toggleBrandOpen()}>
                                Thương hiệu
                            </label>
                            <div className={`checkbox-list ${isBrandOpen ? 'open' : ''}`}>
                                {brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <div key={brand.id} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`brand-${brand.id}`}
                                                value={brand.id}
                                                onChange={() => handleBrandChange(brand.id)}
                                                checked={selectedBrands.includes(brand.id)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`brand-${brand.id}`}
                                            >
                                                {brand.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <div>No brands available</div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="col-9">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Sản phẩm</h5>
                            <div className="sorting-group">
                                <select
                                    id="fashion-sorting"
                                    name="sorting"
                                    className="form-select stylish-select small-sort-dropdown"
                                    onChange={handleSortChange}
                                    value={sortOption}
                                    style={{ width: '150px' }}
                                >
                                    <option value="default">Sắp xếp</option>
                                    <option value="price-asc">Giá tâng dần</option>
                                    <option value="price-desc">Giá giảm dần</option>
                                    
                                </select>
                            </div>
                        </div>
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
                                                <small className="fa fa-star text-primary mr-1"></small>
                                                <small className="fa fa-star text-primary mr-1"></small>
                                                <small className="fa fa-star text-primary mr-1"></small>
                                                <small className="fa fa-star text-primary mr-1"></small>
                                                <small className="fa fa-star text-primary mr-1"></small>
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
