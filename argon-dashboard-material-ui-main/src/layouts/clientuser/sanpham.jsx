import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import HasagiCard2 from 'components/client/HasagiCard/Card2';
import ShopService from "services/ShopServices";

function FeaturedProducts({ searchTerm }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const resp = await ShopService.getProductHome();
                setProducts(resp.data || []);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ArgonBox py={8} style={{ width: '100%' }}>
            <ArgonBox
                borderRadius='lg'
                p='25px'
                style={{
                    background: 'linear-gradient(to right, #ff5f6d, #ffc371)', // Gradient background
                    width: '100%',
                }}
            >
                <ArgonBox
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    flexWrap='wrap'
                    mb={4}
                >
                    <ArgonTypography variant="h4" color="white">
                        Sản phẩm nổi bật
                    </ArgonTypography>
                </ArgonBox>
                <ArgonBox display="flex" flexWrap="wrap" justifyContent="center" style={{ width: '100%' }}>
                    {filteredProducts.length === 0 ? (
                        <ArgonTypography variant="h6" color="text" textAlign="center">
                            Không có sản phẩm nào.
                        </ArgonTypography>
                    ) : (
                        filteredProducts.map((product) => (
                            <ArgonBox key={product.id} mx={1} mb={2} style={{ flex: '1 0 23%', maxWidth: '23%' }}>
                                <HasagiCard2
                                    image={product.image}
                                    name={product.name}
                                    id={product.id}
                                    importPrice={product.importPrice}
                                    sale={product.sale}
                                />
                            </ArgonBox>
                        ))
                    )}
                </ArgonBox>
            </ArgonBox>
        </ArgonBox>
    );
}

// Define prop types
FeaturedProducts.propTypes = {
    searchTerm: PropTypes.string.isRequired, // Specify searchTerm as a required string
};

export default FeaturedProducts;
