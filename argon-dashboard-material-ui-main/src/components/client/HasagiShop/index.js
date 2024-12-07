import React, { useEffect, useState } from "react";
import 'layouts/assets/css/style.css';
import { Link } from "react-router-dom";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ProductService from "../../../services/ProductServices";
import CategoryService from "../../../services/CategoryServices";
import BrandService from "../../../services/BrandServices";
import reviewsService from 'services/ReviewsServices';
import { Card, Typography } from '@mui/material';
import { Form } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function Shop() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState([]);
    const [value, setValue] = useState([300000, 700000]);
    const [showSaleOnly, setShowSaleOnly] = useState(false);
    const handleSliderChange = (newValue) => {
        setValue(newValue);
    };

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

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1);
    };

    const handleBrandChange = (brandId) => {
        setSelectedBrands((prev) =>
            prev.includes(brandId)
                ? prev.filter((id) => id !== brandId)
                : [...prev, brandId]
        );
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productResponse = await ProductService.getAllProductsUs();
                const categoryResponse = await CategoryService.getAllCategoriesUS();
                const brandResponse = await BrandService.getAllBrandsUS();

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
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoryDTOResponse?.id);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brandDTOResponse?.id);
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSale = !showSaleOnly || product.sale > 0;

        return matchesCategory && matchesBrand && matchesSearchTerm && matchesSale;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === "price-asc") {
            return (a.maxPrice || 0) - (b.maxPrice || 0);
        } else if (sortOption === "price-desc") {
            return (b.maxPrice || 0) - (a.maxPrice || 0);
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


    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const fetchReviews = async (productId) => {
        try {
            const productReviews = await reviewsService.getReviewsByProduct(productId);
            console.log('Fetched reviews for product:', productReviews);
            setReviews((prevReviews) => [...prevReviews, ...productReviews]);
        } catch (error) {
            console.error('Error fetching reviews for product:', error);
            setReviews([]);
        }
    };

    useEffect(() => {
        if (products.length > 0) {
            products.forEach((product) => {
                fetchReviews(product.id);
            });
        }
    }, [products]);

    const calculateAverageStars = (productId) => {
        const productReviews = reviews.filter((review) => review.productId === productId);
        if (productReviews.length === 0) return 0;

        const totalStars = productReviews.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / productReviews.length).toFixed(1);
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
            <HasagiNav onSearch={handleSearch} />
            <div className="container-fluid ">
                <div className="row px-xl-5" style={{ marginTop: "120px" }}>
                    <div className="col-3">
                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="bg-white pr-3">Lọc theo:</span>
                        </h5>
                        <div className="filter-options card p-3 mb-4" style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div className="filter-section mt-0" style={{ padding: '8px 12px' }}>
                                <h6 className="filter-title text-uppercase mb-2" style={{
                                    fontSize: '1.5rem',
                                    color: '#333',
                                    fontWeight: 600,
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px',
                                    marginBottom: '3px'
                                }}>SẮP XẾP</h6>
                                <div>
                                    <Form.Control
                                        as="select"
                                        id="fashion-sorting"
                                        name="sorting"
                                        className="stylish-select"
                                        onChange={handleSortChange}
                                        value={sortOption}
                                        style={{
                                            padding: '6px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            width: '100%',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <option value="default">-----Chọn Sắp Xếp-----</option>
                                        <option value="price-asc">Giá thấp nhất</option>
                                        <option value="price-desc">Giá cao nhất</option>
                                    </Form.Control>
                                </div>
                            </div>
                        </div>
                        <div className="filter-options card p-3 mb-4" style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div className="filter-section mt-0" style={{ padding: '8px 12px' }}>
                                <h6 className="filter-title text-uppercase mb-2" style={{
                                    fontSize: '1.5rem',
                                    color: '#333',
                                    fontWeight: 600,
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px',
                                    marginBottom: '3px'
                                }}>GIÁ</h6>
                                <Slider
                                    min={0}
                                    max={1000000}
                                    step={1000}
                                    value={value}
                                    onChange={handleSliderChange}
                                    range
                                />
                                <p>Từ: {value[0].toLocaleString('vi-VN')}đ - Đến: {value[1].toLocaleString('vi-VN')}đ</p>
                                <style>
                                    {`
                                        .rc-slider-rail {
                                        background-color: #ccc; /* Màu của thanh chưa được kéo */
                                        }
                                        .rc-slider-track {
                                        background-color: #ffcc00; /* Màu của thanh khi kéo (vàng đậm) */
                                        }
                                        .rc-slider-handle {
                                        border-color: #ffcc00; /* Màu của nút kéo */
                                        background-color: #ffcc00; /* Màu nền của nút kéo */
                                        }
                                        .rc-slider-handle:focus {
                                        border-color: #ffcc00; /* Màu của nút kéo khi focus */
                                        }
                                    `}
                                </style>
                            </div>
                        </div>
                        <div className="filter-options card p-3 mb-4" style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                        <div className="filter-section mt-0" style={{ padding: '8px 12px' }}>
                            <h6 className="filter-title text-uppercase mb-2" style={{
                                fontSize: '1.5rem',
                                color: '#333',
                                fontWeight: 600,
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '5px',
                                marginBottom: '3px'
                            }}>SẢN PHẨM GIẢM GIÁ</h6>
                            <div className="filter-checkboxes" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '15px',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#C0C0C0 #f1f1f1',
                            }}>
                                {/* Checkbox "Tất cả" */}
                                <Form.Check
                                    type="checkbox"
                                    id="filter-all"
                                    label="Tất cả"
                                    checked={selectedCategories.length === 0 && !showSaleOnly}
                                    onChange={() => {
                                        setSelectedCategories([]);
                                        setShowSaleOnly(false);
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        marginBottom: '10px',
                                        fontSize: '19px',
                                    }}
                                />

                                {/* Checkbox "Sale" */}
                                <Form.Check
                                    type="checkbox"
                                    id="filter-sale"
                                    label="Sản phẩm giảm giá"
                                    checked={showSaleOnly}
                                    onChange={() => setShowSaleOnly(!showSaleOnly)}
                                    style={{
                                        cursor: 'pointer',
                                        color: '#555',
                                        transition: 'color 0.3s',
                                        marginBottom: '10px',
                                        fontSize: '19px',
                                    }}
                                />
                            </div>
                        </div>
                        </div>
                        <div className="filter-options card p-3 mb-4" style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div className="filter-section mt-0" style={{ padding: '8px 12px' }}>
                                <h6 className="filter-title text-uppercase mb-2" style={{
                                    fontSize: '1.5rem',
                                    color: '#333',
                                    fontWeight: 600,
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '5px',
                                    marginBottom: '3px'
                                }}>Danh mục</h6>
                                <div className="filter-checkboxes" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    paddingLeft: '15px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#C0C0C0 #f1f1f1',
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: '#f1f1f1',
                                        borderRadius: '10px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#C0C0C0',
                                        borderRadius: '10px',
                                        transition: 'background-color 0.3s ease',
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        backgroundColor: '#A9A9A9',
                                    },
                                }}>
                                    <Form.Check
                                        type="checkbox"
                                        id="category-all"
                                        label="Tất cả"
                                        checked={selectedCategories.length === 0}
                                        onChange={() => setSelectedCategories([])}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            marginBottom: '10px',
                                            fontSize: '19px',
                                        }}
                                    />

                                    {categories.map((category) => (
                                        <Form.Check
                                            key={category.id}
                                            type="checkbox"
                                            id={`category-${category.id}`}
                                            label={category.name}
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleCategoryChange(category.id)}
                                            style={{
                                                cursor: 'pointer',
                                                color: '#555',
                                                transition: 'color 0.3s',
                                                marginBottom: '10px',
                                                fontSize: '19px',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="filter-options card p-3 mb-4" style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div className="filter-section mt-0" style={{ padding: '8px 12px' }}>
                                <h6 className="filter-title text-uppercase mb-2" style={{
                                    fontSize: '1.5rem',
                                    color: '#333',
                                    fontWeight: 600,
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px',
                                    marginBottom: '10px'
                                }}>Thương hiệu</h6>
                                <div className="filter-checkboxes"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '15px',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#C0C0C0 #f1f1f1',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: '#f1f1f1',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#C0C0C0',
                                            borderRadius: '10px',
                                            transition: 'background-color 0.3s ease',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            backgroundColor: '#A9A9A9',
                                        },
                                    }}>
                                    <Form.Check
                                        type="checkbox"
                                        id="brand-all"
                                        label="Tất cả"
                                        checked={selectedBrands.length === 0}
                                        onChange={() => setSelectedBrands([])}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            marginBottom: '10px',
                                            fontSize: '19px'
                                        }}
                                    />

                                    {brands.map((brand) => (
                                        <Form.Check
                                            key={brand.id}
                                            type="checkbox"
                                            id={`brand-${brand.id}`}
                                            label={brand.name}
                                            checked={selectedBrands.includes(brand.id)}
                                            onChange={() => handleBrandChange(brand.id)}
                                            style={{
                                                cursor: 'pointer',
                                                color: '#555',
                                                transition: 'color 0.3s',
                                                marginBottom: '10px',
                                                fontSize: '19px'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 bg-white">
                        <div className="row pt-2">
                            <div
                                className="product-list"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)", // 4 cột
                                    gap: "20px", // Khoảng cách giữa các sản phẩm
                                }}
                            >
                                {currentProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="product-card"
                                        style={{
                                            position: "relative",
                                            overflow: "hidden",
                                            transition: "all 0.3s ease",
                                            transform: "scale(1)",
                                            boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.03)";
                                            e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.2)";
                                            const image = e.currentTarget.querySelector("img");
                                            if (image) {
                                                image.style.transform = "scale(1.1)";
                                                image.style.opacity = "0.9";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0)";
                                            const image = e.currentTarget.querySelector("img");
                                            if (image) {
                                                image.style.transform = "scale(1)";
                                                image.style.opacity = "1";
                                            }
                                        }}
                                    >
                                        <Link to={`/ShopDetail?id=${product.id}`} style={{ textDecoration: "none" }}>
                                            <Card className="card-container" style={{ position: "relative" }}>
                                                <div
                                                    className="image-container"
                                                    style={{
                                                        position: "relative",
                                                        overflow: "hidden",
                                                        width: "110%",
                                                        height: "auto",
                                                    }}
                                                >
                                                    {/* Hiển thị hình ảnh sản phẩm */}
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "350px",
                                                            transition: "transform 0.3s ease, opacity 0.3s ease",
                                                        }}
                                                    />

                                                    {/* Hiển thị nhãn giảm giá */}
                                                    {product.sale > 0 && (
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                top: "10px",
                                                                left: "10px",
                                                                backgroundColor: "#f5365c",
                                                                color: "white",
                                                                padding: "5px 10px",
                                                                borderRadius: "5px",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            -{product.sale}%
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="card-content" style={{ padding: "10px" }}>
                                                    {/* Tên sản phẩm */}
                                                    <div
                                                        style={{
                                                            fontSize: "15px",
                                                            marginBottom: "5px",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {product.name || "Product Name Goes Here"}
                                                    </div>

                                                    {/* Giá gốc và giá sau giảm */}
                                                    <div style={{ fontSize: "16px", marginBottom: "5px" }}>
                                                        {product.sale > 0 ? (
                                                            <>
                                                                <span style={{ color: "#f5365c", fontWeight: "bold" }}>
                                                                    {product.minPrice === product.maxPrice
                                                                        ? `${(product.maxPrice * (1 - product.sale / 100)).toLocaleString()}đ`
                                                                        : ` ${(product.maxPrice * (1 - product.sale / 100)).toLocaleString()}đ`}
                                                                </span>
                                                                <span style={{ textDecoration: "line-through", color: "gray", marginLeft: "5px" }}>
                                                                    {new Intl.NumberFormat("vi-VN").format(product.maxPrice)}đ
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span style={{ color: "#f5365c", fontWeight: "bold" }}>
                                                                {new Intl.NumberFormat("vi-VN").format(product.maxPrice)}đ
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Đánh giá sản phẩm */}
                                                    <Typography variant="body2" style={{ fontWeight: "bold", marginTop: "10px" }}>
                                                        ⭐ {calculateAverageStars(product.id)}
                                                    </Typography>
                                                </div>
                                            </Card>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="col-12" style={{}}>
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
                </div >
            </div >
            <Footer />
        </>
    );
}

export default Shop;