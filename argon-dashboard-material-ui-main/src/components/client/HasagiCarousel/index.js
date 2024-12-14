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
            const bannersList = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setBanners(bannersList);
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
    const mainBanner = banners.length > 0 ? banners[0] : null;
    const smallBanners = banners.slice(1, 3);

    return (
        <ArgonBox mt={5}>
            <div style={{ paddingTop: "0px" }}>
                <div style={styles.mainContainer}>
                    <div className="carousel-container" style={styles.carouselContainer}>
                        {mainBanner && (
                            <Carousel
                                prevIcon={<span style={styles.customPrevIcon}>&lt;</span>}
                                nextIcon={<span style={styles.customNextIcon}>&gt;</span>}
                                fade
                                interval={3000}
                            >
                                {mainBanner.imageUrls.map((imageUrl, imgIndex) => (
                                    <Carousel.Item key={`main-banner-${imgIndex}`}>
                                        <div className="carousel-image-wrapper" style={styles.carouselImageWrapper}>
                                            <img
                                                className="d-block w-100"
                                                style={styles.carouselImage}
                                                src={imageUrl}
                                                alt={`Main Banner Image ${imgIndex + 1}`}
                                            />
                                            <div className="buy-button" style={styles.buyButton}>Mua</div>
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        )}
                    </div>

                    <div style={styles.smallBannersContainer}>
                        {smallBanners.map((banner, bannerIndex) => (
                            <div key={banner.id} style={styles[`smallBanner${bannerIndex + 1}`]}>
                                <Carousel
                                    interval={3000}
                                    controls={false}
                                    indicators={false}
                                >
                                    {banner.imageUrls.map((imageUrl, imgIndex) => (
                                        <Carousel.Item key={`small-banner-${bannerIndex}-${imgIndex}`}>
                                            <div className="carousel-image-wrapper" style={styles.carouselImageWrapper}>
                                                <img
                                                    className="d-block"
                                                    style={styles.smallBannerImage}
                                                    src={imageUrl}
                                                    alt={`Small Banner ${bannerIndex + 1} Image ${imgIndex + 1}`}
                                                />
                                                <div className="buy-button" style={styles.buyButton}>Mua</div>
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ArgonBox>
    );
};

const styles = {
    mainContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    carouselContainer: {
        flex: "3",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    carouselImageWrapper: {
        position: "relative",
        height: "420px",  // Make sure wrapper covers full image height
        overflow: "hidden", // Ensure that the button stays within the image bounds
    },
    carouselImage: {
        height: "420px",
        objectFit: "cover",
        borderRadius: "10px",
        width: "100%",
    },
    customPrevIcon: {
        fontSize: "2rem",
        color: "white",
        background: "rgba(0, 0, 0, 0.3)",
    },
    customNextIcon: {
        fontSize: "2rem",
        color: "white",
        background: "rgba(0, 0, 0, 0.3)",
    },
    smallBannersContainer: {
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginLeft: "20px",
    },
    smallBanner1: {
        marginBottom: "20px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        height: "200px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    smallBanner2: {
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        height: "200px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    smallBannerImage: {
        height: "100%",
        width: "100%",
        objectFit: "contain",
    },
    buyButton: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Center the button
        padding: "10px 20px",
        backgroundColor: "#FFD700", // Yellow color
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "5px",
        opacity: 0,
        transition: "opacity 0.3s ease-in-out",
        cursor: "pointer",
    },
    carouselImageWrapperHover: {
        position: "relative",
        "&:hover .buy-button": {
            opacity: 1,
        }
    },
};

export default ImageCarousel;
