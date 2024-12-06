import React, { useEffect, useState, useRef } from "react";
import "layouts/assets/css/style.css";
import HasagiNav from "components/client/HasagiHeader";
import { useLocation } from "react-router-dom";
import Footer from "components/client/HasagiFooter";
import cartService from "../../../services/ProductDetail";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import reviewsService from "services/ReviewsServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import ReviewList from "../HasagiReview/reviewList";

function ShopDetail() {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const [sale, setSale] = useState(0);
  const query = new URLSearchParams(location.search);
  const productId = query.get("id");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [quantityPDT, setQuantityPDT] = useState(0);
  const [currentMedia, setCurrentMedia] = useState(0); // 0: Video, 1: Ảnh
  const [currentImage, setCurrentImage] = useState(""); // Ảnh hiện tại
  const [startIndex, setStartIndex] = useState(0);
  const videoRef = useRef(null); // Tham chiếu đến phần tử video
  const [mediaList, setMediaList] = useState([]);
  const maxVisibleImages = product?.video ? 3 : 4;
  const [previousImage, setPreviousImage] = useState(); // Lưu lại hình ảnh trước khi hover
  const [previousCurrentMedia, setPreviousCurrentMedia] = useState(); // Lưu lại hình ảnh trước khi hover
  const [images, setImages] = useState([]);

  const fetchReviews = async (productId) => {
    try {
      const productReviews = await reviewsService.getReviewsByProduct(productId);
      if (Array.isArray(productReviews)) {
        const sortedReviews = productReviews.sort((a, b) => b.star - a.star);
        setReviews(sortedReviews);
      } else {
        console.error("Expected an array but got:", productReviews);
        setReviews([]);
      }
    } catch (error) {
      setReviews([]);
    }
  };

  const calculateAverageStars = () => {
    if (reviews.length === 0) return 0;

    const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
    return (totalStars / reviews.length).toFixed(1);
  };

  const averageStars = calculateAverageStars();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const productId = query.get("id");

    if (productId) {
      fetchReviews(productId);
    }
  }, [location]);

  const getUniqueSizes = (sizes) => {
    return sizes?.reduce((unique, size) => {
      if (!unique?.some((item) => item.id === size.id)) {
        unique?.push(size);
      }
      return unique;
    }, []);
  };

  const getUniqueColors = (colors) => {
    return colors?.reduce((unique, color) => {
      if (!unique?.some((item) => item.id === color.id)) {
        unique?.push(color);
      }
      return unique;
    }, []);
  };

  const uniqueSizes = product ? getUniqueSizes(product.sizes) : [];
  const uniqueColors = product ? getUniqueColors(product.colors) : [];

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);

  const handleAddToCart = async () => {
    try {
      // Kiểm tra nếu chưa chọn màu hoặc kích thước
      if (!selectedColor || !selectedSize) {
        toast.error("Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.");
        return;
      }

      // Gọi API để thêm sản phẩm vào giỏ hàng
      const response = await cartService.addToCart({
        colorId: selectedColor,
        sizeId: selectedSize,
        quantity,
        productId,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Sản phẩm đã được thêm vào giỏ hàng thành công!");
      }
    } catch (error) {
      // Log lỗi nếu có
      setError(error.response?.data || "Đã có lỗi xảy ra. Vui lòng thử lại!");
    }
  };


  const fetchProductDetail = async () => {
    try {
      if (!productId) throw new Error("Product ID is missing");
      localStorage.clear();
      const response = await cartService.getProductDetail({
        productId,
        sizeId: selectedSize || null,
        colorId: selectedColor || null,
      });

      const productData = response.data;
      //console.log("Fetched Product Data:", productData);
      setSale(productData.sale);
      setProduct(productData);
      setMediaList(productData);
      if (selectedColor && selectedSize) {
        fetchPrice(productId, selectedColor, selectedSize);
      } else {
        setTotalPrice(productData?.importPrice);
        setQuantityPDT(productData?.importQuantity);
      }
      //console.log("Total Price Set To:", productData.importPrice);

    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/public/webShopDetail/product-detail/${productId}`
        );
        const data = response.data;

        // Nếu tồn tại productDetail, lấy danh sách imageDTOResponse
        if (data) {
          setImages(data);
        } else {
          console.error("Product detail not found or no images available");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
    setError("");
  }, [productId, selectedSize, selectedColor]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchPrice = async (productId, colorId, sizeId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/public/webShopDetail/price`, {
        params: { productId, colorId, sizeId },
      });
      const { price, quantity } = response.data;
      setTotalPrice(price);
      setQuantityPDT(quantity);
    } catch (error) {
      console.error("Error fetching price:", error);
      toast.error("Đã xảy ra lỗi khi lấy giá sản phẩm. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    if (selectedColor && selectedSize) {
      fetchPrice(productId, selectedColor, selectedSize);
    }
    if (!selectedColor) {
      fetchProductDetail();
    }
  }, [selectedColor, selectedSize, quantity]);



  const handleByNow = async () => {
    try {
      // Kiểm tra nếu chưa chọn màu hoặc kích thước
      if (!selectedColor || !selectedSize) {
        toast.error("Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.");
        return;
      }

      const response = await cartService.addToCart({
        colorId: selectedColor,
        sizeId: selectedSize,
        quantity,
        productId,
      });

      // Kiểm tra phản hồi từ server để quyết định hiển thị thông báo
      if (response.status >= 200 && response.status < 300) {
        const checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || [];
        if (!checkedItems.includes(productId)) {
          checkedItems.push(productId);
        }
        localStorage.setItem(
          "checkedItems" + productId + selectedColor + selectedSize,
          JSON.stringify([Number(checkedItems), selectedColor, selectedSize])
        );
      }

      navigate("/Cart");
    } catch (error) {
      setError(error.response?.data || "Đã có lỗi xảy ra. Vui lòng thử lại!");
    }
  };


  const [activeTab, setActiveTab] = useState("tab-pane-1");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const formatImportPrice = (importPrice) => {
    if (typeof importPrice === "number") {
      const finalPrice = sale > 0 ? importPrice * (1 - sale / 100) : importPrice;
      return new Intl.NumberFormat("vi-VN").format(finalPrice);
    }

    if (!importPrice || typeof importPrice !== "string" || !importPrice.includes("-")) {
      return "N/A";
    }

    const [minPrice, maxPrice] = importPrice.split("-").map((price) => parseFloat(price));
    const discountedMinPrice = sale > 0 ? minPrice * (1 - sale / 100) : minPrice;
    const discountedMaxPrice = sale > 0 ? maxPrice * (1 - sale / 100) : maxPrice;

    return discountedMinPrice === discountedMaxPrice
      ? `${new Intl.NumberFormat("vi-VN").format(discountedMinPrice)}`
      : `${new Intl.NumberFormat("vi-VN").format(discountedMinPrice)}đ - ${new Intl.NumberFormat(
        "vi-VN"
      ).format(discountedMaxPrice)}`;
  };

  const formatOriginalPrice = (importPrice) => {
    if (typeof importPrice === "number") {
      return new Intl.NumberFormat("vi-VN").format(importPrice);
    }

    if (!importPrice || typeof importPrice !== "string" || !importPrice.includes("-")) {
      return "N/A";
    }

    const [minPrice, maxPrice] = importPrice.split("-").map((price) => parseFloat(price));

    return minPrice === maxPrice
      ? `${new Intl.NumberFormat("vi-VN").format(minPrice)}`
      : `${new Intl.NumberFormat("vi-VN").format(minPrice)} - ${new Intl.NumberFormat("vi-VN").format(maxPrice)}`;
  };

  const formattedPrice = formatImportPrice(totalPrice);

  const renderStars = (average) => {
    const fullStars = Math.floor(average);
    const partialStar = average % 1;
    const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

    return (
      <div style={{ display: "flex", gap: "5px" }}>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FontAwesomeIcon
            key={`full-${index}`}
            icon={solidStar}
            style={{ color: "orange", fontSize: "12px" }}
          />
        ))}

        {partialStar > 0 && (
          <div style={{ position: "relative", width: "24px", overflow: "hidden" }}>
            <FontAwesomeIcon
              icon={regularStar}
              style={{
                color: "#ccc",
                fontSize: "20px",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                clipPath: `inset(0 ${100 - partialStar * 100}% 0 0)`,
              }}
            >
              <FontAwesomeIcon
                icon={solidStar}
                style={{
                  color: "orange",
                  fontSize: "20px",
                  width: "100%",
                  height: "100%",
                  marginBottom: "8px",
                }}
              />
            </div>
          </div>
        )}

        {Array.from({ length: emptyStars }).map((_, index) => (
          <FontAwesomeIcon
            key={`empty-${index}`}
            icon={regularStar}
            style={{ color: "orange", fontSize: "11px" }}
          />
        ))}
      </div>
    );
  };

  // Hàm formatNumber để định dạng số
  const formatNumber = (number) => {
    if (number >= 1000) {
      const formatted = (number / 1000).toFixed(1); // Chia cho 1000 và giữ 1 chữ số thập phân
      return `${formatted}k`.replace(".", ","); // Thay dấu "." thành dấu ","
    }
    return number; // Trả về số gốc nếu nhỏ hơn 1000
  };

  useEffect(() => {
    // Dừng video khi rời khỏi trang
    const handleBeforeUnload = () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Dọn dẹp event khi component bị unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Hàm xử lý khi click vào thumbnail
  const handleThumbnailClick = (imageURL, index) => {
    setCurrentImage(imageURL);
    setCurrentMedia(index);
  };

  // Hàm xử lý hover lên thumbnail
  const handleThumbnailHover = (imageURL, index) => {
    setCurrentImage(imageURL);
    setCurrentMedia(index); // Cập nhật trạng thái media khi hover
  };

  const handleButtonlHover = (imageUrl, index) => {
    setPreviousImage(currentImage); // Lưu lại hình ảnh hiện tại trước khi thay đổi
    setPreviousCurrentMedia(currentMedia);
    setCurrentImage(imageUrl); // Cập nhật hình ảnh mới khi hover
    setCurrentMedia(index); // Cập nhật trạng thái media khi hover
  };

  const handleButtonLeave = () => {
    setCurrentImage(previousImage); // Trả lại hình ảnh cũ khi bỏ hover
    setCurrentMedia(previousCurrentMedia);
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1); // Giảm startIndex khi nhấn nút Prev
    }
  };

  const handleNext = () => {
    if (startIndex + maxVisibleImages < uniqueColors.length) {
      setStartIndex(startIndex + 1); // Tăng startIndex khi nhấn nút Next
    }
  };

  useEffect(() => {
    const preloadNextAndPrev = () => {
      if (uniqueColors.length > 0) {
        const nextColorIndex = (startIndex + 1) % uniqueColors.length;
        const nextColorId = uniqueColors[nextColorIndex]?.id;

        const nextImages = images.filter((image) => image?.colorsDTO?.id === nextColorId);

        nextImages?.slice(0, 3).forEach((image) => {
          const img = new Image();
          img.src = image?.imageDTOResponse[0]?.url;
        });

        const prevColorIndex = (startIndex - 1 + uniqueColors.length) % uniqueColors.length;
        const prevColorId = uniqueColors[prevColorIndex]?.id;

        const prevImages = images.filter((image) => image?.colorsDTO?.id === prevColorId);

        prevImages?.slice(0, 3).forEach((image) => {
          const img = new Image();
          img.src = image?.imageDTOResponse[0]?.url;
        });
      }
    };

    preloadNextAndPrev();
  }, [startIndex, uniqueColors, images]);

  const thumbnailWidth = 92.3;
  const thumbnailGap = 10;
  const thumbnailOffset = -(startIndex * (thumbnailWidth + thumbnailGap));

  useEffect(() => {
    if (product?.video) {
      // Nếu có video, sử dụng currentImage
      setCurrentImage(currentImage); // Giữ nguyên currentImage nếu có video
    } else {
      // Nếu không có video, đặt currentImage bằng product.image
      setCurrentImage(product?.image);
    }
  }, [product?.video, product?.image]); // Phụ thuộc vào product.video và product.image

  if (!product) return <div></div>;

  return (
    <>
      {isLoading && (
        <div className="loader">
          <div className="loader-inner">
            <div className="circle"></div>
          </div>
        </div>
      )}
      <HasagiNav />
      <ToastContainer />
      <div className="container-fluid">
        <div
          className="row px-xl-5"
          style={{
            marginLeft: "55px",
            fontSize: "15px",
            paddingTop: "105px",
            marginBottom: "-10px",
          }}
        >
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <a className="breadcrumb-item text-dark" href="/feature-section">
                Trang chủ
              </a>
              <a className="breadcrumb-item text-dark" href="/Shop">
                Sản phẩm
              </a>
              <span className="breadcrumb-item active">{product.name}</span>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid pb-5" style={{ maxWidth: "1400px" }}>
        <div className="row px-xl-5" style={{ marginLeft: "10px", height: "700px" }}>
          <div className="col-lg-5 mb-30 bg-white">
            <div className="product-thumbnail" style={{ textAlign: "center" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "500px",
                }}
              >
                {/* Video của Product */}
                {product.video && (
                  <video
                    ref={videoRef}
                    src={product.video}
                    autoPlay
                    muted
                    controls
                    loop={false} // Không lặp
                    style={{
                      width: "100%",
                      maxHeight: "500px",
                      marginTop: "15px",
                      objectFit: "contain",
                      position: "absolute",
                      backgroundColor: "#f5f5f5",
                      aspectRatio: "9 / 16",
                      top: 0,
                      left: 0,
                      opacity: currentMedia === 0 ? 1 : 0, // Hiệu ứng mờ khi video biến mất
                      zIndex: currentMedia === 0 ? 2 : 1, // Video nằm trên khi hiển thị
                      transition: "opacity 0.5s ease-in-out", // Thêm hiệu ứng chuyển mờ
                    }}
                  />
                )}

                {/* Ảnh của Product */}
                <img
                  src={currentImage}
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    marginTop: "15px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    position: "absolute",
                    objectFit: "contain", // Đảm bảo ảnh vừa với khung
                    aspectRatio: "9 / 16",
                    backgroundColor: "#f5f5f5",
                    top: 0,
                    left: 0,
                    zIndex: !product.video || currentMedia === 1 ? 2 : 1,
                    transition: "opacity 0.5s ease-in-out", // Thêm hiệu ứng chuyển mờ
                  }}
                />
              </div>

              {/* Nút điều hướng bên trái */}
              {uniqueColors?.length > maxVisibleImages && (
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "85.55%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "0%",
                    height: "45px",
                    width: "30px",
                    zIndex: 1,
                    userSelect: "none",
                  }}
                  disabled={startIndex === 0}
                  onClick={() => handlePrev()}
                >
                  ←
                </div>
              )}
              {/* Thumbnail Gallery */}
              <div
                style={{
                  position: "relative",
                  width: "510px",
                  height: "86px",
                  overflow: "hidden",
                  top: "530px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    left: "12px",
                    right: "0",
                    transition: "transform 0.5s ease",
                    transform: `translateX(${thumbnailOffset}px)`,
                  }}
                >
                  {/* Phần hiển thị cho các ảnh video của product */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* Nút phát video nếu tồn tại */}
                    {product.video && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "47px",
                          transform: "translate(-50%, -50%)",
                          width: "35px",
                          height: "35px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleThumbnailClick(product.video, 0)} // Click video thumbnail của product
                      >
                        <div
                          style={{
                            width: "0",
                            height: "0",
                            borderLeft: "10px solid #fff",
                            borderTop: "6px solid transparent",
                            borderBottom: "6px solid transparent",
                          }}
                        ></div>
                      </div>
                    )}

                    {/* Thumbnail video của product */}
                    {product.video && (
                      <video
                        src={product.video}
                        muted
                        autoPlay={false}
                        style={{
                          width: "92.3px",
                          height: "86px",
                          cursor: "pointer",
                          border:
                            currentMedia === 0 ? "2px solid #ffb524" : "1px solid transparent",
                        }}
                        onClick={() => handleThumbnailClick(product.video, 0)} // Click vào video thumbnail
                        onMouseEnter={() => handleThumbnailHover(product.video, 0)} // Hover video thumbnail
                      />
                    )}
                    {/* Thumbnail ảnh của product */}
                    {product.image && (
                      <div
                        style={{
                          width: "92.3px",
                          height: "86px",
                          cursor: "pointer",
                          border:
                            (!product.video && currentMedia === 0) || currentMedia === 1
                              ? "2px solid #ffb524"
                              : "1px solid transparent",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxSizing: "border-box",
                        }}
                        onClick={() => handleThumbnailClick(product.image, 1)} // Click vào ảnh thumbnail
                        onMouseEnter={() => handleThumbnailHover(product.image, 1)} // Hover ảnh thumbnail
                      >
                        <img
                          src={product.image}
                          alt="Product Thumbnail"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Phần hiển thị cho các ảnh của productDetail */}
                  {uniqueColors.map((color, idx) => {
                    const matchingImages = images?.find(
                      (image) => image?.colorsDTO?.id === color?.id
                    );

                    return (
                      <div key={color?.id}>
                        {matchingImages && (
                          <div
                            style={{
                              width: "92.3px",
                              height: "130px",
                              cursor: "pointer",
                              border:
                                currentImage === matchingImages?.imageDTOResponse[0]?.url
                                  ? "2px solid #ffb524"
                                  : "1px solid transparent",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onClick={() =>
                              handleThumbnailClick(matchingImages?.imageDTOResponse[0]?.url)
                            }
                            onMouseEnter={() =>
                              handleThumbnailHover(matchingImages?.imageDTOResponse[0]?.url)
                            }
                          >
                            <img
                              src={matchingImages?.imageDTOResponse[0]?.url}
                              alt={`Thumbnail ${idx}`}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Nút điều hướng bên phải */}
              {uniqueColors?.length > maxVisibleImages && (
                <div
                  style={{
                    position: "absolute",
                    right: "21px",
                    top: "85.55%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "0%",
                    height: "45px",
                    width: "30px",
                    userSelect: "none",
                  }}
                  disabled={startIndex + maxVisibleImages >= images.length}
                  onClick={() => handleNext()}
                >
                  →
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-7 mb-30" style={{ marginLeft: "-15px" }}>
            <div
              className="h-100 bg-white pt-3 "
              style={{
                paddingLeft: "20px", // padding trái
                paddingRight: "20px", // padding phải
              }}
            >
              <h4
                className="mb-2"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "20px",
                  lineHeight: 1.5,
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {product.name}
              </h4>

              <div
                className="d-flex align-items-center mb-3"
                style={{ fontSize: "17px", color: "#555" }}
              >
                {/* Phần hiển thị số sao và sao */}
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <span
                    style={{
                      color: "#555",
                      textDecoration: "underline",
                      textUnderlineOffset: "5px",
                      fontSize: "14px", // Đảm bảo kích thước văn bản không quá lớn
                      lineHeight: "1", // Giữ nội dung cân đối
                    }}
                  >
                    {averageStars} {/* Hiển thị 1 số thập phân */}
                  </span>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    {renderStars(averageStars)}
                  </div>
                </div>


                {/* Đường phân cách */}
                <div
                  style={{
                    height: "16px",
                    width: "1px",
                    backgroundColor: "#ddd",
                    margin: "0 10px",
                  }}
                />

                {/* Phần hiển thị số lượng đánh giá */}
                <div className="d-flex align-items-center">
                  <span
                    style={{
                      marginRight: "3px",
                      textDecoration: "underline",
                      textUnderlineOffset: "5px",
                    }}
                  >
                    {formatNumber(reviews.length)}
                  </span>
                  <small style={{ color: "#888" }}>Đánh Giá</small>
                </div>
              </div>

              <h6
                className="mb-3"
                style={{
                  fontFamily: "Arial, sans-serif",
                  color: "red",  // Màu đỏ cho giá đã giảm
                  fontSize: "30px",
                  fontWeight: "bold",
                  position: "relative",
                  display: "inline-block",
                  marginLeft: "15px",
                }}
              >
                {formattedPrice}đ  {/* Giá đã giảm */}
              </h6>

              {(sale > 0) && (
                <>
                  <h6
                    className="mb-3"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      color: "#999", // Màu xám cho giá gốc
                      fontSize: "20px", // Giảm kích thước font
                      fontWeight: "bold",
                      textDecoration: "line-through", // Gạch ngang giá gốc
                      position: "relative",
                      display: "inline-block",
                      marginLeft: "10px", // Giảm khoảng cách
                    }}
                  >
                    {formatOriginalPrice(totalPrice)}đ
                  </h6>

                  <h6
                    className="mb-3"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      color: "red", // Màu đỏ cho tỷ lệ giảm giá
                      fontSize: "16px", // Giảm kích thước font
                      fontWeight: "bold",
                      position: "relative",
                      display: "inline-block",
                      marginLeft: "10px", // Giảm khoảng cách
                      backgroundColor: "#f8d7da", // Nền màu hồng nhạt cho phần giảm giá
                      padding: "3px 8px", // Giảm kích thước padding
                      borderRadius: "5px",
                    }}
                  >
                    -{sale}% {/* Hiển thị tỷ lệ giảm giá */}
                  </h6>
                </>
              )}


              <div className="mb-4 mt-2" id="color-input-list">
                <div className="row">
                  <div className="col-2">
                    {product?.colors?.length > 0 && (
                      <span className="text-dark mr-3" style={{ fontSize: "17px" }}>
                        Màu
                      </span>
                    )}
                  </div>
                  <div className="col-9" style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {product?.colors?.length > 0 && (
                      <div>
                        {uniqueColors?.map((color) => {
                          // Tìm ảnh tương ứng với màu trong images
                          const matchingImage = images?.find(
                            (image) => image?.colorsDTO?.id === color?.id
                          );

                          return (
                            <button
                              key={color.id}
                              className={`variant-button ${selectedColor === color.id ? "selected" : ""
                                } ${!color.check ? "disabled" : ""}`}
                              onClick={() => {
                                setSelectedColor((prevSelected) => {
                                  const newSelectedColor =
                                    prevSelected === color.id ? null : color.id;
                                  setQuantity(1);
                                  if (matchingImage) {
                                    setCurrentImage(matchingImage?.imageDTOResponse[0]?.url);
                                    setPreviousImage(matchingImage?.imageDTOResponse[0]?.url); // Cập nhật hình ảnh cũ khi chọn
                                    setCurrentMedia(color.name);
                                    setPreviousCurrentMedia(color.name);
                                  }
                                  return newSelectedColor;
                                });
                              }}
                              onMouseEnter={() =>
                                handleButtonlHover(
                                  matchingImage?.imageDTOResponse[0]?.url,
                                  color.name
                                )
                              }
                              onMouseLeave={!color.check ? null : handleButtonLeave} // Trả lại hình ảnh cũ khi bỏ hover
                              style={{
                                marginRight: "10px",
                                cursor: !color.check ? "not-allowed" : "pointer",
                                opacity: !color.check ? 0.5 : 1,
                                marginBottom: "10px",
                              }}
                              disabled={!color.check}
                            >
                              {/* Ảnh nhỏ trước tên màu */}
                              {matchingImage && (
                                <img
                                  key={matchingImage?.colorsDTO?.id}
                                  src={matchingImage?.imageDTOResponse[0]?.url}
                                  alt={color.name}
                                  style={{
                                    width: "25px", // Kích thước ảnh nhỏ
                                    height: "25px", // Kích thước ảnh nhỏ
                                    marginRight: "10px", // Khoảng cách giữa ảnh và tên màu
                                  }}
                                />
                              )}

                              {/* Tên màu */}
                              {color.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4" id="size-input-list">
                <div className="row">
                  <div className="col-3">
                    {product?.sizes?.length > 0 && (
                      <span className="text-dark mr-3" style={{ fontSize: "17px" }}>
                        Kích thước
                      </span>
                    )}
                  </div>
                  <div
                    className="col-9"
                    style={{ marginLeft: "-100px", maxHeight: "150px", overflowY: "auto" }}
                  >
                    {product?.sizes?.length > 0 && (
                      <div style={{ marginLeft: "40px" }}>
                        {uniqueSizes?.map((size) => (
                          <button
                            key={size.id}
                            className={`variant-button ${selectedSize === size.id ? "selected" : ""
                              } ${!size.check ? "disabled" : ""}`}
                            onClick={() => {
                              setSelectedSize((prevSelected) => {
                                const newSelectedSize = prevSelected === size.id ? null : size.id;
                                setQuantity(1);
                                return newSelectedSize;
                              });
                            }}
                            style={{
                              marginRight: "10px",
                              cursor: !size.check ? "not-allowed" : "pointer",
                              opacity: !size.check ? 0.5 : 1,
                              marginBottom: "10px",
                            }}
                            disabled={!size.check}
                          >
                            {size.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="align-items-center mb-4 pt-1">
                <div className="row">
                  <div className="col-2">
                    <span className="text-dark" style={{ fontSize: "17px" }}>
                      Số lượng
                    </span>
                  </div>
                  <div className="col-10">
                    <div className="input-group quantity mr-3">
                      <div className="input-group-btn">
                        <button
                          className="btn btn-primary btn-minus"
                          onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                          style={{
                            borderRadius: "0px",
                            backgroundColor: "#ffb524",
                            marginRight: "1px",
                            boxShadow: "none",
                          }}
                          disabled={!selectedColor || !selectedSize}
                        >
                          <i className="fa fa-minus"></i>
                        </button>
                      </div>
                      <input
                        id="inputAmount"
                        type="text"
                        className="form-control bg-white text-center"
                        value={quantity}
                        onBlur={(e) => {
                          if (e.target.value === "" || !selectedColor || !selectedSize) {
                            setQuantity(1);
                          }
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          setQuantity(Math.min(Math.max(e.target.value, 1), quantityPDT));
                        }}
                        style={{
                          boxShadow: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          borderTop: "1px solid #ffb524",
                          borderBottom: "1px solid #ffb524",
                          height: "35.22px",
                          maxWidth: "100px",
                          top: "0.699px",
                        }}
                        disabled={!selectedColor || !selectedSize}
                      />
                      <div className="input-group-btn">
                        <button
                          className="btn btn-primary btn-plus"
                          onClick={() => setQuantity(Math.min(quantity + 1, quantityPDT))}
                          style={{
                            backgroundColor: "#ffb524",
                            borderRadius: "0px",
                            marginLeft: "1px",
                            boxShadow: "none",
                          }}
                          disabled={!selectedColor || !selectedSize}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                      <span
                        style={{
                          fontFamily: "Arial, sans-serif",
                          alignSelf: "center",
                          fontSize: "15px",
                          color: "#777",
                          marginLeft: "10px",
                        }}
                      >
                        {quantityPDT} sản phẩm có sẵn
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {error && <p style={{ fontSize: "14px", color: "red" }}>{error}</p>}
              <div className="d-flex align-items-center py-1">
                <button
                  id="cartBtn"
                  onClick={handleAddToCart}
                  className="btn btn-warning px-3 mr-2"
                >
                  <i className="fa fa-shopping-cart mr-1"></i> Thêm vào giỏ hàng
                </button>
                <button className="btn btn-warning px-3" onClick={handleByNow}>
                  Mua ngay
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <div className="bg-light" style={{ marginBottom: "-50px" }}>
              <div className="nav nav-tabs mb-4">
                <a
                  className={`nav-item nav-link text-dark ${activeTab === "tab-pane-1" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("tab-pane-1")}
                >
                  Chi tiết sản phẩm
                </a>
                <a
                  className={`nav-item nav-link text-dark ${activeTab === "tab-pane-2" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("tab-pane-2")}
                >
                  Mô tả sản phẩm
                </a>
                <a
                  className={`nav-item nav-link text-dark ${activeTab === "tab-pane-3" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("tab-pane-3")}
                >
                  Đánh giá ({reviews.length})
                </a>
              </div>
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${activeTab === "tab-pane-1" ? "show active" : ""}`}
                  id="tab-pane-1"
                >
                  <p>Danh mục: {product.category}</p>
                  <p>Kho: {product.importQuantity || "N/A"}</p>
                  <p>Thương hiệu: {product.trademark}</p>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "tab-pane-2" ? "show active" : ""}`}
                  id="tab-pane-2"
                >
                  <p>{product.description}</p>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "tab-pane-3" ? "show active" : ""}`}
                  id="tab-pane-3"
                >
                  <ReviewList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ShopDetail;