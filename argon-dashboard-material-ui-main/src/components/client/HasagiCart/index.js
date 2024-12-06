import React, { useState, useEffect, useRef } from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Backup from "components/client/HasagiBackup";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import aboutImage from "layouts/assets/img/shopping.png";
import CartService from "../../../services/CartService";
import AddressService from "../../../services/AddressServices";
import ProductVariant from "./ProductVariant";
import logo from "components/client/assets/images/logo1.png";
import Swal from 'sweetalert2';


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountExists, setAccountExists] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [images, setImages] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    const accountId = Cookies.get("accountId");

    if (!accountId) {
      navigate(`/authentication/sign-in`);
      return;
    }
    try {
      const [cartResponse, addressResponse] = await Promise.all([
        CartService.getCart(),
        AddressService.getAddress(),
      ]);

      // Cập nhật cartItems và accountExists
      const reversedCartData = cartResponse.data.reverse();
      setCartItems(reversedCartData);
      setAccountExists(addressResponse.data.exists);
      setAddress(addressResponse.data.addressId);

      // Gọi API hình ảnh dựa trên dữ liệu từ cartResponse
      const imageRequests = reversedCartData.map((item) =>
        axios
          .get(`http://localhost:3000/api/public/webShopDetail/product-detail/${item.productId}`)
          .then((res) => ({ productId: item.productId, data: res.data }))
      );

      const imagesData = await Promise.all(imageRequests);

      const imagesMap = imagesData.reduce((acc, { productId, data }) => {
        acc[productId] = data;
        return acc;
      }, {});

      setImages(imagesMap);

      const updatedCartItems = reversedCartData.map((item) => {
        const checkedItems =
          JSON.parse(
            localStorage.getItem("checkedItems" + item.productId + item.colorId + item.sizeId)
          ) || [];
        const isChecked = checkedItems.includes(item.productId);
        const checked = isChecked
          ? checkedItems.includes(item.colorId) && checkedItems.includes(item.sizeId)
          : "";
        return {
          ...item,
          selected: checked,
        };
      });

      setCartItems(updatedCartItems);
      //setCheckedItems(updatedCartItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };
    fetchCartItems();
    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce(
        (total, item) =>
          item.quantity > 0 ? total + item.price * item.quantity : total + item.price,
        0
      );
  };
  const subtotal = calculateSubtotal();
  const total = subtotal;

  const handleQuantityChange = async (itemId, change, inputValue = null) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.cartdetailid === itemId) {
        const newQuantity =
          inputValue === ""
            ? ""
            : inputValue === "0"
            ? item.quantity
            : parseInt(inputValue, 10) || item.quantity + change;

        if (newQuantity === 0) {
          Swal.fire({
            title: "Bạn chắc chắn xóa sản phẩm này?",
            text: "Bạn sẽ không thể hoàn tác điều này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vâng, xóa nó!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Xóa sản phẩm khỏi giỏ hàng
              const filteredCartItems = cartItems.filter((item) => item.cartdetailid !== itemId);
              setCartItems(filteredCartItems);
              try {
                CartService.getRemove(itemId);
                Swal.fire({
                  title: "Xóa thành công!",
                  text: "Sản phẩm đã được xóa.",
                  icon: "success",
                });
              } catch (error) {
                console.error("Error deleting item:", error);
                Swal.fire({
                  title: "Lỗi!",
                  text: "Đã có sự cố khi xóa sản phẩm.",
                  icon: "error",
                });
              }
            }
          });
          return item;
        }

        // Đảm bảo số lượng nằm trong khoảng cho phép
        if (newQuantity > 0) {
          const finalQuantity = Math.min(Math.max(1, newQuantity), item.quantityDetail);
          return { ...item, quantity: finalQuantity };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    const updatedItem = updatedCartItems.find((item) => item.cartdetailid === itemId);

    setCartItems(updatedCartItems);

    if (updatedItem.quantity > 0) {
      try {
        await axios.put(`http://localhost:3000/api/cart/update/${updatedItem.cartdetailid}`, null, {
          params: { quantity: updatedItem.quantity },
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      try {
        await axios.put(`http://localhost:3000/api/cart/update/${updatedItem.cartdetailid}`, null, {
          params: { quantity: 1 },
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };


  const handleRemoveItem = async (itemId, productId, colorId, sizeId) => {
    try {
      CartService.getRemove(itemId);
      setCartItems(cartItems.filter((item) => item.cartdetailid !== itemId));
      localStorage.removeItem("checkedItems" + productId + colorId + sizeId);
      toast.success("Xóa sản phẩm thành công.");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error removing item.");
    }
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedCartItems = cartItems.map((item) => ({ ...item, selected: newSelectAll }));
    setCartItems(updatedCartItems);
    if (newSelectAll) {
      const selectedKeys = updatedCartItems.map(
        (item) => `checkedItems${item.productId}${item.colorId}${item.sizeId}`
      );
      selectedKeys.forEach((key, index) => {
        const item = updatedCartItems[index]; // Tương ứng với từng sản phẩm
        localStorage.setItem(key, JSON.stringify([item.productId, item.colorId, item.sizeId]));
      });
    } else {
      localStorage.clear();
    }
  };

  const handleCheckboxChange = (itemId, productId, colorId, sizeId) => {
    const checkedItems =
      JSON.parse(localStorage.getItem("checkedItems" + productId + colorId + sizeId)) || [];

    if (checkedItems && checkedItems.length > 0) {
      localStorage.removeItem("checkedItems" + productId + colorId + sizeId);
    } else {
      cartItems.map((item) =>
        item.productId === productId
          ? localStorage.setItem(
            "checkedItems" + productId + colorId + sizeId,
            JSON.stringify([Number(productId), item.colorId, item.sizeId])
          )
          : item
      );
    }
    let updatedCheckedItems = [...checkedItems];
    if (updatedCheckedItems.includes(productId)) {
      updatedCheckedItems = updatedCheckedItems.filter((id) => id === productId); // Bỏ chọn
    } else {
      updatedCheckedItems.push(productId); // Chọn
    }
    const updatedCartItems = cartItems.map((item) =>
      item.cartdetailid === itemId ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedCartItems);
    const allSelected = updatedCartItems.every((item) => item.selected);
    setSelectAll(allSelected);
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
      return;
    }
    localStorage.setItem("cartItemsBackup", JSON.stringify(selectedItems));
    if (!accountExists) {
      setShowBackupModal(true);
    } else {
      navigate(`/Checkout?id=${address}`);
      toast.success("Chuyển đến trang thanh toán.");
    }
  };

  const handleCloseBackupModal = () => {
    setShowBackupModal(false);
    if (accountExists) {
      navigate(`/Checkout?id=${address}`);
      toast.success("Chuyển đến trang thanh toán.");
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = cartItems.filter((item) => item.selected).map((item) => item.cartdetailid);
    if (selectedIds.length === 0) {
      toast.warn("Vui lòng chọn sản phẩm để xóa.");
      return;
    }
    try {
      await axios.delete("http://localhost:8080/api/cart/delete", { data: selectedIds });
      setCartItems(cartItems.filter((item) => !selectedIds.includes(item.cartdetailid)));
      setSelectAll(false);
      localStorage.clear();
      toast.success("Xóa sản phẩm thành công.");
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  const countSelectedItems = () => {
    return cartItems.filter((item) => item.selected).length;
  };

  const toggleDropdown = (productId, cartDetailId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const isCurrentItem = item.cartdetailid === cartDetailId && item.productId === productId;
        return {
          ...item,
          isDropdownVisible: isCurrentItem
            ? !item.isDropdownVisible // Toggle nếu là sản phẩm hiện tại
            : false, // Đóng dropdown của sản phẩm khác
        };
      })
    );
  };

  const closeDropdown = async (id) => {
    try {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, isDropdownVisible: false } : item))
      );
      const response = await CartService.getCart();

      const updatedCartItems = response.data.reverse().map((item) => {
        const checkedItemsKey = `checkedItems${item.productId}${item.colorId}${item.sizeId}`;
        const checkedItems = JSON.parse(localStorage.getItem(checkedItemsKey)) || [];
        const isChecked =
          checkedItems.includes(item.productId) &&
          checkedItems.includes(item.colorId) &&
          checkedItems.includes(item.sizeId);

        return {
          ...item,
          selected: isChecked ? true : false,
        };
      });

      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  const handleOutsideClick = (event, id) => {
    const dropdown = document.getElementById(`dropdown-${id}`);
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      cartItems.forEach((item) => {
        if (item.isDropdownVisible) handleOutsideClick(event, item.id);
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartItems]);
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      backgroundColor: "white",
    },
    logo: {
      marginLeft: "20px",
      width: "180px",
      height: "70px",
    },
    cart: {
      marginRight: "1150px",
      fontSize: "1.1em",
      color: "black",
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
      <div className="container-fluid" style={{ marginTop: "100px" }}>
        <div style={styles.container}>
          <div style={styles.logo}>
            <a href="/feature-section" className="navbar-brand">
              <img src={logo} alt="logo" className="img-fluid" style={styles.logo} />
            </a>
          </div>
          <div style={styles.cart}>
            <a href="/feature-section" className="navbar-brand">
              Giỏ Hàng
            </a>
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col-lg-12 mb-5" id="tableAddCart">
            {cartItems.length === 0 ? (
              <div className="text-center py-3">
                <img src={aboutImage} style={{ height: "60px", width: "60px" }} />
                <p style={{ fontSize: "18px", color: "#6c757d" }}>Giỏ hàng của bạn đang trống.</p>
                <button
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#f29913",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => (window.location.href = "/Shop")}
                >
                  MUA NGAY
                </button>
              </div>
            ) : (
              <table
                className="table text-center mb-0"
                style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
              >
                <thead className="bg-primary text-white" style={{ fontSize: "14px" }}>
                  <tr>
                    <th
                      scope="col"
                      style={{ width: "5%", textAlign: "center", padding: "10px", border: "none" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                        aria-label="Select All"
                        style={{ transform: "scale(1.5)" }}
                      />
                    </th>
                    <th
                      scope="col"
                      style={{ width: "20%", textAlign: "left", padding: "10px", border: "none" }}
                    >
                      Sản Phẩm
                    </th>
                    <th scope="col" style={{ width: "25%", padding: "10px", border: "none" }}></th>
                    <th
                      scope="col"
                      style={{
                        width: "10%",
                        textAlign: "center",
                        padding: "10px",
                        border: "none",
                        color: "gray",
                      }}
                    >
                      Đơn Giá
                    </th>
                    <th
                      scope="col"
                      style={{
                        width: "15%",
                        textAlign: "center",
                        padding: "10px",
                        border: "none",
                        color: "gray",
                      }}
                    >
                      Số Lượng
                    </th>
                    <th
                      scope="col"
                      style={{
                        width: "10%",
                        textAlign: "center",
                        padding: "10px",
                        border: "none",
                        color: "gray",
                      }}
                    >
                      Tổng
                    </th>
                    <th
                      scope="col"
                      style={{
                        width: "10%",
                        textAlign: "center",
                        padding: "10px",
                        border: "none",
                        color: "gray",
                      }}
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="align-middle" style={{ fontSize: "17px" }}>
                  {cartItems.map((item) => {
                    const matchingImage = images[item.productId]?.find(
                      (image) => image.colorsDTO.id === item.colorId
                    );

                    return (
                      <tr
                        key={item.cartdetailid}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "10px",
                          marginBottom: "8px",
                        }}
                      >
                        <td className="align-middle" style={{ border: "none" }}>
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleCheckboxChange(item.cartdetailid, item.productId)}
                            style={{ transform: "scale(1.5)" }}
                          />
                        </td>
                        <td
                          className="align-middle"
                          style={{ textAlign: "left", paddingLeft: "20px", border: "none" }}
                        >
                          <Link
                            key={item.id}
                            to={`/ShopDetail?id=${item.productId}`}
                            style={{
                              color: "black",
                              textDecoration: "none",
                              whiteSpace: "nowrap", // Thêm thuộc tính này để ngăn dòng mới
                            }}
                          >
                            {matchingImage && (
                              <img
                                src={matchingImage.imageDTOResponse[0]?.url}
                                alt={item.name}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  marginRight: "10px",
                                }}
                              />
                            )}
                            {item.name}
                          </Link>

                        </td>
                        <td
                          className="align-middle"
                          style={{ border: "none", position: "relative" }}
                        >
                          <button
                            onMouseDown={(event) =>
                              toggleDropdown(item.productId, item.cartdetailid)
                            }
                            style={{
                              alignItems: "center", // Canh giữa nội dung theo chiều dọc
                              backgroundColor: "transparent",
                              border: "none",
                              color: "black",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <span>Phân Loại Hàng:</span>
                            <span
                              style={{
                                marginLeft: "10px", // Khoảng cách giữa text và mũi tên
                                display: "inline-block",
                                width: "0", // Không có chiều rộng
                                height: "0", // Không có chiều cao
                                borderLeft: "5px solid transparent", // Tạo cạnh trái
                                borderRight: "5px solid transparent", // Tạo cạnh phải
                                borderTop: `7px solid gray`, // Tạo cạnh trên để làm hình tam giác, màu xám khi mở
                                transform: item.isDropdownVisible
                                  ? "rotate(180deg)" // Mở: mũi tên hướng lên
                                  : "rotate(3deg)", // Đóng: mũi tên hướng xuống
                                transition: "transform 0.1s ease-in-out",
                              }}
                            />
                            <br />
                            {/* Hiển thị màu và kích thước dưới phân loại hàng */}
                            <div
                              style={{
                                fontSize: "15px",
                                color: "gray",
                                textAlign: "left",
                              }}
                            >
                              <span style={{ color: item.color || "black" }}>
                                {item.color || "Chưa chọn màu"}
                              </span>
                              , {item.size || "Chưa chọn kích thước"}
                            </div>
                          </button>

                          {/* Hiển thị dropdown nếu `isDropdownVisible` */}
                          {item.isDropdownVisible && (
                            <div
                              id={`dropdown-${item.cartdetailid}`}
                              style={{
                                position: "absolute",
                                top: "110%",
                                marginLeft: "0",
                                transform: "translateX(-10%)",
                                width: "100%",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                zIndex: 2000,
                                opacity: 1,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <span
                                style={{
                                  content: '""',
                                  position: "absolute",
                                  top: "-14px",
                                  left: "45%",
                                  transform: "translateX(-50%)",
                                  width: "0px",
                                  height: "0px",
                                  border: "1px solid #dddd", // Viền xung quanh tam giác
                                  borderLeft: "10px solid transparent", // Tạo cạnh trái trong suốt để tạo tam giác
                                  borderRight: "10px solid transparent", // Tạo cạnh phải trong suốt để tạo tam giác
                                  borderBottom: "14px solid #dddd", // Tạo đáy tam giác có màu viền
                                }}
                              />
                              <ProductVariant
                                productId={item.productId}
                                cartDetailId={item.cartdetailid}
                                onClose={() => closeDropdown(item.cartdetailid)}
                                colorId={item.colorId}
                                sizeId={item.sizeId}
                              />
                            </div>
                          )}
                        </td>
                        <td className="align-middle" style={{ border: "none" }}>
                          <span style={{ marginLeft: "1px" }}>
                            {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                          </span>
                        </td>

                        <td className="align-middle" style={{ border: "none" }}>
                          <div
                            className="input-group quantity mx-auto"
                            style={{
                              width: "150px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="input-group-btn">
                              <button
                                className="btn btn-warning btn-minus"
                                onClick={() => handleQuantityChange(item.cartdetailid, -1)}
                                aria-label={`Decrease quantity of ${item.name}`}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "none",
                                }}
                                disabled={item.quantity <= 0}
                              >
                                <i className="fa fa-minus"></i>
                              </button>
                            </div>

                            <input
                              type="text"
                              className="form-control form-control-sm text-center"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.cartdetailid, 0, e.target.value)
                              } 
                              onBlur={(e) => {
                                const inputValue = e.target.value.trim(); 
                                if (inputValue === "") {
                                  handleQuantityChange(item.cartdetailid, 0, "1"); 
                                } else {
                                  handleQuantityChange(item.cartdetailid, 0, inputValue); 
                                }
                              }}
                              style={{
                                width: "60px", 
                                height: "30px",
                                margin: "0 5px",
                                boxShadow: "none",
                                border: "1px solid #888",
                              }}
                            />

                            <div className="input-group-btn">
                              <button
                                className="btn btn-warning btn-plus"
                                onClick={() => handleQuantityChange(item.cartdetailid, 1)}
                                aria-label={`Increase quantity of ${item.name}`}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "none",
                                }}
                                disabled={item.quantity >= item.quantityDetail}
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="align-middle" style={{ border: "none" }}>
                        <span style={{ marginLeft: "1px" }}>
                            {item.quantity !== ""
                              ? new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)
                              : new Intl.NumberFormat("vi-VN").format(item.price)}
                          </span>
                        </td>
                        <td className="align-middle" style={{ border: "none" }}>
                          <button
                            onClick={() => handleRemoveItem(item.cartdetailid)}
                            className="btn btn-danger"
                            style={{ padding: "0.5rem 1rem" }}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {cartItems.length > 0 && (
              <div className="d-flex align-items-center justify-content-between w-100 py-2">
                <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    style={{ transform: "scale(1.5)", marginBottom: "0", marginLeft: "-4px" }}
                  />
                  <label style={{ marginLeft: "12px", marginTop: "2px" }}>
                    Chọn Tất Cả ({countSelectedItems()})
                  </label>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "black",
                      fontSize: "20px",
                      fontWeight: "normal",
                      marginLeft: "10px",
                      marginTop: "2px",
                    }}
                  >
                    Xóa
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <h5 className="font-weight-medium mb-0">
                    Tổng thanh toán ({countSelectedItems()} sản phẩm):{" "}
                    <span style={{ marginLeft: "1px" }}>
                      {new Intl.NumberFormat("vi-VN").format(total)}đ
                    </span>
                  </h5>
                  <button
                    onClick={handleCheckout}
                    className="btn btn-warning  ms-3"
                    style={{ borderRadius: "0px" }}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Backup show={showBackupModal} onClose={handleCloseBackupModal} />
      <Footer />
    </>
  );
};

export default Cart;