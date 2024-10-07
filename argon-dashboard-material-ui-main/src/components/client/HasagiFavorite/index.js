import React from 'react';
import { AiOutlineShoppingCart, AiFillStar,AiOutlineClose  } from 'react-icons/ai';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import "components/client/assets/css/style.css";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import aboutImage2 from "components/client/assets/images/t1.jpg";


const Favorite = () => {
  return (
    <>
     <HasagiNav />
     <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Favorite</h1>
        <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            
            <li className="breadcrumb-item active text-white">Favorite</li>
        </ol>
    </div>
    
    <ArgonBox className="container-fluid product py-5">
        <ArgonBox className="container py-5">
          <ArgonBox className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" sx={{ maxWidth: '800px' }}>
            <ArgonTypography variant="h4" color="primary" textTransform="uppercase">Favorite list
            </ArgonTypography>
            <ArgonTypography variant="h1" fontWeight="bold" mb={3}>We Deliver Best Quality Bottle Packs.</ArgonTypography>
          </ArgonBox>
          <div className="row g-4 justify-content-center">

          <div className="col-4">
              <div className="product-container">
                <div className="thumbnail-wrapper">
                  <img
                    className="thumbnail"
                    src={aboutImage2}
                    alt="Mineral Water Bottle"
                  />
                  <button className="btn-favorite">
                    <AiOutlineClose />
                  </button>
                </div>
                <div className="line"></div>
                <div className="product-content">
                  <h5 className="product-title">Mineral Water Bottle</h5>
                  <p className="product-description">2L 1 Bottle</p>
                  <div className="price-and-buttons">
                    <p className="product-price">$35.00</p>
                    <button className="btn-add-cart">
                      <AiOutlineShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                  <div className="rating-stars">
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="product-container">
                <div className="thumbnail-wrapper">
                  <img
                    className="thumbnail"
                    src={aboutImage2}
                    alt="Mineral Water Bottle"
                  />
                  <button className="btn-favorite">
                  <AiOutlineClose />
                  </button>
                </div>
                <div className="line"></div>
                <div className="product-content">
                  <h5 className="product-title">Mineral Water Bottle</h5>
                  <p className="product-description">2L 1 Bottle</p>
                  <div className="price-and-buttons">
                    <p className="product-price">$35.00</p>
                    <button className="btn-add-cart">
                      <AiOutlineShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                  <div className="rating-stars">
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="product-container">
                <div className="thumbnail-wrapper">
                  <img
                    className="thumbnail"
                    src={aboutImage2}
                    alt="Mineral Water Bottle"
                  />
                  <button className="btn-favorite">
                  <AiOutlineClose />
                  </button>
                </div>
                <div className="line"></div>
                <div className="product-content">
                  <h5 className="product-title">Mineral Water Bottle</h5>
                  <p className="product-description">2L 1 Bottle</p>
                  <div className="price-and-buttons">
                    <p className="product-price">$35.00</p>
                    <button className="btn-add-cart">
                      <AiOutlineShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                  <div className="rating-stars">
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="product-container">
                <div className="thumbnail-wrapper">
                  <img
                    className="thumbnail"
                    src={aboutImage2}
                    alt="Mineral Water Bottle"
                  />
                  <button className="btn-favorite">
                  <AiOutlineClose />
                  </button>
                </div>
                <div className="line"></div>
                <div className="product-content">
                  <h5 className="product-title">Mineral Water Bottle</h5>
                  <p className="product-description">2L 1 Bottle</p>
                  <div className="price-and-buttons">
                    <p className="product-price">$35.00</p>
                    <button className="btn-add-cart">
                      <AiOutlineShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                  <div className="rating-stars">
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                  </div>
                </div>
              </div>
            </div>



            <div className="col-4">
              <div className="product-container">
                <div className="thumbnail-wrapper">
                  <img
                    className="thumbnail"
                    src={aboutImage2}
                    alt="Mineral Water Bottle"
                  />
                  <button className="btn-favorite">
                  <AiOutlineClose />
                  </button>
                </div>
                <div className="line"></div>
                <div className="product-content">
                  <h5 className="product-title">Mineral Water Bottle</h5>
                  <p className="product-description">2L 1 Bottle</p>
                  <div className="price-and-buttons">
                    <p className="product-price">$35.00</p>
                    <button className="btn-add-cart">
                      <AiOutlineShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                  <div className="rating-stars">
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="product-container">
                <div className="thumbnail-wrapper">
                  <img
                    className="thumbnail"
                    src={aboutImage2}
                    alt="Mineral Water Bottle"
                  />
                  <button className="btn-favorite">
                  <AiOutlineClose />
                  </button>
                </div>
                <div className="line"></div>
                <div className="product-content">
                  <h5 className="product-title">Mineral Water Bottle</h5>
                  <p className="product-description">2L 1 Bottle</p>
                  <div className="price-and-buttons">
                    <p className="product-price">$35.00</p>
                    <button className="btn-add-cart">
                      <AiOutlineShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                  <div className="rating-stars">
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                    <AiFillStar className="star" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ArgonBox>
      </ArgonBox>
    <Footer />
    </>
  );
};

export default Favorite;
