import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import BannerDataService from "../../../services/BannerServices";
import ArgonBox from "components/ArgonBox";

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
        <ArgonBox mt={5} >


            <div className="carousel-container" style={styles.carouselContainer}>
                <Carousel
                    prevIcon={<span style={styles.customPrevIcon}>&lt;</span>}  // Biểu tượng mũi tên trái
                    nextIcon={<span style={styles.customNextIcon}>&gt;</span>}  // Biểu tượng mũi tên phải
                    fade  // Thêm hiệu ứng mờ dần khi chuyển ảnh
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