import React from "react";
import '../assets/css/bootstrap.min.css';
import '../assets/css/style.css';
   
import '../assets/js/main.js';

import aboutImage from "components/client/assets/images/carousel-1.jpg";
import aboutImage1 from "components/client/assets/images/carousel-2.jpg";

const HasagiCau = () => {
    return (
        <div id="carouselId" className="carousel slide" data-bs-ride="carousel" >
            <ol className="carousel-indicators">
                <li data-bs-target="#carouselId" data-bs-slide-to="0" className="active"></li>
                <li data-bs-target="#carouselId" data-bs-slide-to="1"></li>
                <li data-bs-target="#carouselId" data-bs-slide-to="2"></li>
            </ol>
            <div className="carousel-inner" role="listbox">
                <div className="carousel-item active">
                    <img src={aboutImage} className="img-fluid w-100" alt="Image" />
                    <div className="carousel-caption-1">
                        <div className="carousel-caption-1-content" style={{ maxWidth: '900px' }}>
                            <h4 
                                className="text-white text-uppercase fw-bold mb-4 fadeInLeft animated"
                                data-animation="fadeInLeft"
                                data-delay="1s"
                                style={{ animationDelay: '1s', letterSpacing: '3px' }}
                            >
                                Importance life
                            </h4>
                            <h1 
                                className="display-2 text-capitalize text-white mb-4 fadeInLeft animated"
                                data-animation="fadeInLeft"
                                data-delay="1.3s"
                                style={{ animationDelay: '1.3s' }}
                            >
                                Always Want Safe Water For Healthy Life
                            </h1>
                            <p 
                                className="mb-5 fs-5 text-white fadeInLeft animated"
                                data-animation="fadeInLeft"
                                data-delay="1.5s"
                                style={{ animationDelay: '1.5s' }}
                            >
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            </p>
                           
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={aboutImage1} className="img-fluid w-100" alt="Image" />
                    <div className="carousel-caption-2">
                        <div className="carousel-caption-2-content" style={{ maxWidth: '900px' }}>
                            <h4 
                                className="text-white text-uppercase fw-bold mb-4 fadeInRight animated"
                                data-animation="fadeInRight"
                                data-delay="1s"
                                style={{ animationDelay: '1s', letterSpacing: '3px' }}
                            >
                                Importance life
                            </h4>
                            <h1 
                                className="display-2 text-capitalize text-white mb-4 fadeInRight animated"
                                data-animation="fadeInRight"
                                data-delay="1.3s"
                                style={{ animationDelay: '1.3s' }}
                            >
                                Always Want Safe Water For Healthy Life
                            </h1>
                            <p 
                                className="mb-5 fs-5 text-white fadeInRight animated"
                                data-animation="fadeInRight"
                                data-delay="1.5s"
                                style={{ animationDelay: '1.5s' }}
                            >
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            </p>
                       
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                <span 
                    className="carousel-control-prev-icon btn btn-primary fadeInLeft animated" 
                    aria-hidden="true" 
                    data-animation="fadeInLeft" 
                    data-delay="1.1s" 
                    style={{ animationDelay: '1.3s' }}
                > 
                    <i className="fa fa-angle-left fa-3x"></i>
                </span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                <span 
                    className="carousel-control-next-icon btn btn-primary fadeInRight animated" 
                    aria-hidden="true" 
                    data-animation="fadeInLeft" 
                    data-delay="1.1s" 
                    style={{ animationDelay: '1.3s' }}
                >
                    <i className="fa fa-angle-right fa-3x"></i>
                </span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default HasagiCau;
