import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import BannerDataService from "../../../services/BannerServices"; // Đường dẫn đến dịch vụ lấy banner
import ArgonBox from "components/ArgonBox";

const ImageCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu banner từ dịch vụ
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

    // Giới hạn số lượng banner nhỏ (sử dụng URL cụ thể cho banner nhỏ)
    const smallBannerUrl = "https://vending-cdn.kootoro.com/torov-cms/upload/image/1669358914523-kh%C3%A1i%20ni%E1%BB%87m%20qu%E1%BA%A3ng%20c%C3%A1o%20banner%20tr%C3%AAn%20website.jpg"; // Use the specific URL you provided
    const smallBannerUrl1 = "https://img.timviec.com.vn/2021/07/banner-la-gi-1.jpg"; // Use the specific URL you provided

    return (
        <ArgonBox mt={5}>
            {/* Container cho ảnh lớn và banner nhỏ */}
            <div style={styles.mainContainer}>
                {/* Ảnh lớn */}
                <div className="carousel-container" style={styles.carouselContainer}>
                    <Carousel
                        prevIcon={<span style={styles.customPrevIcon}>&lt;</span>}
                        nextIcon={<span style={styles.customNextIcon}>&gt;</span>}
                        fade
                        interval={3000}
                    >
                        {banners.map((banner) => (
                            banner.imageUrls.map((imageUrl, imgIndex) => (
                                <Carousel.Item key={imgIndex}>
                                    <img
                                        className="d-block w-100"
                                        style={styles.carouselImage}
                                        src={imageUrl}
                                        alt={banner.title || `Banner Image ${imgIndex + 1}`}
                                    />
                                </Carousel.Item>
                            ))
                        ))}
                    </Carousel>
                </div>

                {/* Container cho các banner nhỏ */}
                <div style={styles.smallBannersContainer}>
                    <div style={styles.smallBanner}>
                        <img
                            style={styles.smallBannerImage}
                            src={smallBannerUrl}
                            alt={`Small Banner 1`}
                        />
                    </div>
                    <div style={styles.smallBanner}>
                        <img
                            style={styles.smallBannerImage}
                            src={smallBannerUrl1}
                            alt={`Small Banner 2`}
                        />
                    </div>
                </div>
            </div>
        </ArgonBox>
    );
};

const styles = {
    mainContainer: {
        display: 'flex', // Sử dụng Flexbox để sắp xếp theo chiều ngang
        justifyContent: 'space-between', // Giữa ảnh lớn và các banner nhỏ
        alignItems: 'flex-start', // Căn trên để các banner nhỏ thẳng hàng với ảnh lớn
    },
    carouselContainer: {
        flex: '3', // Chiếm 75% chiều rộng
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    carouselImage: {
        height: '400px', // Đặt chiều cao cố định cho ảnh lớn
        objectFit: 'cover', // Giữ tỉ lệ ảnh và cắt phần thừa
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
    smallBannersContainer: {
        flex: '1', // Chiếm 25% chiều rộng
        display: 'flex',
        flexDirection: 'column', // Sắp xếp các banner nhỏ theo cột
        justifyContent: 'space-between', // Căn đều khoảng cách giữa các banner nhỏ
        marginLeft: '20px', // Khoảng cách giữa ảnh lớn và các banner nhỏ
    },
    smallBanner: {
        marginBottom: '10px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        height: '200px', // Chiều cao cố định cho banner nhỏ
        width: '100%', // Đảm bảo banner nhỏ chiếm toàn bộ chiều rộng của container
    },
    smallBannerImage: {
        width: '100%',
        height: '100%', // Đảm bảo ảnh trong banner nhỏ phù hợp với kích thước container
        objectFit: 'cover', // Giữ tỉ lệ ảnh và cắt phần thừa
        borderRadius: '10px',
    },
};

export default ImageCarousel;
