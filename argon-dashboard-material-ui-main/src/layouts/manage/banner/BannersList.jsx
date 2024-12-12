import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import BannerDataService from "../../../services/BannerServices";
import { Button } from "react-bootstrap";
import { FaPen, FaTrash } from 'react-icons/fa';
import "../../../assets/css/app.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArgonButton from "../../../components/ArgonButton";

const CustomPrevArrow = ({ onClick }) => (
    <button className="carousel-arrow carousel-arrow-left" onClick={onClick}>
        &#10094;
    </button>
);

const CustomNextArrow = ({ onClick }) => (
    <button className="carousel-arrow carousel-arrow-right" onClick={onClick}>
        &#10095;
    </button>
);

CustomPrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

CustomNextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const BannersList = ({ getBannerId }) => {
    const [banners, setBanners] = useState([]);

    const getBanners = async () => {
        try {
            const data = await BannerDataService.getAllBanners();
            setBanners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        }
    };

    const deleteBannerHandler = async (id) => {
        try {
            await BannerDataService.deleteBanner(id);
            toast.success("Xóa thành công!");
            getBanners();
        } catch (error) {
            toast.error("Thêm thất bại!");
            console.error("Failed to delete banner:", error);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };

    return (
        <div className="mt-2">
            <div className="mb-2">
                <ArgonButton color="success" onClick={getBanners}>
                    Làm mới danh sách
                </ArgonButton>
            </div>

            <div className="banner-wrapper">
                {banners.map((doc) => (
                    <div key={doc.id} className="banner-container">
                        <div className="banner-carousel">
                            <Slider {...sliderSettings}>
                                {doc.imageUrls && doc.imageUrls.length > 0 ? (
                                    doc.imageUrls.map((url, index) => (
                                        <div key={index} className="banner-image-container">
                                            <img
                                                src={url}
                                                alt={`Banner ${index}`}
                                                className="banner-image"
                                            />
                                            <div className="banner-hover-content">
                                                <h5>{doc.title}</h5>
                                                <div>
                                                    <Button
                                                        onClick={() => getBannerId(doc.id, doc.imageUrls)} // Truyền cả id và danh sách ảnh
                                                        className="btn-transparent-secondary"
                                                    >
                                                        <FaPen />
                                                    </Button>

                                                    <Button
                                                        onClick={() => deleteBannerHandler(doc.id)}
                                                        className="btn-transparent-danger"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="banner-image-container">
                                        <img
                                            src='https://via.placeholder.com/150'
                                            alt="Placeholder"
                                            className="banner-image"
                                        />
                                        <div className="banner-hover-content">
                                            <h5>No Images</h5>
                                        </div>
                                    </div>
                                )}
                            </Slider>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

BannersList.propTypes = {
    getBannerId: PropTypes.func.isRequired,
};

export default BannersList;