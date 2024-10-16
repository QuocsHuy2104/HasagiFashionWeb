import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import BannerDataService from "../../../services/BannerServices";
import ArgonBox from "components/ArgonBox";
import Grid from '@mui/material/Grid';
import { Paper } from "@mui/material";

const smallBannerUrl = "https://vending-cdn.kootoro.com/torov-cms/upload/image/1669358914523-kh%C3%A1i%20ni%E1%BB%87m%20qu%E1%BA%A3ng%20c%C3%A1o%20banner%20tr%C3%AAn%20website.jpg"; // Use the specific URL you provided
const smallBannerUrl1 = "https://img.timviec.com.vn/2021/07/banner-la-gi-1.jpg"; // Use the specific URL you provided

const ImageCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBanners = async () => {
        try {
            const data = await BannerDataService.getAllBanners();
            setBanners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    if (loading) {
        return <p>Loading banners...</p>;
    }

    return (
        <ArgonBox mt={5}>
            <Grid container spacing={2}>
                {/* Cột 8 */}
                <Grid item xs={12} sm={8}>
                    <div className="carousel-container" style={styles.carouselContainer}>
                        <Carousel
                            prevIcon={<span style={styles.customPrevIcon}>&lt;</span>}  // Biểu tượng mũi tên trái
                            nextIcon={<span style={styles.customNextIcon}>&gt;</span>}  // Biểu tượng mũi tên phải
                            fade
                            interval={3000}
                        >
                            {banners.map((banner, index) => (
                                banner.imageUrls.map((imageUrl, imgIndex) => (
                                    <Carousel.Item key={`${banner.id}-${imgIndex}`}>
                                        <img
                                            className="d-block w-100"
                                            style={styles.carouselImage}
                                            src={imageUrl}
                                            alt={banner.title || `Banner ${index + 1} Image ${imgIndex + 1}`}
                                        />
                                    </Carousel.Item>
                                ))
                            ))}
                        </Carousel>
                    </div>
                </Grid>

                {/* Cột 4 */}
                <Grid item xs={12} sm={4}>
                    <ArgonBox display='flex' flexDirection='column' justifyContent='contetn'>
                        <ArgonBox component='img' src={smallBannerUrl} pb={1} borderRadius='lg' height={170} />
                        <ArgonBox component='img' src={smallBannerUrl1} borderRadius='lg' height={170} />
                    </ArgonBox>
                </Grid>
            </Grid>
        </ArgonBox>
    );
};

const styles = {
    carouselContainer: {
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    carouselImage: {
        height: 'auto',
        objectFit: 'cover',
        borderRadius: '10px',
    },
    customPrevIcon: {
        fontSize: '2rem',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.3)',
        marginLeft: '40px',
    },
    customNextIcon: {
        fontSize: '2rem',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.3)',
        marginRight: '40px',
    },
};

export default ImageCarousel;
