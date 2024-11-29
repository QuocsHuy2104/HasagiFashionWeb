import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes if needed for future props
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import HasagiCard2 from 'components/client/HasagiCard/Card2';
import HomeService from "services/HomeServices";

function FeaturedProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const resp = await HomeService.getNewProducts();
                console.log(resp.data);
                setProducts(resp.data || []);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        };
        fetchFeaturedProducts();
    }, []);

    return (
        <ArgonBox py={8} style={{ width: '100%' }}>
            <ArgonBox
                borderRadius="lg"
                p="25px"
                style={{
                    background: 'linear-gradient(to right, #ff5f6d, #ffc371)', // Gradient background
                    width: '100%',
                }}
            >
                <ArgonBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    mb={4}
                >
                    <ArgonTypography variant="h4" color="white">
                        Sản phẩm nổi bật
                    </ArgonTypography>
                </ArgonBox>
                <ArgonBox display="flex" flexWrap="wrap" justifyContent="center" style={{ width: '100%' }}>
                    {products.length == 0 ? (
                        <ArgonTypography variant="h6" color="text" textAlign="center">
                            Không có sản phẩm nào.
                        </ArgonTypography>
                    ) : (
                        products.map((product) => {
                            return (
                                <ArgonBox key={product.id} mx={1} mb={2} style={{ flex: '1 0 23%', maxWidth: '23%' }}>
                                    <HasagiCard2
                                        image={product.image || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'}
                                        name={product.name}
                                        id={product.id}
                                        price={product.importPrice}
                                        sale={product.sale === null ? 0 : product.sale}
                                    />
                                </ArgonBox>
                            )
                        })
                    )}
                </ArgonBox>
            </ArgonBox>
        </ArgonBox>
    );
}

FeaturedProducts.propTypes = {
};

export default FeaturedProducts;
