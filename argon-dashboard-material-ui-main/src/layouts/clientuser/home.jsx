import React, { useEffect, useState } from "react";
import 'layouts/assets/css/style.css';
import aboutImage3 from "layouts/assets/img/cat-1.jpg";
import aboutImage5 from "layouts/assets/img/product-1.jpg";
import { Grid, Typography } from "@mui/material";
import Header from "../../components/client/HasagiHeader";
import Navbar from "components/client/HasagiNavbar";
import HasagiCau from "../../components/client/HasagiCarousel";
import Footer from "../../components/client/HasagiFooter";
import Cookies from "js-cookie";
import ProductService from "../../services/ProductServices";
import CategoryService from "../../services/CategoryServices";
import BrandService from "../../services/BrandServices";
import { Link } from "react-router-dom";
import CouponList from "components/client/HasagiVorcher";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';

function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [brands, setBrands] = useState([]);
    const [productsPerPage] = useState(12);
    const pageSize = 16;
    const categoryPages = [];
    const [searchTerm, setSearchTerm] = useState("");
    const [time, setTime] = useState({ hours: 1, minutes: 26, seconds: 9 });

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                setIsLoading(false);
            }, 700);
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

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "" || product.categoryId === Number(selectedCategory);
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearchTerm;;
    });
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const countdown = setInterval(() => {
            setTime((prevTime) => {
                const { hours, minutes, seconds } = prevTime;

                if (seconds > 0) {
                    return { ...prevTime, seconds: seconds - 1 };
                } else if (minutes > 0) {
                    return { hours, minutes: minutes - 1, seconds: 59 };
                } else if (hours > 0) {
                    return { hours: hours - 1, minutes: 59, seconds: 59 };
                } else {
                    clearInterval(countdown);
                }
                return prevTime;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    return (
        <>
            {isLoading && (
                <div className="loader">
                    <div className="loader-inner">
                        <div className="circle"></div>
                    </div>
                </div>
            )}
            <Header onSearch={handleSearch} />
            < Navbar />
            <HasagiCau />
            <div className="col-lg-12 px-xl-5" style={{ top: "-25px" }}>
                <div className="bg-light p-3 d-flex flex-column"
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "5px",
                        marginLeft: "10px",
                        marginRight: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <ArgonBox
                            borderRadius='lg'
                            p='25px 25px 10px'
                            sx={{
                                background: 'linear-gradient(to bottom, #2D0798, #fcc419)'
                            }}>
                            <ArgonBox
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                                flexWrap='wrap'
                                mb={4}
                            >
                                <ArgonTypography variant='h2'>
                                    <ArgonBox component='img' src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/home_fsale_image.png?1713464283843' />
                                </ArgonTypography>
                            </ArgonBox>
                        </ArgonBox>
                    <h5 className="mb-3 d-flex align-items-center py-3" style={{
                        color: "#e63946",
                        fontWeight: "bold",
                        marginLeft: "45px",
                    }}>
                        <i className="fa fa-bolt mr-2" style={{
                            color: "#e63946",
                            fontSize: "1.2rem",
                            marginRight: "5px",
                        }}></i>
                        FLASH SALE
                        <div className="countdown d-flex">
                            {['hours', 'minutes', 'seconds'].map((unit, index) => (
                                <div className="time-box" key={unit} style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    marginLeft: '10px'
                                }}>
                                    <span className="time" style={{ fontSize: '1.2rem' }}>
                                        {String(time[unit]).padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Link to="#" style={{
                            marginLeft: "880px",
                            textDecoration: "none",
                            color: "#e63946"
                        }}>
                            Xem tất cả {'>'}
                        </Link>
                    </h5>


                    <div className="container-fluid pb-3">
                        <div className="row px-xl-5">
                            {products.map((product, index) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={index}>
                                    <div className="product-item bg-light mb-4">
                                        <div className="product-img position-relative overflow-hidden">
                                            <Link >
                                                <img
                                                    className="img-fluid w-100"
                                                    src={product.image || aboutImage5}
                                                    alt={product.name || "Product"}
                                                />
                                            </Link>
                                        </div>
                                        <div className="text-center py-4">
                                            <Link className="h6 text-decoration-none text-truncate">
                                                {product.name || "Product Name Goes Here"}
                                            </Link>
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
                        </div>
                    </div>
                </div>
            </div>

            <CouponList />
            <div className="container-fluid pt-4">
                <Typography variant="h2" className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">Danh mục</span>
                </Typography>
                <Grid container spacing={2} className="px-xl-5 pb-3">
                    {categories.map((category, index) => (
                        <Grid item lg={3} md={4} sm={6} key={index}>
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: "100px", height: "100px" }}>
                                    <img className="img-fluid" src={category.image || aboutImage3} alt={category.name || "Category"} />
                                </div>
                                <div className="flex-fill pl-3">
                                    <Typography variant="h4">{category.name || "Category Name"}</Typography>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div
                className="container-fluid pt-4">
                <Typography variant="h2" className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">Thương hiệu</span>
                </Typography>
                <Grid container spacing={2} className="px-xl-5 pb-3">
                    {brands.map((brand, index) => (
                        <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: "100px", height: "100px" }}>
                                    <img className="img-fluid" src={brand.image || aboutImage3} alt={brand.name || "Category"} />
                                </div>
                                <div className="flex-fill pl-3">
                                    <Typography variant="h4">{brand.name}</Typography>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div className="container-fluid pt-4 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">Sản phẩm</span>
                </h2>
                <div className="row px-xl-5">
                    {currentProducts.map((product, index) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={index} >
                            <div className="product-item bg-light mb-4">
                                <div className="product-img position-relative overflow-hidden" >
                                    <Link to={`/ShopDetail?id=${product.id}`}>
                                        <img
                                            className="img-fluid w-100"
                                            src={product.image || aboutImage5}
                                            alt={product.name || "Product"}
                                        />
                                    </Link>
                                </div>
                                <div className="text-center py-4">
                                    <Link className="h6 text-decoration-none text-truncate" to={`/ShopDetail?id=${product.id}`}>
                                        {product.name || "Product Name Goes Here"}
                                    </Link>
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
            <Footer />
        </>
    );
}

export default Home;




