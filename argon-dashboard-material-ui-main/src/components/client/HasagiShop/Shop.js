import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ShopService from "services/ShopServices";
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import HasagiCard2 from 'components/client/HasagiCard/Card2';
import Grid from '@mui/material/Grid'; // Import MUI Grid

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
    };

    const handleBrandChange = (brandId) => {
        if (selectedBrands.includes(brandId)) {
            setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
        } else {
            setSelectedBrands([...selectedBrands, brandId]);
        }
    };

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productResponse = await ShopService.getProductHome();
                const categoryResponse = await ShopService.getCateHome();
                const brandResponse = await ShopService.getBrandHome();
                console.log(productResponse.data, categoryResponse.data, brandResponse.data); // Debug
                setProducts(productResponse.data || []);
                setCategories(categoryResponse.data || []);
                setBrands(brandResponse.data || []);
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
            <style>
                {`
                    .loader {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .product-item {
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        transition: transform 0.3s;
                    }
                    .product-item:hover {
                        transform: scale(1.05);
                    }
                    .pagination {
                        margin-top: 20px;
                        padding-bottom: 60px;
                    }
                    .pagination .page-item.active .page-link {
                        background-color: orange;
                        color: white;
                    }
                    .checkbox-group {
                        margin-bottom: 1rem;
                    }
                    .checkbox-list {
                        display: none;
                    }
                    .checkbox-list.open {
                        display: block;
                    }
                    .filter-box {
                        border: 1px solid #ddd; 
                        border-radius: 5px; 
                        padding: 1rem; 
                        margin-bottom: 1rem; 
                        background-color: #f9f9f9; 
                    }
                    .breadcrumb {
                        background-color: #f8f9fa; 
                        border-radius: 0.5rem; 
                        padding: 10px 15px; 
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
                    }
                    .breadcrumb-item {
                        color: #343a40; 
                    }
                    .breadcrumb-item:hover {
                        color: #007bff; 
                        text-decoration: underline; 
                    }
                    .breadcrumb-item.active {
                        font-weight: bold; 
                        color: #007bff; 
                    }
                    .banner {
                        background-image: url('https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/main_collection_breadcrumb_bg.jpg?1713464283843');
                        background-size: cover;
                        background-position: center;
                        height: 300px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: flex-start;
                        padding: 100px 40px; /* Increased padding-top to push content down */
                    }

                    .content {
                        text-align: left;
                        color: #333;
                    }

                    .content h1 {
                        font-size: 42px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                    }

                    nav {
                        display: flex;
                        align-items: center; /* Vertically center breadcrumb items */
                        gap: 5px; /* Space between breadcrumb items */
                    }

                    .breadcrumb-item {
                        display: inline-block;
                        font-size: 20px;
                        color: #333;
                    }

                    .breadcrumb-item strong {
                        font-weight: bold;
                    }

                    .breadcrumb-item.active {
                        color: #007bff; /* Active breadcrumb color */
                    }
  
                `}
            </style>
            {isLoading && (
                <div className="loader">
                    <div className="loader-inner">
                        <div className="circle"></div>
                    </div>
                </div>
            )}
            <HasagiNav onSearch={handleSearch} />
            <div className="container-fluid py-3">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <div className="banner">
                            <div className="content">
                                <h1>CONVERSE ALL</h1>
                                <nav>
                                    <a className="breadcrumb-item text-dark" href="/feature-section">
                                        <strong>Home</strong>
                                    </a>
                                    <span className="breadcrumb-item text-dark">
                                        <strong>Shop</strong>
                                    </span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid" style={{ paddingBottom: '150px', paddingTop: '0px' }}>
                <div className="row px-xl-5">
                    <div className="col-3">
                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="bg-secondary pr-3">Lọc theo:</span>
                        </h5>
                        <div className="filter-section">
                            <div className="filter-box">
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
                        </div>
                    </div>

                    <div className="col-9">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <select
                                className="form-select"
                                value={sortOption}
                                onChange={handleSortChange}
                                style={{ width: '200px' }}
                            >
                                <option value="default">Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                                <option value="popularity">Phổ biến</option>
                                <option value="newest">Mới nhất</option>
                            </select>
                        </div>
                        <Grid container spacing={0} style={{ width: '100%' }}>
                            {currentProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <ArgonBox mx={1} mb={2} className="product-item">
                                        <HasagiCard2
                                            image={product.image}
                                            name={product.name}
                                            id={product.id}
                                            importPrice={product.importPrice}
                                            sale={product.sale}
                                        />
                                    </ArgonBox>
                                </Grid>
                            ))}
                        </Grid>

                        <nav className="pagination">
                            <ul className="pagination justify-content-center mt-4">
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
            <Footer />
        </>
    );
}

export default Shop;
