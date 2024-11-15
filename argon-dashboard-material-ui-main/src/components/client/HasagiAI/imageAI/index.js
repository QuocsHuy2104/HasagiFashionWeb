import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../../../examples/Footer";
import BrandService from "../../../services/BrandServices";
import CategoriesService from "../../../services/CategoryServices";
import ProductService from "../../../services/ProductServices";

function ProductSearch() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trademarkResponse = await BrandService.getAllBrands();
                setBrands(trademarkResponse.data);

                const categoryResponse = await CategoriesService.getAllCategories();
                setCategories(categoryResponse.data);

                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    // Hàm lấy tên thương hiệu từ brand ID
    const getBrandName = (brandId) => {
        const brand = brands.find((b) => b.id === brandId);
        return brand ? brand.name : "N/A";
    };

    // Hàm lấy tên danh mục từ category ID
    const getCategoryName = (categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : "N/A";
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <Card>
                    <ArgonBox p={2}>
                        <ArgonTypography variant="h5">Danh sách sản phẩm</ArgonTypography>
                    </ArgonBox>
                    <ArgonBox>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Hình ảnh</th>
                                    <th>Danh mục</th>
                                    <th>Thương hiệu</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>
                                            <Image src={product.image} alt={product.name} width="50" height="50" />
                                        </td>
                                        <td>{getCategoryName(product.categoryId)}</td>
                                        <td>{getBrandName(product.brandId)}</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </ArgonBox>
                </Card>
            </ArgonBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ProductSearch;
