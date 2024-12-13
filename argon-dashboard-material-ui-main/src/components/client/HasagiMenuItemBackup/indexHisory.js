import React, { useRef, useEffect, useState } from "react";
import {
  Modal as MuiModal,
  Button as MuiButton,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Modal as BootstrapModal, Button as BootstrapButton } from "react-bootstrap";
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import HistoryOrderService from "../../../services/HistoryOrderServices";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Footer from "components/client/HasagiFooter";
import aboutImage from "layouts/assets/img/order.png";
import axios from "axios";
import Videocam from "@mui/icons-material/Videocam";
import { Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import reviewsService from "services/ReviewsServices";
import Swal from "sweetalert2";
import ReviewFilesService from '../../../services/ReviewFileServices';
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const indexHistory = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
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
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetailId, setOrderDetailId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage] = useState("");

  const paperRef = useRef(null);
  const searchInputRef = useRef(null);
  const [stickyStyle, setStickyStyle] = useState({ position: "relative" });
  const [searchStyle, setSearchStyle] = useState({ position: "relative" });
  const [tabMarginTop, setTabMarginTop] = useState("60px");
  const [tabMarginTop1, setTabMarginTop1] = useState("30px");
  const threshold = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [images, setImages] = useState([]);
  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnOptions] = useState([
    "Màu sắc không giống với hình ảnh hoặc mô tả",
    "Chất liệu sản phẩm không như mong đợi",
    "Sản phẩm bị lỗi: rách, hỏng hoặc có vết bẩn",
    "Nhận nhầm sản phẩm hoặc thiếu phụ kiện đi kèm",
    "Sản phẩm không phù hợp sau khi thử",
    "Thời gian giao hàng quá lâu khiến tôi không còn nhu cầu",
    "Tôi không còn nhu cầu sử dụng sản phẩm này nữa",
  ]);


  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    const fetchOrderHistory = async () => {
      try {
        const response = await HistoryOrderService.getHistory();
        const ordersData = response.data;
        setOrders(ordersData);
        const allProducts = ordersData.flatMap(order => order.products || []);

        const imageRequests = allProducts.map((product) =>
          axios
            .get(
              `http://localhost:3000/api/public/webShopDetail/product-detail/${product.productId}`
            )
            .then((res) => ({ productId: product.productId, data: res.data }))
        );
        const imagesData = await Promise.all(imageRequests);
        const imagesMap = imagesData.reduce((acc, { productId, data }) => {
          acc[productId] = data;
          return acc;
        }, {});
        setImages(imagesMap);
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


  const handleOpenReturnModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenReturnModal(true);
  };



  const handleCancelOrder = async () => {
    try {
      await axios.put(`http://localhost:3000/api/history-order/${selectedOrderId}/cancel`, {
        reason: cancelReason,
      });

      const response = await HistoryOrderService.getHistory();
      setOrders(response.data);

      const canceledOrder = response.data.find((order) => order.id === selectedOrderId);

      if (canceledOrder?.payStatus === "Đã thanh toán") {
        setActiveTab("da-huy");
      }

      setOpenCancelModal(false);
    } catch (error) {
      console.error("There was an error canceling the order!", error);
    }
  };

  const handleStatusComplete = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/history-order/${orderId}/complete`
      );
      console.log("Complete Order Response:", response.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, slug: "hoan-thanh" } : order))
      );
      const response1 = await HistoryOrderService.getHistory();
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error updating the status to complete!", error);
    }
  };


  const handleReturnOrder = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/history-order/${selectedOrderId}/return`,
        null,
        {
          params: { reason: returnReason },
        }
      );
      setOpenReturnModal(false);
      const response = await HistoryOrderService.getHistory();

      setOrders(response.data);

    } catch (error) {
      console.error("There was an error processing the return request!", error);
      alert("Không thể xử lý yêu cầu trả hàng. Vui lòng thử lại.");
    }
  };



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.statusSlug !== activeTab) {
      return false;
    }
    if (searchQuery && !order.id.toString().includes(searchQuery)) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchQuery]);

  const getOrderCount = (status) => {
    return orders.filter((order) => order.statusSlug === status).length;
  };

  const styles = {
    formControl: {
      border: "none",
      fontSize: "14px",
      backgroundColor: "#f0f0f0",
      outline: "none",
      boxShadow: "none",
      height: "45px",
      borderRadius: "0px",
    },
  };

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    console.log(product);
    const orderDetailId = product?.orderDetailId;
    setOrderDetailId(orderDetailId);
    console.log("Selected OrderDetailId:", orderDetailId);
  };

  const handleClose = () => setShowReviewModal(false);

  const handleStarClick = (index) => {
    setStar(index + 1);
  };


  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentOrder = filteredOrders.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleSubmitAndAddReviewFile = async (e) => {
    e.preventDefault();

    if (!orderDetailId) {
      alert("Order Detail ID không hợp lệ!");
      return;
    }

    const formData = new FormData();
    formData.append("star", star);
    formData.append("comment", comment);
    formData.append("orderDetailId", orderDetailId);

    try {
      const swal = Swal.fire({
        title: "Đang xử lý...",
        width: 500,
        height: 300,
        padding: "1em",
        color: "white",
        background: "transparent",
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: "custom-popup",
        },
        didOpen: () => {
          const popup = document.querySelector(".swal2-popup");
          popup.style.overflow = "hidden";
        },
      });

      // Gửi đánh giá
      const response = await reviewsService.createReview(formData);
      const reviewId = response.id;

      console.log("Phản hồi từ API:", response);
      console.log("Review ID nhận được:", reviewId);

      if (!reviewId) {
        throw new Error("Không lấy được ID review.");
      }

      // Tải đồng thời các hình ảnh
      const uploadImagePromises = imageFiles.map(async (imageFile) => {
        const storageRef = ref(storage, `review_files/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        await uploadTask;
        return getDownloadURL(uploadTask.snapshot.ref);
      });

      // Tải video nếu có
      const uploadVideoPromise = videoFile
        ? (async () => {
          const videoStorageRef = ref(storage, `review_files/${videoFile.name}`);
          const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);
          await videoUploadTask;
          return getDownloadURL(videoUploadTask.snapshot.ref);
        })()
        : Promise.resolve("");

      const [imageUrls, videoUrl] = await Promise.all([
        Promise.all(uploadImagePromises),
        uploadVideoPromise,
      ]);

      const newReviewFile = {
        imageUrls,
        videoUrl,
        reviewId: parseInt(reviewId, 10),
      };

      await ReviewFilesService.createFileReviews(newReviewFile);

      setTimeout(() => {
        swal.update({
          title: "Thành công!",
          html: "Đánh giá và thêm file review thành công!",
          icon: "success",
          color: "black",
          showConfirmButton: true,
          background: "#fff",
          didOpen: () => {
            document.body.style.overflowY = "auto";
            document.body.style.padding = "0";
          },
          willClose: () => {
            document.body.style.overflowY = "auto";
            document.body.style.padding = "0";
          },
        });
      }, 0);
      setStar(5);
      setComment("");
      setImageFiles([]);
      setVideoFile(null);
      handleClose();
    } catch (error) {
      console.error("Lỗi xử lý:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra trong quá trình xử lý.";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMessage,
        scrollbarPadding: false,
      });
    }
  };


  const handleImageChange = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files);
    const limitedFiles = newFiles.slice(0, 5 - imageFiles.length);
    setImageFiles([...imageFiles, ...limitedFiles]);
  };


  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedImages);
  };


  const resetVideoInput = () => {
    setVideoFile(null);
    const inputFile = document.getElementById('video-upload');
    inputFile.value = '';
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Cập nhật style cho Paper
      if (scrollY >= threshold) {
        setStickyStyle({
          position: "fixed",
          width: "66.66%",
          top: "12.5%",
          zIndex: 999,
        });
        setSearchStyle({
          position: "fixed",
          width: "66.66%",
          top: "23.11%",
          border: "none",
          fontSize: "14px",
          backgroundColor: "#f0f0f0",
          outline: "none",
          boxShadow: "none",
          height: "45px",
          borderRadius: "0px",
          zIndex: 998,
        });
      } else {
        setStickyStyle({
          position: "relative",
          top: "13.55%",
        });
        setSearchStyle({
          position: "relative",
          border: "none",
          fontSize: "14px",
          backgroundColor: "#f0f0f0",
          outline: "none",
          boxShadow: "none",
          height: "45px",
          borderRadius: "0px",
          top: "0px",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    window.scrollTo(0, 0);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChangeWithScroll = (event, newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflowY = "auto";
      document.body.style.padding = "0";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showReviewModal]);

  return (
    <>
      <div>
        <ArgonBox style={{ marginLeft: "-1.22%", width: "102.44%", paddingBottom: "40px" }}>
          <Paper
            ref={paperRef}
            elevation={3}
            style={{
              ...stickyStyle,
              padding: "16px",
              boxShadow: "none",
            }}
          >
            <Tabs value={activeTab} onChange={handleTabChangeWithScroll}>
              <Tab label={`Tất cả (${orders.length})`} value="all" />
              <Tab label={`Đang xử lý (${getOrderCount("dang-xu-ly")})`} value="dang-xu-ly" />
              <Tab label={`Đang vận chuyển (${getOrderCount("dang-giao")})`} value="dang-giao" />
              <Tab label={`Đã giao (${getOrderCount("da-giao")})`} value="da-giao" />
              <Tab label={`Hoàn thành (${getOrderCount("hoan-thanh")})`} value="hoan-thanh" />
              <Tab label={`Đã hủy (${getOrderCount("da-huy")})`} value="da-huy" />
              <Tab label={`Trả hàng (${getOrderCount("tra-hang")})`} value="tra-hang" />
            </Tabs>
          </Paper>
          {activeTab === "all" && (
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: searchStyle.position === "fixed" ? "80px" : "0px" }}
            >
              <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f0f0f0", borderRadius: "4px", padding: "0 10px", height: "45px", width: "100%" }}>
                <i className="fas fa-search" style={{ color: "#888", marginRight: "10px" }}></i> {/* Icon tìm kiếm */}
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Bạn có thể tìm kiếm theo ID đơn hàng"
                  className="form-control"
                  aria-label="Search"
                  style={{
                    flex: 1,
                    border: "none",
                    fontSize: "14px",
                    backgroundColor: "transparent",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}

          <Box
            p={3}
            style={{
              padding: "16px",
              position: "relative",
              maxWidth: "1030px",
              margin: "0 auto",
            }}
          >
            {currentOrder.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
                flexDirection="column"
              >
                <img
                  src={aboutImage}
                  style={{
                    height: "60px",
                    width: "60px",
                    marginTop: stickyStyle.position === "fixed" ? tabMarginTop : "0px",
                  }}
                />
                <Typography
                  style={{
                    fontSize: "18px",
                    color: "#6c757d",
                    marginTop: "10px",
                  }}
                >
                  Chưa có đơn hàng.
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                style={{
                  marginTop: stickyStyle.position === "fixed" ? tabMarginTop1 : "0px",
                  justifyContent: "center",
                }}
              >
                {currentOrder.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Paper
                      elevation={2}
                      style={{
                        padding: "16px",
                        marginLeft: "0%",
                        width: "100%",
                        position: "relative",
                        borderRadius: "0px",
                        // boxShadow: "0 2px 0px rgba(0, 0, 0, 0.2)",
                        marginTop: "15px",
                        borderTop: "2px solid #ddd",
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          <i
                            className="fa fa-map-marker-alt"
                            style={{ color: "red", fontSize: "1.5rem", marginRight: "5px" }}
                          ></i>
                          <Typography
                            variant="h6"
                            component="h5"
                            style={{
                              color: "#e63946",
                              fontSize: "1.2rem",
                              fontWeight: "bold",
                              marginRight: "10px",
                            }}
                          >
                            Địa Chỉ Nhận Hàng:
                          </Typography>
                          <Typography variant="body1" color="textPrimary">
                            {order.fullNameAddress}
                          </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom style={{ color: "#ee4d2d" }}>
                          {order.statusName}
                        </Typography>
                      </Box>
                      <section
                        style={{
                          border: "none",
                          borderTop: "2px dashed rgba(128, 128, 128, 0.4)",
                          margin: "10px 0",
                        }}
                      />
                      {order.products && order.products.length > 0 ? (
                        <Box display="flex" flexDirection="column">
                          {order.products.map((product, index) => {
                            const matchingImage = images[product.productId]?.find(
                              (image) => image.colorsDTO?.id === product.colorId
                            );

                            return (
                              <Box
                                display="flex"
                                alignItems="center"
                                key={index}
                                style={{ marginBottom: "25px", marginTop: "-20px" }}
                              >
                                {matchingImage && (
                                  <img
                                    src={matchingImage.imageDTOResponse[0]?.url}
                                    alt={product.productName || "Product"}
                                    style={{ width: "90px", marginRight: "16px", height: "100px" }}
                                  />
                                )}
                                <Box>
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" gutterBottom>
                                      {product.productName}
                                    </Typography>
                                    {order.statusSlug === "hoan-thanh" && product.canReview && (
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        onClick={() => handleReviewClick(product)}
                                        style={{ marginLeft: "400px" }}
                                        onMouseEnter={(e) => {
                                          e.target.style.textDecoration = 'underline';
                                          e.target.style.color = 'blue';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.textDecoration = 'none';
                                          e.target.style.color = 'black';
                                        }}
                                      >
                                        Đánh giá
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    style={{ color: "black" }}
                                  >
                                    Phân loại hàng: {product.color}, {product.size}
                                  </Typography>
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" style={{ color: "black", fontSize: "14px" }}>
                                      Số lượng: {product.productQuantity}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      style={{
                                        color: "#ee4d2d",
                                        fontSize: "16px",
                                        position: "relative",
                                        display: "inline-block",
                                        marginLeft: "690px",
                                      }}
                                    >
                                      {new Intl.NumberFormat("vi-VN").format(product.productPrice)}đ
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Không có sản phẩm nào trong đơn hàng.
                        </Typography>
                      )}
                      <section
                        style={{
                          border: "none" /* No default border */,
                          borderTop:
                            "2px dashed rgba(128, 128, 128, 0.4)" /* Light gray, semi-transparent dashed line */,
                          margin: "10px 0" /* Optional spacing */,
                          marginTop: "-10px",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          style={{
                            marginRight: "15px",
                          }}
                        >
                          Tổng tiền:
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            color: "#ee4d2d",
                            fontSize: "20px",
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            marginRight: "10px"
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(order.amount)}đ
                        </Typography>
                      </div>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        {order.statusSlug === "dang-xu-ly" ? (
                          <MuiButton
                            variant="contained"
                            onClick={() => handleOpenCancelModal(order.id)}
                            style={{ marginRight: "10px", backgroundColor: "red", color: "white" }}
                          >
                            Hủy đơn
                          </MuiButton>
                        ) : order.statusSlug === "da-giao" ? (
                          <>
                            <MuiButton
                              variant="contained"
                              onClick={() => handleStatusComplete(order.id)}
                              style={{
                                marginRight: "10px",
                                backgroundColor: "green",
                                color: "white",
                              }}
                            >
                              Đã nhận được hàng
                            </MuiButton>
                            <MuiButton
                              variant="contained"
                              onClick={() => handleOpenReturnModal(order.id)}
                              style={{
                                backgroundColor: "orange",
                                color: "white",
                                marginRight: "10px",
                              }}
                            >
                              Yêu cầu trả hàng
                            </MuiButton>
                          </>
                        ) : order.statusSlug === "da-huy" || order.statusSlug === "hoan-thanh" ? (
                          <MuiButton
                            variant="contained"
                            onClick={() => fetchHandleBuyNow(order.id)}
                            style={{
                              marginRight: "10px",
                              backgroundColor: "#ee4d2d",
                              color: "white",
                            }}
                          >
                            Mua lại
                          </MuiButton>
                        ) : null}
                        {order.statusSlug === "da-huy" ? (
                          <MuiButton
                            variant="contained"
                            href={`/history-order/${order.id}`}
                            style={{
                              marginRight: "10px",
                              backgroundColor: "white",
                              color: "black",
                            }}
                          >
                            Xem chi tiết hủy đơn
                          </MuiButton>
                        ) : (
                          <MuiButton
                            variant="contained"
                            href={`/history-order/${order.id}`}
                            style={{
                              marginRight: "10px",
                              backgroundColor: "white",
                              color: "black",
                            }}
                          >
                            Xem chi tiết hóa đơn
                          </MuiButton>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
                <div className="col-12" style={{ marginTop: "-20px" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <button
                      className="pageItem"
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: currentPage === 1 ? "#e0e0e0" : "#FFD333",
                        border: "none",
                        borderRadius: "50%",
                        color: "black",
                        fontSize: "18px",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      <FiChevronLeft style={{ fontSize: "20px" }} />
                    </button>

                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        margin: "0 15px",
                        color: "#333",
                        textAlign: "center",
                        padding: "10px 10px",
                        backgroundColor: "#f7f7f7",
                        borderRadius: "25px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      Trang {currentPage} / {totalPages}
                    </span>

                    <button
                      className="pageItem"
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: currentPage === totalPages ? "#e0e0e0" : "#FFD333",
                        border: "none",
                        borderRadius: "50%",
                        color: "black",
                        fontSize: "18px",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      }}
                    >
                      <FiChevronRight style={{ fontSize: "20px" }} />
                    </button>
                  </Box>

                </div>
              </Grid>
            )}
          </Box>
        </ArgonBox>
        <MuiModal open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
          <Box
            p={3}
            style={{
              backgroundColor: "white",
              width: "300px",
              margin: "50px auto",
              borderRadius: "8px",
            }}
          >
            <ArgonTypography variant="h6">Chọn lý do hủy đơn hàng</ArgonTypography>
            <RadioGroup
              aria-label="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ marginTop: "15px" }}
            >
              {cancelOptions.map((option, index) => (
                <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
            <ArgonButton
              variant="contained"
              style={{ marginTop: "15px", backgroundColor: "red", color: "white" }}
              onClick={handleCancelOrder}
              disabled={!cancelReason}
            >
              Xác nhận hủy
            </ArgonButton>
          </Box>
        </MuiModal>

        <MuiModal open={openReturnModal} onClose={() => setOpenReturnModal(false)}>
          <Box
            p={3}
            style={{
              backgroundColor: "white",
              width: "500px",
              margin: "50px auto",
              borderRadius: "8px",
              marginTop: "90px",
            }}
          >
            <ArgonTypography variant="h6">Chọn lý do trả hàng</ArgonTypography>
            <RadioGroup
              aria-label="cancel-reason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}  // Ensure this sets the value correctly
              style={{ marginTop: "15px" }}
            >
              {returnOptions.map((option, index) => (
                <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>

            <ArgonButton
              variant="contained"
              style={{ marginTop: "15px", backgroundColor: "red", color: "white" }}
              onClick={handleReturnOrder}
              disabled={!returnReason}
            >
              Xác nhận trả hàng
            </ArgonButton>
          </Box>
        </MuiModal>

        {selectedProduct && (
          <BootstrapModal show={showReviewModal} size="lg" centered >
            <BootstrapModal.Body>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <p style={{ fontSize: "25px", margin: 0 }}>Đánh giá sản phẩm</p>
                <IconButton onClick={handleClose} style={{ color: "inherit" }}>
                  <CloseIcon />
                </IconButton>
              </div>
              {selectedProduct && (
                <>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  {(() => {
                      // Tìm hình ảnh khớp với productId và colorId
                      const matchingImage = images[selectedProduct.productId]?.find(
                        (image) => image.colorsDTO?.id === selectedProduct.colorId
                      ); 
                      return (
                        <img
                        src={matchingImage.imageDTOResponse[0]?.url}
                          alt={selectedProduct.productName || "Product Image"}
                          style={{
                            width: "80px",
                            height: "100px",
                            borderRadius: "5px",
                            marginRight: "10px",
                            border: "1px solid #ddd",
                          }}
                          onError={(e) => {
                            // Hiển thị ảnh mặc định nếu có lỗi khi tải ảnh
                            e.target.src =
                              "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
                          }}
                        />
                      );
                    })()}
                    <div>
                      <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>
                        {selectedProduct.productName}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", margin: "2px 0 0 0" }}>
                        <p style={{ color: "#888", margin: "0 15px 0 0", fontSize: "16px" }}>
                          Màu: <span style={{ color: "#555" }}>{selectedProduct.color}</span>
                        </p>
                        <p style={{ color: "#888", margin: "0", fontSize: "16px" }}>
                          Kích cỡ: <span style={{ color: "#555" }}>{selectedProduct.size}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmitAndAddReviewFile}>
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
                      <div style={{ marginRight: '5px' }}>
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                          multiple
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
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {imageFiles.map((file, index) => (
                          <div key={index} style={{ position: 'relative', marginRight: '3px' }}>
                            <img
                              src={URL.createObjectURL(file)} // Tạo URL tạm thời cho ảnh
                              alt={`Review ${index}`}
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                marginRight: '3px'
                              }}
                            />
                            {/* Icon Close chỉ hiển thị khi có ảnh */}
                            <IconButton
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '5px',
                                padding: '0',
                                color: '#fff',
                                fontSize: '15px',
                                backgroundColor: '#B8B8B8',
                              }}
                              onClick={() => handleRemoveImage(index)} // Xử lý xóa ảnh
                            >
                              <CloseIcon style={{ fontSize: '16px' }} />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginLeft: '1px' }}>
                        <input
                          type="file"
                          id="video-upload"
                          accept="video/*"
                          style={{ display: 'none' }}
                          onChange={handleVideoChange}
                        />
                        {videoFile ? (
                          <div style={{ position: 'relative', marginTop: '10px' }}>
                            <video
                              controls
                              src={URL.createObjectURL(videoFile)}
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
                            onClick={() => document.getElementById('video-upload').click()} // Tự động mở cửa sổ chọn file
                          >
                            <Videocam style={{ fontSize: '48px', color: 'black' }} />
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
                        onClick={handleSubmitAndAddReviewFile}
                        style={{
                          color: '#fff',
                          backgroundColor: '#FFD700',
                          borderColor: '#FFD700',
                          padding: '10px 20px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          borderRadius: '8px',
                          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#FFC107';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#FFD700';
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
      </div>
    </>
  );
};
export default indexHistory;