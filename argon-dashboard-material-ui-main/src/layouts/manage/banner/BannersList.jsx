import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import BannerDataService from "../../../services/BannerServices";
import { FaPen, FaTrash } from 'react-icons/fa';
import "../../../assets/css/app.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArgonBox from "../../../components/ArgonBox";
import ArgonButton from "../../../components/ArgonButton";
import { Image } from "react-bootstrap";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import AddBanner from "./AddBanner";




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
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // Lấy danh sách banner từ Firestore
    const getBanners = async () => {
        try {
            const data = await BannerDataService.getAllBanners();
            setBanners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        }
    };


    // Xóa banner
    const deleteBannerHandler = async (id) => {
        try {
            await BannerDataService.deleteBanner(id);
            getBanners(); // Cập nhật danh sách banner sau khi xóa
        } catch (error) {
            console.error("Failed to delete banner:", error);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    // Cấu hình cho slider
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
        <>
            <ArgonBox className="mb-3">
                <ArgonButton color="info" onClick={handleClickOpen} style={{ marginRight: '10px' }}>
                    Thêm banner
                </ArgonButton>
                <ArgonButton color="primary" onClick={getBanners}>
                    Làm mới danh sách
                </ArgonButton>
            </ArgonBox>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Popup Title</DialogTitle>
                <DialogContent>
                    <AddBanner />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            <ArgonBox className="banner-wrapper">
                {banners.map((doc) => (
                    <ArgonBox key={doc.id} className="banner-container">
                        <ArgonBox className="banner-carousel">
                            <Slider {...sliderSettings}>
                                {doc.imageUrls && doc.imageUrls.length > 0 ? (
                                    doc.imageUrls.map((url, index) => (
                                        <ArgonBox key={index} className="banner-image-container">
                                            <Image
                                                src={url}
                                                alt={`Banner ${index}`}
                                                className="banner-image"
                                                responsive
                                            />
                                            <ArgonBox className="banner-hover-content">
                                                <h5>{doc.title}</h5>
                                                <ArgonBox>
                                                    <ArgonButton
                                                        color="warning"
                                                        onClick={() => getBannerId(doc.id, doc.imageUrls)}
                                                    >
                                                        <FaPen />
                                                    </ArgonButton>

                                                    <ArgonButton
                                                        color="danger"
                                                        onClick={() => deleteBannerHandler(doc.id)}
                                                    >
                                                        <FaTrash />
                                                    </ArgonButton>
                                                </ArgonBox>
                                            </ArgonBox>
                                        </ArgonBox>
                                    ))
                                ) : (
                                    <ArgonBox className="banner-image-container">
                                        <Image
                                            src='https://via.placeholder.com/150'
                                            alt="Placeholder"
                                            className="banner-image"
                                            responsive
                                        />
                                        <ArgonBox className="banner-hover-content">
                                            <h5>No Images</h5>
                                        </ArgonBox>
                                    </ArgonBox>
                                )}
                            </Slider>
                        </ArgonBox>
                    </ArgonBox>
                ))}
            </ArgonBox>
        </>
    );
};

// Định nghĩa kiểu dữ liệu cho props
BannersList.propTypes = {
    getBannerId: PropTypes.func.isRequired,
};

export default BannersList;
