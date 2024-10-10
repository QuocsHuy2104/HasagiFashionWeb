import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import HasagiNav from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter';
import 'components/client/assets/css/style.css';
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import aboutImage2 from 'components/client/assets/images/t1.jpg';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const accountId = Cookies.get('accountId');
    if (accountId) {
      axios.get(`http://localhost:3000/api/favorites/user?accountId=${accountId}`, {
        withCredentials: true, 
      })
        .then(response => {
          setFavorites(response.data); 
        })
        .catch(error => {
          console.error('Error fetching favorites:', error);
        });
    } else {
      console.error('Account ID is not available in cookies');
    }
  }, []);

  const removeFavorite = (productId) => {
    const accountId = Cookies.get('accountId');  // Get accountId from the cookie
    if (accountId) {
      axios.delete(`http://localhost:3000/api/favorites/${productId}`, {
        params: { accountId },  // Send accountId as a query parameter
        withCredentials: true,  // Ensure cookies are included in the request
      })
      .then(() => {
        // Update the state by removing the deleted favorite from the list
        setFavorites(favorites.filter(favorite => favorite.productId !== productId));
      })
      .catch(error => {
        console.error('Error removing favorite:', error);
      });
    } else {
      console.error('Account ID is not available in cookies');
    }
  };

  return (
    <>
      <HasagiNav />
      <ToastContainer />
      <ArgonBox className="container-fluid product py-5">
        <ArgonBox className="container py-3">
          <ArgonBox className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" sx={{ maxWidth: '800px' }}>
            <ArgonTypography variant="h4" color="primary" textTransform="uppercase">Danh sách yêu thích</ArgonTypography>
          </ArgonBox>
          <div className="row g-4 justify-content-center py-3">
            {favorites.map((favorite) => (
              <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={favorite.productId}>
                <div className="product-item bg-light mb-4">
                  <div className="product-img position-relative overflow-hidden">
                    <img
                      className="img-fluid w-100"
                      src={favorite.productImageUrl || aboutImage2}
                      alt={favorite.productName}
                    />
                    <button className="btn-favorite" style={{ top: "-5px" }} onClick={() => removeFavorite(favorite.productId)}>
                      <AiOutlineClose />
                    </button>
                  </div>
                  <div className="text-center py-4">
                    {favorite.productName}
                    <div className="d-flex align-items-center justify-content-center mt-2">
                      {/* <p className="product-description">{favorite.productDescription}</p> */}
                      <h5>
                        {favorite.productPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-1">
                      <small className="fa fa-star text-primary mr-1"></small>
                      <small className="fa fa-star text-primary mr-1"></small>
                      <small className="fa fa-star text-primary mr-1"></small>
                      <small className="fa fa-star text-primary mr-1"></small>
                      <small className="fa fa-star text-primary mr-1"></small>
                      <small>({99})</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ArgonBox>
      </ArgonBox>
      <Footer />
    </>
  );
};

export default Favorite;

