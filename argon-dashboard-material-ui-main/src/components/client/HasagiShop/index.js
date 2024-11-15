import React, { useEffect, useState } from "react";
import 'layouts/assets/css/style.css';
import { Link } from "react-router-dom";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
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
import ChatBot from "components/client/HasagiChatBot";

function Shop() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState([]);
    const [value, setValue] = useState([0, 1000000]);

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
                const productResponse = await ProductService.getAllProducts();
                const categoryResponse = await CategoryService.getAllCategories();
                const brandResponse = await BrandService.getAllBrands();;
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
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoryDTOResp?.id);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.trademarkDTOResp?.id);
const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const minPrice = parseFloat(product.minPrice) || 0;
        const matchesPriceRange = minPrice >= value[0] && minPrice <= value[1];
    
        return matchesCategory && matchesBrand && matchesSearchTerm && matchesPriceRange;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === "price-asc") {
            return (a.minPrice || 0) - (b.minPrice || 0);
        } else if (sortOption === "price-desc") {
            return (b.minPrice || 0) - (a.minPrice || 0);
        } else if (sortOption === "popularity") {
            return (b.sold || 0) - (a.sold || 0);
        } else if (sortOption === "newest") {
            return b.id - a.id; 
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

    const formatImportPrice = (importPrice) => {
        if (!importPrice) return "0đ";

        const prices = importPrice.split(' - ').map(price => {
            const trimmedPrice = price.trim();
            const numericPrice = parseFloat(trimmedPrice);
            const integerPrice = Math.floor(numericPrice);
            return `${formatNumber(integerPrice)}đ`;
        });

        return prices.join(' - ');
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
            <HasagiNav onSearch={handleSearch} />
            <div className="container-fluid">
                <div className="row px-xl-5 pt-0">
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
                                        <option value="popularity">Phổ biến</option>
                                        <option value="newest">Mới nhất</option>
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
                    <div className="col-9">
                        <div className="row pt-2">
                            {currentProducts.map((product, index) => (
                                <div className="col-lg-3 col-md-6 col-sm-6 px-2"
                                    key={index}>
                                    <Link to={`/ShopDetail?id=${product.id}`}>
                                        <Card
                                            sx={{
                                                boxShadow: 3,
                                                borderRadius: '4px',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: 6,
                                                },
                                            }}
                                            className="product-item bg-light mb-3"
                                        >
                                            <div className="product-img position-relative overflow-hidden">
                                                <img
                                                    className="img-fluid w-100"
                                                    src={product.image || aboutImage5}
                                                    alt={product.name || 'Product Name'}
                                                    style={{
                                                        objectFit: 'cover',
                                                        height: '200px',
                                                    }}
                                                />
                                            </div>
                                            <div className="py-3 px-2">
                                                <div
                                                    className="h6 text-decoration-none text-truncate"
                                                    style={{
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        display: 'block',
                                                        marginBottom: '1px',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {product.name || "Product Name Goes Here"}
                                                </div>
                                                <Typography
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'red',
                                                        fontWeight: 'bold',
                                                        marginBottom: '10px',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    {formatImportPrice(product.importPrice)}
                                                    <div
                                                        style={{
                                                            color: '#f0e62b',
                                                            border: '1px solid #f0e62b',
                                                            padding: '0 5px',
                                                            marginLeft: '10px',

                                                        }}
                                                    >
                                                        {product.sale}%
                                                    </div>
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '10px',
                                                        fontSize: '14px'
                                                    }}
                                                >

                                                    <p> ⭐ {calculateAverageStars(product.id)} </p>
                                                </Typography>
                                            </div>
                                        </Card>
                                    </Link>
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
            <ChatBot />
        </>
    );
}

export default Shop;
