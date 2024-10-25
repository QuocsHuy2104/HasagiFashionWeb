import React, { useEffect, useState } from "react";
import { Modal as MuiModal, Button as MuiButton, Box, Tabs, Tab, Paper, Grid, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Modal as BootstrapModal, Button as BootstrapButton } from 'react-bootstrap';
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import HasagiNav from "components/client/HasagiHeader";
import HistoryOrderService from "../../../services/HistoryOrderServices";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Footer from "components/client/HasagiFooter";
import aboutImage from "layouts/assets/img/order.png";
import axios from 'axios';
import Videocam from '@mui/icons-material/Videocam'; // Biểu tượng máy quay phim
import { Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Biểu tượng máy ảnh
import reviewsService from "services/ReviewsServices";
const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOptions] = useState([
    "Đổi ý không muốn mua nữa",
    "Tìm được giá tốt hơn",
    "Thời gian giao hàng quá lâu",
    "Sản phẩm không còn nhu cầu",
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    const fetchOrderHistory = async () => {
      try {
        const response = await HistoryOrderService.getHistory();
        setOrders(response.data);
      } catch (error) {
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
    const intervalId = setInterval(() => {
      fetchOrderHistory();
  }, 3000);
  return () => {
      clearInterval(intervalId);
  };
  }, [location.state]);

  const fetchHandleBuyNow = async (orderId) => {
    HistoryOrderService.getBuyAgain(orderId);
    setTimeout(() => {
      navigate("/Cart");
    }, 10);
  };

  const handleOpenCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenCancelModal(true);
  };

  const handleCancelOrder = async () => {
    try {
      await axios.put(`http://localhost:3000/api/history-order/${selectedOrderId}/cancel`, {
        reason: cancelReason,
      });

      const response = await HistoryOrderService.getHistory();
      setOrders(response.data);

      const canceledOrder = response.data.find(order => order.id === selectedOrderId);

      if (canceledOrder?.payStatus === "Đã thanh toán") {
        setActiveTab('cho-hoan-tien');
      } else {
        setActiveTab('da-huy');
      }

      setOpenCancelModal(false);
    } catch (error) {
      console.error("There was an error canceling the order!", error);
    }
  };

  const handleStatusComplete = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/history-order/${orderId}/complete`);
      console.log("Complete Order Response:", response.data);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: 'hoan-thanh' } : order
        )
      );
      const response1 = await HistoryOrderService.getHistory();
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error updating the status to complete!", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.statusSlug !== activeTab) {
      return false;
    }
    if (searchQuery && !order.id.toString().includes(searchQuery)) {
      return false;
    }
    return true;
  });

  const goBack = () => {
    navigate(`/feature-section`);
  };

  const getOrderCount = (status) => {
    return orders.filter(order => order.statusSlug === status).length;
  };

  const styles = {
    formControl: {
      border: '1px solid #ddd',
      padding: '10px 20px',
      fontSize: '14px',
      width: '500px',
    },
  };

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    console.log(product)
  };

  const handleClose = () => setShowReviewModal(false);

  const handleStarClick = (index) => {
    setStar(index + 1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the actual file to be used in form submission
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL to display the image
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file); // Set the actual file to be used in form submission
      setVideoPreview(URL.createObjectURL(file)); // Create a preview URL to display the video
    }
  };


  const resetImageInput = () => {
    setImage(null); // Reset state của ảnh
    setImagePreview(null); // Reset preview ảnh
    const imageInput = document.getElementById('image-upload');
    if (imageInput) {
      imageInput.value = ''; // Reset giá trị input
    }
  };

  const resetVideoInput = () => {
    setVideo(null); // Reset state của video
    setVideoPreview(null); // Reset preview video
    const videoInput = document.getElementById('video-upload');
    if (videoInput) {
      videoInput.value = ''; // Reset giá trị input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('star', star);
    formData.append('comment', comment);
    formData.append('orderDetailId', selectedProduct.orderDetailId); // Thêm productId vào formData

    if (image) {
      formData.append('image', image);
    }
    if (video) {
      formData.append('video', video);
    }

    try {
      const response = await reviewsService.createReview(formData);
      console.log('Review created successfully:', response);
      // Reset fields after successful submission
      setStar(5);
      setComment('');
      resetImageInput();
      resetVideoInput();
      setSnackbarMessage('Đánh giá đã được gửi thành công!');
      setOpenSnackbar(true);
      handleClose();
    } catch (error) {
      console.error('Error creating review:', error.response.data);
      alert('Có lỗi xảy ra khi tạo đánh giá. Vui lòng kiểm tra thông tin và thử lại.');
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <HasagiNav />
      <br />
      <ArgonBox p={3}>
        <div className="header" style={{ paddingTop: "50px" }}>
          <button className="back-button" onClick={goBack}>
            <i className="ni ni-bold-left" />
          </button>
          <h5 className="mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Lịch sử đơn hàng</h5>
        </div>

        {/* Tabs for filtering orders */}
        <Paper elevation={3} style={{ padding: "16px", position: "relative", maxWidth: "1000px", margin: "0 auto", marginBottom: "20px" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={`Tất cả (${orders.length})`} value="all" />
            <Tab label={`Đang xử lý (${getOrderCount('dang-xu-ly')})`} value="dang-xu-ly" />
            <Tab label={`Đang vận chuyển (${getOrderCount('dang-giao')})`} value="dang-giao" />
            <Tab label={`Đã giao (${getOrderCount('da-giao')})`} value="da-giao" />
            <Tab label={`Hoàn thành (${getOrderCount('hoan-thanh')})`} value="hoan-thanh" />
            <Tab label={`Đã hủy (${getOrderCount('da-huy')})`} value="da-huy" />
            <Tab label={`Trả hàng/Hoàn tiền (${getOrderCount('cho-hoan-tien')})`} value="cho-hoan-tien" />
          </Tabs>
        </Paper>

        {activeTab === 'all' && (
          <div className="d-flex justify-content-center">
            <input
              type="search"
              placeholder="Tìm kiếm"
              className="form-control rounded-pill me-2"
              aria-label="Search"
              style={styles.formControl}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        )}
        <Box p={3} style={{ padding: "16px", position: "relative", maxWidth: "1030px", margin: "0 auto", marginBottom: "20px" }}>
          {filteredOrders.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
              flexDirection="column"
            >
              <img src={aboutImage} style={{ height: "60px", width: "60px" }} />
              <Typography style={{ fontSize: "18px", color: "#6c757d", marginTop: "10px" }}>
                Chưa có đơn hàng.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredOrders.map((order) => (
                <Grid item xs={12} key={order.id}>
                  <Paper elevation={3} style={{ padding: "16px", position: "relative" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <i
                          className="fa fa-map-marker-alt"
                          style={{ color: 'red', fontSize: '1.5rem', marginRight: '5px' }}
                        ></i>
                        <Typography
                          variant="h6"
                          component="h5"
                          style={{ color: '#e63946', fontSize: '1.2rem', fontWeight: 'bold', marginRight: '10px' }}
                        >
                          Địa Chỉ Nhận Hàng:
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                          {order.fullNameAddress}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        {order.statusName}
                      </Typography>
                    </Box>
                    <section
                      style={{
                        border: 'none', /* No default border */
                        borderTop: '2px dashed rgba(128, 128, 128, 0.4)', /* Light gray, semi-transparent dashed line */

                        margin: '10px 0', /* Optional spacing */
                      }}
                    />
                    {order.products && order.products.length > 0 ? (
                      <Box display="flex" flexDirection="column">
                        {order.products.map((product, index) => (
                          <Box display="flex" alignItems="center" key={index} style={{ marginBottom: "25px", marginTop: "-15px" }}>
                            <img src={product.productImage} alt="Product" style={{ width: "100px", marginRight: "16px" }} />
                            <Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" gutterBottom>
                                  {product.productName}
                                </Typography>
                                {order.statusSlug === "hoan-thanh" && product.canReview  &&(
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    onClick={() => handleReviewClick(product)}
                                    style={{ marginLeft: "600px", color: "black" }}
                                  >
                                    Đánh giá
                                  </Typography>
                                )}

                              </Box>
                              <Typography variant="body2" color="textSecondary" style={{ color: "black" }}>
                                Phân loại hàng: {product.color}, {product.size}
                              </Typography>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="textSecondary" style={{ color: "black" }}>
                                  Số lượng: {product.productQuantity}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" style={{ marginLeft: "600px", color: "black" }}>
                                  Thành tiền: {product.productPrice}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Không có sản phẩm nào trong đơn hàng.
                      </Typography>
                    )}
                    <section
                      style={{
                        border: 'none', /* No default border */
                        borderTop: '2px dashed rgba(128, 128, 128, 0.4)', /* Light gray, semi-transparent dashed line */
                        margin: '10px 0', /* Optional spacing */
                        marginTop: "-10px"
                      }}
                    />
                    <Typography variant="body2" color="textSecondary" style={{ marginLeft: "800px", color: "black", marginTop: "-10px" }}>
                      Tổng tiền: {order.amount}đ
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      {order.statusSlug === 'dang-xu-ly' ? (
                        <MuiButton
                          variant="outlined"
                          onClick={() => handleOpenCancelModal(order.id)}
                          style={{ marginRight: "10px", backgroundColor: "red" }}
                        >
                          Hủy đơn
                        </MuiButton>
                      ) : order.statusSlug === 'da-giao' ? (
                        <MuiButton
                          variant="outlined"
                          onClick={() => handleStatusComplete(order.id)}
                          style={{ marginRight: "10px", backgroundColor: "green" }}
                        >
                          Hoàn thành
                        </MuiButton>
                      ) : (order.statusSlug === 'da-huy' || order.statusSlug === 'hoan-thanh') ? (
                        <MuiButton
                          variant="outlined"
                          onClick={() => fetchHandleBuyNow(order.id)}
                          style={{ marginRight: "10px", backgroundColor: "green" }}
                        >
                          Mua lại
                        </MuiButton>
                      ) : null}

                      {order.statusSlug === 'da-huy' ? (
                        <MuiButton
                          variant="contained"
                          href={`/history-order/${order.id}`}
                          color="primary"
                          style={{ marginRight: "10px" }}
                        >
                          Xem chi tiết hủy đơn
                        </MuiButton>
                      ) : (
                        <MuiButton
                          variant="contained"
                          href={`/history-order/${order.id}`}
                          color="primary"
                          style={{ marginRight: "10px" }}
                        >
                          Xem chi tiết hóa đơn
                        </MuiButton>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

      </ArgonBox >
      <MuiModal open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <Box p={3} style={{ backgroundColor: 'white', width: '300px', margin: '50px auto', borderRadius: '8px' }}>
          <ArgonTypography variant="h6">Chọn lý do hủy đơn hàng</ArgonTypography>
          <RadioGroup
            aria-label="cancel-reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            style={{ marginTop: '15px' }}
          >
            {cancelOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          <ArgonButton
            variant="contained"
            style={{ marginTop: '15px', backgroundColor: 'red', color: 'white' }}
            onClick={handleCancelOrder}
            disabled={!cancelReason}
          >
            Xác nhận hủy
          </ArgonButton>
        </Box>
      </MuiModal>
      {selectedProduct && (
        <BootstrapModal show={showReviewModal} size="lg">
          <BootstrapModal.Body>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontSize: '25px', margin: 0 }}>Đánh giá sản phẩm</p>
              <IconButton onClick={handleClose} style={{ color: 'inherit' }}>
                <CloseIcon />
              </IconButton>
            </div>
            {selectedProduct && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img
                    src={selectedProduct.productImage}
                    alt={selectedProduct.productName}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '5px',
                      objectFit: 'cover',
                      marginRight: '10px',
                      border: '1px solid #ddd',
                    }}
                  />
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                      {selectedProduct.productName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0 0 0' }}>
                      <p style={{ color: '#888', margin: '0 15px 0 0', fontSize: '16px' }}>
                        Màu: <span style={{ color: '#555' }}>{selectedProduct.color}</span>
                      </p>
                      <p style={{ color: '#888', margin: '0', fontSize: '16px' }}>
                        Kích cỡ: <span style={{ color: '#555' }}>{selectedProduct.size}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '50px', fontSize: '18px' }}>Chất lượng sản phẩm:</label>
                    <div style={{ display: 'flex' }}>
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          onClick={() => handleStarClick(index)}
                          style={{ cursor: 'pointer', marginRight: '20px' }}
                        >
                          {index < star ? (
                            <StarIcon style={{ color: '#FFD700', transform: 'scale(2)' }} /> // Increase the scale size
                          ) : (
                            <StarBorderIcon style={{ color: '#FFD700', transform: 'scale(2)' }} />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    {/* Nút Tải lên hình ảnh */}
                    <div style={{ marginRight: '5px' }}>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                      <BootstrapButton
                        variant="outlined"
                        component="span"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #000',
                          padding: '0',
                          width: '100px',
                          height: '100px',
                          borderRadius: '8px',
                        }}
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        <PhotoCamera style={{ fontSize: '48px', color: 'black' }} /> {/* Tăng kích thước icon */}
                      </BootstrapButton>
                    </div>

                    {imagePreview && (
                      <div style={{ position: 'relative', marginRight: '3px' }}>
                        <img
                          src={imagePreview}
                          alt="Selected"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            padding: '0',
                            color: '#fff',
                            fontSize: '15px',
                            backgroundColor: '#B8B8B8',
                          }}
                          onClick={resetImageInput} // Gọi hàm reset ảnh
                        >
                          <CloseIcon style={{ fontSize: '16px' }} />
                        </IconButton>
                      </div>
                    )}
                    {/* Nút Tải lên video */}
                    <div style={{ marginLeft: '1px' }}>
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={handleVideoChange}
                      />
                      {videoPreview ? (
                        <div style={{ position: 'relative', marginTop: '10px' }}>
                          <video
                            src={videoPreview}
                            controls
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                            }}
                          />
                          <IconButton
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              padding: '0',
                              color: '#fff',
                              fontSize: '15px',
                              backgroundColor: '#B8B8B8',
                            }}
                            onClick={resetVideoInput}
                          >
                            <CloseIcon style={{ fontSize: '16px' }} />
                          </IconButton>
                        </div>
                      ) : (
                        <BootstrapButton
                          variant="outlined"
                          component="span"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #000',
                            padding: '0',
                            width: '100px',
                            height: '100px',
                            borderRadius: '8px',
                          }}
                          onClick={() => document.getElementById('video-upload').click()}
                        >
                          <Videocam style={{ fontSize: '48px', color: 'black' }} /> {/* Tăng kích thước icon */}
                        </BootstrapButton>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #888888',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Nhập đánh giá của bạn"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <BootstrapButton
                      type="submit"
                      variant="contained"
                      style={{
                        color: '#000',
                        backgroundColor: '#FFD700', // Yellow color for the Gửi đánh giá button
                        borderColor: '#FFD700',
                      }}
                    >
                      Gửi đánh giá
                    </BootstrapButton>
                  </div>
                  <Snackbar
                    open={openSnackbar}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  />
                </form>
              </>
            )}
          </BootstrapModal.Body>
        </BootstrapModal>
      )}
      <Footer />
    </>
  );
};

export default History;