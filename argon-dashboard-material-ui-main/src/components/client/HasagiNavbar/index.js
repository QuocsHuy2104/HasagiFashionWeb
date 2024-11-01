import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CategoryService from "../../../services/CategoryServices";
import BrandService from "../../../services/BrandServices";
import ColorService from "../../../services/ColorServices";
import SizeService from "../../../services/SizeServices";

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
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

        const fetchColors = async () => {
            try {
                const response = await ColorService.getAllColors();
                setColors(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching colors:", error);
                setColors([]);
            }
        };

        const fetchSizes = async () => {
            try {
                const response = await SizeService.getAllSizes();
                setSizes(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching sizes:", error);
                setSizes([]);
            }
        };

        fetchCategories();
        fetchBrands();
        fetchColors();
        fetchSizes();
    }, []);

    const navbarStyle = {
        backgroundColor: '#3D464D',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        borderBottom: 'white solid 1px',
        borderTop: 'white solid 1px',
    };

    const navMenuStyle = {
        listStyle: 'none',
        padding: 0,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
    };

    const navItemStyle = {
        marginRight: '20px',
    };

    const menuLinkStyle = {
        color: 'white',
        padding: '10px 15px',
        fontSize: '18px',
        textDecoration: 'none',
        transition: 'color 0.3s ease, background-color 0.3s ease',
    };

    const dropdownMenuStyle = {
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        width: '400px',
    };
    
    const dropdownMenuStyle1 = {
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        width: '280px',
    };
    const dropdownMenuStyle2 = {
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
    };

    const dropdownItemStyle = {
        color: '#333',
        padding: '10px 15px',
        flexBasis: '20%',
        textAlign: 'center',
    };
    

    return (
        <div className="container-fluid justify-content-between align-items-center py-5"
        style={{ marginTop: "2.86%" }}>
            <nav className="navbar navbar-expand-lg p-0" style={navbarStyle}>
                <div className="collapse navbar-collapse">
                    <ul className="nav-menu" style={navMenuStyle}>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="categories" data-bs-toggle="dropdown" aria-expanded="false">
                                DANH MỤC
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="categories">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {category.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="brands" data-bs-toggle="dropdown" aria-expanded="false">
                                THƯƠNG HIỆU
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="brands">
                                {brands.map((brand) => (
                                    <li key={brand.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {brand.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">
                                MÀU SẮC
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle1} aria-labelledby="colors">
                                {colors.map((color) => (
                                    <li key={color.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {color.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">
                                KÍCH CỠ
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle2} aria-labelledby="pages">
                                {sizes.map((size) => (
                                    <li key={size.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {size.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">
                                GIÁ
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="pages">
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>Tất cả</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>Từ thấp đến cao</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>Từ cao đến thấp</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>50.000đ - 100.000đ</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>100.000đ - 200.000đ</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>200.000đ - 300.000đ</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>300.000đ - 400.000đ</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>400.000đ - 500.000đ</a></li>
                                <li><a href="/#" className="dropdown-item" style={dropdownItemStyle}>500.000đ - ...</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
