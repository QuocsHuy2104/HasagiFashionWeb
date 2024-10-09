import React from "react";
import aboutImage4 from "layouts/assets/img/offer-1.jpg";
import aboutImage from "layouts/assets/img/carousel-1.jpg";
import aboutImage1 from "layouts/assets/img/carousel-2.jpg";
import aboutImage2 from "layouts/assets/img/carousel-3.jpg";
import 'layouts/assets/css/style.css';
import { Carousel } from 'react-bootstrap';

const HasagiCau = () => {

    return (
        <div className="container-fluid mb-3 py-3">
            <div className="row px-xl-5">
                <div className="col-lg-8">
                    <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0">
                        <Carousel
                            interval={2000}
                            indicators={true}
                        >
                            <Carousel.Item style={{ height: '420px' }}>
                                <img
                                    className="d-block w-100"
                                    src={aboutImage}
                                    alt="First slide"
                                    style={{ objectFit: 'cover', height: '100%' }}
                                />
                                <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
                                    <div style={{ maxWidth: '700px' }}>
                                        <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Men Fashion</h1>
                                        <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                                            Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam
                                        </p>
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item style={{ height: '420px' }}>
                                <img
                                    className="d-block w-100"
                                    src={aboutImage1}
                                    alt="Second slide"
                                    style={{ objectFit: 'cover', height: '100%' }}
                                />
                                <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
                                    <div style={{ maxWidth: '700px' }}>
                                        <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Women Fashion</h1>
                                        <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                                            Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam
                                        </p>
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item style={{ height: '420px' }}>
                                <img
                                    className="d-block w-100"
                                    src={aboutImage2}
                                    alt="Third slide"
                                    style={{ objectFit: 'cover', height: '100%' }}
                                />
                                <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
                                    <div style={{ maxWidth: '700px' }}>
                                        <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Kids Fashion</h1>
                                        <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                                            Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam
                                        </p>
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="product-offer mb-30" style={{ height: "200px" }}>
                        <img className="img-fluid" src={aboutImage4} alt="Offer 1" />
                        <div className="offer-text">
                            <h6 className="text-white text-uppercase">Save 20%</h6>
                            <h3 className="text-white mb-3">Special Offer</h3>
                        </div>
                    </div>
                    <div className="product-offer mb-30" style={{ height: "200px" }}>
                        <img className="img-fluid" src={aboutImage4} alt="Offer 1" />
                        <div className="offer-text">
                            <h6 className="text-white text-uppercase">Save 20%</h6>
                            <h3 className="text-white mb-3">Special Offer</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HasagiCau;
