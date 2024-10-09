import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import HasagiCard from 'components/client/HasagiCard';
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
                p='25px 25px 10px'
                style={{
                    background: 'linear-gradient(to right, #ff5f6d, #ffc371)', // Changed to a solid orange color
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
                        <ArgonTypography variant="h6">
                            Không có sản phẩm nào.
                        </ArgonTypography>
                    ) : (
                        filteredProducts.map((product) => (
                            <ArgonBox key={product.id} mx={1} mb={2} style={{ flex: '1 0 23%', maxWidth: '23%' }}>
                                <HasagiCard
                                    image={product.image}
                                    sold={product.name}
                                    description={product.name}
                                    action={{
                                        type: "internal",
                                        route: `/ShopDetail?id=${product.id}`,
                                    }}
                                    id={product.id}
                                    price={product.importPrice}
                                    month={10}
                                    buttonStyle={{ padding: '10px 20px', fontSize: '16px' }}
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
