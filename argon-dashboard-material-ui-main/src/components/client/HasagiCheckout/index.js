import React, { useState, useEffect } from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import aboutImage5 from "layouts/assets/img/cod.png";
import aboutImage6 from "layouts/assets/img/vnpay.png";
import aboutImage7 from "layouts/assets/img/payos.png";
import aboutImage8 from "layouts/assets/img/puches1.png";
import axios from "axios";
import AddressSelection from "components/client/HasagiBackup/index1";
import Swal from "sweetalert2";
import CheckoutService from "../../../services/CheckoutServices";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VoucherService from "services/VoucherServices";
import { ToastContainer, toast } from "react-toastify";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Container, Card, Dropdown } from "react-bootstrap";
import ArgonInput from "../../../components/ArgonInput";
import ArgonBox from "../../../components/ArgonBox";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import ArgonButton from "components/ArgonButton";
import PaymentService from "services/PaymentServices";

const Checkout = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [images, setImages] = useState([]);
  const paymentMethods = [
    { name: "COD", image: aboutImage5, nameView: "COD (Tiền mặt)" },
    { name: "VNPay", image: aboutImage6, nameView: "VNPay" },
    { name: "PayOs", image: aboutImage7, nameView: "PayOs" },
  ];
  const [vouchers, setVouchers] = useState([]);
  const [accountId] = useState(Cookies.get("accountId"));
  const [usedVouchers, setUsedVouchers] = useState([]);

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const query = new URLSearchParams(location.search);
  const addressId = query.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [shipFee, setShipFee] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState(null);
  const clos = useState(Swal.close);

  useEffect(() => {
    return () => {
      clos;
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);

    const fetchAddress = async () => {
      try {
        const addressesId = new URLSearchParams(window.location.search).get("id");
        if (addressesId) {
          const response = await axios.get(`http://localhost:3000/api/addresses/${addressesId}`);
          setAddress(response.data);
          console.log(response.data);

          await fetchProvinces();
        } else {
          console.error("No address ID found in the URL");
        }
        const cartItemsBackup = JSON.parse(localStorage.getItem("cartItemsBackup")) || [];
        setCartItems(cartItemsBackup);
        if (cartItemsBackup.length > 0) {
          const imageRequests = cartItemsBackup.map((item) =>
            axios
              .get(
                `http://localhost:3000/api/public/webShopDetail/product-detail/${item.productId}`
              )
              .then((res) => ({ productId: item.productId, data: res.data }))
          );
          const imagesData = await Promise.all(imageRequests);
          const imagesMap = imagesData.reduce((acc, { productId, data }) => {
            acc[productId] = data;
            return acc;
          }, {});
          setImages(imagesMap);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/addresses/${addressId}`, {
          withCredentials: true,
        });
        if (response.data && response.data.districtCode) {
          setAddress(response.data);
        } else {
          console.error("District code is missing in the address data");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    if (addressId) {
      fetchAddress();
    }
  }, [addressId]);

  useEffect(() => {
    if (address && address.provinceID) {
      fetchDistricts(address.provinceID);
    }
  }, [address]);

  useEffect(() => {
    if (address && address.districtCode) {
      fetchWards(address.districtCode);
    }
  }, [address]);

  useEffect(() => {
    if (address && address.districtCode) {
      fetchShipFee();
    }
  }, [address]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
        }
      );
      setProvinces(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchShipFee = async () => {
    const XuanKhanhDistrictID = 1572;
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          headers: {
            Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d",
          },
          params: {
            from_district_id: XuanKhanhDistrictID,
            from_ward_code: "550113",
            to_district_id: address.districtCode,
            to_ward_code: address.wardCode,
            weight: 1000,
            length: 10,
            width: 10,
            height: 10,
            service_id: 0,
            service_type_id: 2,
            coupon_code: "",
          },
        }
      );
      setShipFee(response.data.data);
    } catch (error) { }
  };

  useEffect(() => {
    if (address && address.districtCode && address.wardCode) {
      fetchShipFee();
    }
  }, [address]);

  useEffect(() => {
    fetchShipFee();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
          params: { province_id: provinceId },
        }
      );
      setDistricts(response.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        {
          headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
          params: { district_id: districtId },
        }
      );
      setWards(response.data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleAddressChange = (selectedAddress) => {
    setAddress(selectedAddress);
    setShowBackup(false);
  };
  const handleAddressModalClose = (newAddressId) => {
    if (newAddressId) {
      setSelectedAddress(newAddressId);
    }
    setShowModal(false);
  };

  const getAddressNameById = (id, list, type) => {
    const addressItem = list.find((item) => {
      if (type === "province" && item.ProvinceID === Number(id)) return true;
      if (type === "district" && item.DistrictID === Number(id)) return true;
      if (type === "ward" && item.WardCode === String(id)) return true;
      return false;
    });
    if (addressItem) {
      if (type === "province") return addressItem.ProvinceName;
      if (type === "district") return addressItem.DistrictName;
      if (type === "ward") return addressItem.WardName;
    }
    return "Unknown";
  };

  const handleRemoveItems = async () => {
    const cartItemsBackup = JSON.parse(localStorage.getItem("cartItemsBackup")) || [];
    const selectedItemIds = cartItemsBackup
      .filter((item) => item.selected)
      .map((item) => item.cartdetailid);
    if (selectedItemIds.length === 0) {
      console.error("No items selected for removal");
      return;
    }
    try {
      const response = await axios.delete("http://localhost:3000/api/cart/delete", {
        data: selectedItemIds,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const updatedCartItems = cartItemsBackup.filter(
          (item) => !selectedItemIds.includes(item.cartdetailid)
        );
        localStorage.setItem("cartItemsBackup", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
      } else {
        console.error("Failed to delete items:", response.data);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const handleClick = async () => {
    document.body.style.overflowY = "auto";
    const selectedItems = cartItems.filter((item) => item.selected);
    if (!selectedMethod) {
      toast.warn("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    const addressDTO = {
      fullNameAddress: address.fullNameAddress,
      numberPhone: address.numberPhone,
      address: address.address,
      provinceID: address.provinceID,
      districtCode: address.districtCode,
      wardCode: address.wardCode,
      fullName: address.fullName,
    };

    const cartDetailsDTO = selectedItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const productDetailIdSelected = selectedItems.map((item) => item.id);
    const voucherId = selectedVoucher ? selectedVoucher.id : null;
    const payStatus = selectedMethod === "COD" ? "Chưa thanh toán" : "COMPLETED";

    const checkoutData = {
      addressDTO,
      cartDetails: cartDetailsDTO,
      payMethod: selectedMethod,
      payStatus: payStatus,
      voucherId: voucherId,
      shippingFree: shipFee.total,
      fullName: `${address.address}, ${getAddressNameById(
        address.wardCode,
        wards,
        "ward"
      )}, ${getAddressNameById(address.districtCode, districts, "district")}, ${getAddressNameById(
        address.provinceID,
        provinces,
        "province"
      )}`,
      productDetailIdSelected: productDetailIdSelected,
    };
    try {
      let response;
      if (selectedMethod === "COD") {
        response = await CheckoutService.postCheckout(addressId, checkoutData);
        if (response.status === 200) {
          localStorage.setItem("address1", JSON.stringify(addressDTO));
          localStorage.setItem("orderDetails1", JSON.stringify(cartDetailsDTO));
          Cookies.set("selectedPayment", "COD");
          const swal = Swal.fire({
            title: "Đang xử lý...",
            width: 500,
            padding: "1em",
            color: "white",
            background: "transparent",
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
              popup: "custom-popup",
            },
            didOpen: () => {
              document.body.style.padding = "0";
              const popup = document.querySelector(".swal2-popup");
              popup.style.overflow = "hidden";
            },
          });
          setTimeout(() => {
            swal.close();
            navigate("/Complete", {
              state: {
                address: addressDTO,
                orderDetails: cartDetailsDTO,
              },
            });
            handleRemoveItems();
          }, 2000);
        } else {
          throw new Error("Failed to place order");
        }
      } else if (selectedMethod === "VNPay") {
        response = await CheckoutService.postCheckout(addressId, checkoutData);
        if (response.data.paymentUrl) {
          localStorage.setItem("address1", JSON.stringify(addressDTO));
          localStorage.setItem("orderDetails1", JSON.stringify(cartDetailsDTO));
          Cookies.set("addressId", address.id);
          window.location.href = response.data.paymentUrl;
        } else {
          throw new Error("Payment processing error with VNPAY");
        }
      } else {
        try {
          const customPaymentData = {
            items: selectedItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            description: "Thanh toán",
            shippingFee: shipFee.total,
          };

          try {
            const response = await PaymentService.PaymentMethods(customPaymentData);

            if (response) {
              console.log("Payment URL:", response);
              window.location.href = response;
            } else {
              console.error("Payment URL is undefined");
              Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể tạo liên kết thanh toán 1.",
              });
            }
          } catch (error) {
            console.error("Error during payment processing:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: error.message || "Có lỗi xảy ra khi xử lý thanh toán.",
            });
          }
        } catch (error) {
          console.error("Error with custom payment service:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: error.message || "Có lỗi xảy ra khi xử lý thanh toán.",
          });
        }
      }
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Có lỗi xảy ra khi đặt hàng.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    // Fetch all vouchers
    const fetchVouchers = async () => {
      try {
        // Fetch all vouchers
        const response = await VoucherService.getAllVouchers();
        const activeVouchers = response.data.filter((voucher) => voucher.isActive);
        setVouchers(activeVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    // Fetch used vouchers for the account
    const fetchUsedVouchers = async () => {
      if (accountId) {
        try {
          const response = await VoucherService.getUsedVouchersByAccount(accountId);
          setUsedVouchers(response.data);
        } catch (error) {
          console.error("Error fetching used vouchers:", error);
        }
      }
    };

    fetchVouchers();
    fetchUsedVouchers();
  }, [accountId]);

  const [appliedVoucherId, setAppliedVoucherId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const handleApplyVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setAppliedVoucherId(voucher.id);
    toast.success(`Áp dụng mã giảm giá ${voucher.code} thành công!`);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const applicableVouchers = vouchers
    .filter((voucher) => !usedVouchers.some((usedVoucher) => usedVoucher.id === voucher.id))
    .map((voucher) => {
      const isValid = totalAmount >= voucher.minimumOrderValue;

      return {
        ...voucher,
        isValid,
        discountAmount: isValid ? (totalAmount * voucher.discountPercentage) / 100 : 0,
      };
    })
    .sort((a, b) => {
      const aMatchesSearch = a.code.toLowerCase().includes(searchText.toLowerCase());
      const bMatchesSearch = b.code.toLowerCase().includes(searchText.toLowerCase());
      if (aMatchesSearch && !bMatchesSearch) return -1;
      if (!aMatchesSearch && bMatchesSearch) return 1;
      return b.discountAmount - a.discountAmount;
    });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // =======
  //             // Đưa voucher khớp từ khóa tìm kiếm lên đầu
  //             const aMatchesSearch = a.code.toLowerCase().includes(searchText.toLowerCase());
  //             const bMatchesSearch = b.code.toLowerCase().includes(searchText.toLowerCase());

  //             if (aMatchesSearch && !bMatchesSearch) return -1; // a khớp tìm kiếm, b không khớp
  //             if (!aMatchesSearch && bMatchesSearch) return 1;  // b khớp tìm kiếm, a không khớp

  //             // Nếu cả hai cùng khớp hoặc không khớp, sắp xếp theo discountAmount
  //             return b.discountAmount - a.discountAmount;
  //         });

  // >>>>>>> origin/quocshuy69
  const goBack = () => {
    localStorage.removeItem("cartItemsBackup");
    navigate("/Cart");
  };

  const styles = {
    container: {
      display: "flex",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      alignItems: "flex-start",
      marginTop: "-20px",
    },
    cartDetails: {
      flex: 2,
      background: "white",
      padding: "20px",
      borderRadius: "8px",
    },
    couponContainer: {
      border: "1px dashed #00bcd4",
      padding: "10px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
    },
    couponInput: {
      flex: 1,
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      fontSize: "14px",
    },
    couponButton: {
      background: "#00bcd4",
      color: "white",
      border: "none",
      padding: "10px 15px",
      marginLeft: "10px",
      borderRadius: "4px",
      fontSize: "14px",
      cursor: "pointer",
    },
    addressSection: {
      padding: "10px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #eee",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addressText: {
      fontSize: "14px",
      color: "#333",
      lineHeight: "1.5",
      display: "flex",
      gap: "10px",
    },
    defaultLabel: {
      background: "#e63946",
      color: "#fff",
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "12px",
    },
    changeButton: {
      background: "none",
      border: "none",
      color: "#007bff",
      cursor: "pointer",
      fontSize: "14px",
      textDecoration: "underline",
    },
    productItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },
    productInfo: {
      flex: 1,
      marginLeft: "15px",
      lineHeight: "1.4",
    },
    price: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#e63946",
    },
    originalPrice: {
      fontSize: "12px",
      color: "#aaa",
      textDecoration: "line-through",
      marginLeft: "10px",
    },

    discount: {
      color: "#28a745",
      fontSize: "12px",
    },
    quantity: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    quantityButton: {
      width: "30px",
      height: "30px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      cursor: "pointer",
    },
    orderSummary: {
      flex: 1,
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      position: "sticky",
      top: "20px", // Khoảng cách từ mép trên khi cuộn
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Tùy chọn, để tạo hiệu ứng nổi
    },

    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      marginTop: "10px",
    },
    total: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
      fontSize: "18px",
    },
    checkoutButton: {
      width: "100%",
      background: "rgb(244 79 30 / 99%)",
      border: "none",
      padding: "10px",
      marginTop: "20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "white",
      cursor: "pointer",
    },
    paymentMethod: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    paymentLabel: {
      fontSize: "14px",
      fontWeight: "bold",
      marginRight: "10px",
    },
    paymentDescription: {
      fontSize: "12px",
      color: "#555",
    },
    paymentIcon: {
      width: "30px",
      height: "30px",
      marginLeft: "auto",
    },
  };


  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className="loader">
          <div className="loader-inner">
            <div className="circle"></div>
          </div>
        </div>
      )}

      <HasagiNav />
      <div className="header" style={{ marginTop: "100px", marginLeft: "30px" }}>
        <button className="back-button1" onClick={() => goBack()}>
          <i className="ni ni-bold-left" />
        </button>
        <h5
          className="mb-1"
          style={{
            fontWeight: "bold",
            fontSize: "24px",
            color: "#343a40",
            marginLeft: "-15px",
          }}
        >
          Thanh toán
        </h5>
      </div>
      <div style={styles.container}>
        <div style={styles.cartDetails}>
          <div style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleClickOpen}
              style={{
                border: "none",
                boxShadow: "none",
                padding: "8px 16px",
                marginRight: "0",
                color: "rgba(244, 79, 30, 0.99)",
                textDecoration: "underline",
                transition: "all 0.3s",
                fontSize: "1rem",
                marginTop: "-25px"
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "blue",
                  e.target.textDecorationColor = "blue"
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "rgba(244, 79, 30, 0.99)",
                  e.target.textDecorationColor = "rgba(244, 79, 30, 0.99)"
              }}
            >
              Áp dụng mã giảm giá
            </Button>

          </div>

          {/* Address Section */}
          {address ? (
            <div style={styles.addressSection}>
              <div style={styles.addressText}>
                <i
                  className="fa fa-map-marker-alt"
                  style={{ color: "red", fontSize: "1.2rem" }}
                ></i>
                <span>
                  <strong> {address.fullName} </strong> (+84){" "}
                  {address.numberPhone.startsWith("0")
                    ? address.numberPhone.substring(1)
                    : address.numberPhone}
                  , {address.address}, {getAddressNameById(address.wardCode, wards, "ward")},{" "}
                  {getAddressNameById(address.districtCode, districts, "district")},{" "}
                  {getAddressNameById(address.provinceID, provinces, "province")}
                </span>
                {address.status && <span style={styles.defaultLabel}>Mặc định</span>}
              </div>
              <button style={styles.changeButton} onClick={() => setShowModal(true)}>
                Thay Đổi
              </button>
            </div>
          ) : (
            <strong>Không có thông tin địa chỉ nào có sẵn.</strong>
          )}
          {/* Product List */}
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#333",
                marginLeft: "10px",
              }}
            >
              Thông tin sản phẩm
            </h3>
            {cartItems.map((item, index) => {
              const matchingImage = images[item.productId]?.find(
                (image) => image.colorsDTO.id === item.colorId
              );

              return (
                <div style={styles.productItem} key={index}>
                  {matchingImage && (
                    <img
                      src={matchingImage.imageDTOResponse[0]?.url}
                      alt="Áo Khoác Gió Thể Thao Nam"
                      style={{ width: "80px", height: "auto", borderRadius: "4px" }}
                    />
                  )}
                  <div style={styles.productInfo}>
                    <h3 style={{ fontSize: "14px", margin: "0", color: "#333", fontWeight: "400" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: "12px", margin: "5px 0", color: "#555" }}>
                      {item.color}  {item.size !== "Không có" && (
                        <>
                          , {item.size || "Chưa chọn kích thước"}
                        </>
                      )}
                    </p>
                    <p>
                      <span style={styles.price}>
                        {" "}
                        {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                      </span>
                    </p>
                  </div>
                  <span>x{item.quantity}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div style={styles.orderSummary}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ margin: 0 }}>Chi tiết đơn hàng</h2>
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>Danh sách phiếu giảm giá</div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    bsPrefix="icon-button"
                    style={{
                      color: "black",
                      fontSize: "1.2rem",
                      textDecoration: "none",
                      position: "relative",
                      paddingBottom: "0",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = "underline";
                      e.target.style.color = "blue";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = "none";
                      e.target.style.color = "black";
                    }}
                  >
                    Hỗ Trợ <AiOutlineQuestionCircle size={20} style={{ marginLeft: "8px" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      color: "black",
                      marginTop: "0",
                      padding: "20px",
                      width: "300px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div>
                      <h5 style={{ marginBottom: "10px" }}>Hỗ Trợ</h5>
                      <div>
                        <h6 style={{ marginBottom: "5px" }}>Cách Sử Dụng phiếu giảm giá</h6>
                        <p style={{ fontSize: "0.8rem", marginBottom: "10px" }}>
                          Để có thể áp dụng mã của phiếu giảm giá, bạn hãy chọn nút Sao chép mã để
                          áp dụng giảm giá vào đơn hàng của bạn.
                        </p>
                        <h6 style={{ marginBottom: "5px" }}>Cách Tìm phiếu giảm giá</h6>
                        <p style={{ fontSize: "0.8rem" }}>
                          Bạn có thể tìm thấy phiếu giảm giá xuyên suốt trang Hasagi Fashion. Mẹo
                          riêng cho bạn, hãy vào trang chủ của shop để có thể sao chép ưu đãi tốt
                          nhất nhé!
                        </p>
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </DialogTitle>
            <hr />
            <ArgonBox
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                paddingTop: "0px",
                paddingBottom: "10px",
              }}
            >
              <ArgonBox
                controlId="searchVoucher"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <ArgonInput
                  type="text"
                  placeholder="Nhập mã giảm giá để tìm kiếm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    padding: "0.8rem",
                    fontSize: "1rem",
                    width: "calc(100% - 120px)",
                    marginRight: "8px",
                  }}
                />
                <ArgonButton
                  variant="warning"
                  onClick={() => {
                    const voucher = vouchers.find(
                      (v) => v.code.toLowerCase() === searchText.toLowerCase()
                    );
                    if (voucher) {
                      if (totalAmount >= voucher.minimumOrderValue) {
                        if (!usedVouchers.some((usedVoucher) => usedVoucher.id === voucher.id)) {
                          handleApplyVoucher(voucher);
                          setAppliedVoucherId(voucher.id);
                        } else {
                          toast.error("Mã giảm giá đã sử dụng.");
                        }
                      } else {
                        toast.warn(
                          `Giá trị hóa đơn tối thiểu để áp dụng voucher là ${voucher.minimumOrderValue
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ.`
                        );
                      }
                    } else {
                      toast.error("Mã giảm giá không hợp lệ.");
                    }
                  }}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.8rem",
                    flexShrink: 0,
                    backgroundColor: "rgb(255 69 0 / 79%)",
                    height: "50px",
                    color: "white",
                  }}
                >
                  Áp dụng
                </ArgonButton>
              </ArgonBox>
            </ArgonBox>
            <DialogContent style={{ padding: "5px" }}>
              <Container className="my-1 mx-0">
                {applicableVouchers.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {applicableVouchers.map((voucher) => (
                      <Card
                        key={voucher.id}
                        className="text-center border-0 mb-3"
                        style={{
                          backgroundColor:
                            appliedVoucherId === voucher.id
                              ? "#d3d3d3" // Màu xám khi voucher đã áp dụng
                              : voucher.isValid
                                ? "#fef5e3" // Màu nền vàng cho voucher hợp lệ
                                : "#ffffff", // Màu trắng cho voucher không hợp lệ
                          color:
                            appliedVoucherId === voucher.id
                              ? "#808080" // Màu chữ xám khi voucher đã áp dụng
                              : voucher.isValid
                                ? "#000"
                                : "#000",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          flexWrap: "nowrap",
                          height: "auto", // Tăng chiều cao của voucher, có thể thêm giá trị cố định như '350px' nếu cần
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                        }}
                      >
                        <Card.Body
                          className="py-3"
                          style={{ minHeight: "100px", minWidth: "500px" }}
                        >
                          {" "}
                          {/* Tăng chiều cao của Card Body */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                background:
                                  appliedVoucherId === voucher.id
                                    ? "linear-gradient(to right, #d3d3d3, #a9a9a9)" // Gradient màu xám khi đã áp dụng
                                    : "linear-gradient(to right, #FFD700, #FFA500)", // Gradient vàng cho voucher hợp lệ
                                color: "#000",
                                padding: "2px 4px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              PHIẾU GIẢM GIÁ
                            </span>
                            <h3
                              style={{
                                fontSize: "1.4rem",
                                color:
                                  appliedVoucherId === voucher.id
                                    ? "#808080"
                                    : voucher.isValid
                                      ? "#FF4500"
                                      : "#000",
                                margin: "0",
                              }}
                            >
                              Giảm {voucher.discountPercentage}%
                            </h3>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Card.Title
                              style={{
                                fontSize: "1rem",
                                color:
                                  appliedVoucherId === voucher.id
                                    ? "#808080"
                                    : voucher.isValid
                                      ? "#FF4500"
                                      : "#000",
                                margin: "0",
                                fontWeight: 600,
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}> Mã: {voucher.code}</span>
                            </Card.Title>
                            {appliedVoucherId === voucher.id ? (
                              <Button
                                variant="secondary"
                                style={{ marginLeft: "8px", padding: "6px 14px", fontSize: "1rem" }}
                                onClick={() => {
                                  setAppliedVoucherId(null); // Bỏ áp dụng voucher
                                  setSelectedVoucher(null);
                                }}
                              >
                                Bỏ áp dụng
                              </Button>
                            ) : (
                              <Button
                                variant="warning"
                                onClick={() => {
                                  if (voucher.isValid) {
                                    handleApplyVoucher(voucher);
                                    setAppliedVoucherId(voucher.id); // Cập nhật voucher đã áp dụng
                                  }
                                }}
                                style={{
                                  marginLeft: "8px",
                                  padding: "6px 14px",
                                  fontSize: "1rem",
                                  background: voucher.isValid
                                    ? "linear-gradient(to right, #FF7F50, #FF4500)"
                                    : "#808080",
                                  color: "white",
                                  cursor: voucher.isValid ? "pointer" : "not-allowed",
                                }}
                                disabled={!voucher.isValid}
                              >
                                Áp dụng
                              </Button>
                            )}
                          </div>
                          <Card.Text
                            style={{ fontSize: "0.8rem", color: "#6c757d", textAlign: "left" }}
                          >
                            Giảm {voucher.discountPercentage}% khi hóa đơn từ{" "}
                            {voucher.minimumOrderValue
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            đ, giảm tối đa:{" "}
                            {voucher.maxDiscount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                            <div style={{ marginTop: "4px", fontSize: "0.8rem" }}>
                              HSD: {formatDate(voucher.endDate)}
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <Card.Body>
                      <Card.Text>Không tìm thấy voucher phù hợp</Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} style={{ color: "rgba(244, 79, 30, 0.99)" }}>
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
          <div style={styles.summaryItem}>
            <span>Tổng giá trị sản phẩm</span>
            <span>
              {" "}
              {new Intl.NumberFormat("vi-VN").format(
                cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
              )}
              đ
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span>Vận chuyển</span>
            <span>
              {shipFee?.total !== undefined
                ? new Intl.NumberFormat("vi-VN").format(shipFee.total)
                : "Đang tính..."}
              đ
            </span>
          </div>
          {selectedVoucher && selectedVoucher.discountPercentage > 0 ? (
            <div style={styles.summaryItem}>
              <span>Giảm giá </span>
              <span>
                {" "}
                {new Intl.NumberFormat("vi-VN").format(
                  Math.min(
                    (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) *
                      selectedVoucher.discountPercentage) /
                    100,
                    selectedVoucher.maxDiscount
                  )
                )}{" "}
                đ
              </span>
            </div>
          ) : null}
          <div style={styles.total}>
            <h3>Tổng thanh toán</h3>
            <h3 style={{ color: "red" }}>
              {" "}
              {new Intl.NumberFormat("vi-VN").format(
                cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) -
                (selectedVoucher
                  ? Math.min(
                    (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) *
                      selectedVoucher.discountPercentage) /
                    100,
                    selectedVoucher.maxDiscount
                  )
                  : 0) +
                (shipFee?.total || 0)
              )}
              đ
            </h3>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>Phương thức thanh toán</h2>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
              Lựa chọn phương thức thanh toán phù hợp nhất cho bạn
            </p>
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                onClick={() => setSelectedMethod(method.name)}
                style={{
                  border: selectedMethod === method.name ? "2px solid #00bcd4" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  // backgroundColor: selectedMethod === method.name ? "#f0f8ff" : "white",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={selectedMethod === method.name}
                  onChange={() => setSelectedMethod(method.name)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ fontSize: "14px", marginRight: "auto" }}>{method.nameView}</span>
                <img
                  src={method.image}
                  alt={method.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            ))}
          </div>
          <button style={styles.checkoutButton} onClick={handleClick}>
            <img
              src={aboutImage8}
              alt="icon"
              style={{ width: "20px", marginRight: "8px", marginBottom: "4px" }}
            />
            Mua hàng
          </button>
        </div>
      </div>
      <Footer />
      {showBackup && (
        <AddressSelection show={showBackup} onClose={handleAddressChange} addressId={addressId} />
      )}
      <AddressSelection show={showModal} onClose={handleAddressModalClose} />
    </>
  );
};

export default Checkout;
