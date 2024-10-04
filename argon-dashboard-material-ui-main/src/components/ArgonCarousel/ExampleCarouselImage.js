// ExampleCarouselImage.js

import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo rằng Bootstrap CSS được import

const ExampleCarouselImage = ({ images }) => {
    return (
        <Carousel controls indicators interval={3000} className="custom-carousel">
            {images.map((image, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={image.src}
                        alt={image.alt}
                    />
                    {image.caption && (
                        <Carousel.Caption>
                            <h3>{image.caption}</h3>
                        </Carousel.Caption>
                    )}
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

// Định nghĩa kiểu dữ liệu cho props
ExampleCarouselImage.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            alt: PropTypes.string.isRequired,
            caption: PropTypes.string
        })
    ).isRequired
};

export default ExampleCarouselImage;
