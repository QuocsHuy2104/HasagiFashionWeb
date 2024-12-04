import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import ArgonBox from "components/ArgonBox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeService from "services/HomeServices";
import HasagiCard2 from "components/client/HasagiCard/Card2";
import ArgonTypography from "components/ArgonTypography";
import MuiLink from '@mui/material/Link';
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FeaturedProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await HomeService.getNewProducts();
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <ArgonBox py={8} style={{ width: "100%" }}>
            <ArgonBox display="flex" justifyContent="space-between">
                <ArgonTypography variant="h3">Sản phẩm nổi bật</ArgonTypography>
                <MuiLink href="/Shop">
                    <ArgonTypography variant="h4">Xem thêm <FontAwesomeIcon icon={faArrowAltCircleRight} /></ArgonTypography>
                </MuiLink>
            </ArgonBox>
            <Box py={3}>
                <Slider {...settings}>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <Box
                                key={product.id || index}
                                sx={{
                                    px: 1, 
                                }}
                            >
                                <HasagiCard2
                                    image={product.image}
                                    name={product.name}
                                    id={product.id}
                                    price={product.importPrice}
                                />
                            </Box>
                        ))
                    ) : (
                        <div>Không có sản phẩm nổi bật</div>
                    )}
                </Slider>
            </Box>
        </ArgonBox>
    );
}

export default FeaturedProducts;