import React, { useState, useEffect } from 'react';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import "components/client/assets/css/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons';
import ArgonButton from "components/ArgonButton";
import AddressSelection from "components/client/HasagiBackup1";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../HasagiNavbar';

const Checkout = () => {
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showPaymentButtons, setShowPaymentButtons] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showBackup, setShowBackup] = useState(false);
    const [address, setAddress] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const addressId = query.get('id');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate();
    const [shipFee, setShipFee] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 700);
        
        const accountId = Cookies.get('accountId');
        if (!accountId) {
            navigate(`/authentication/sign-in`);
            return;
        }
        const fetchAddress = async () => {
            try {
                const addressesId = new URLSearchParams(window.location.search).get('id');
                if (addressesId) {
                    const response = await axios.get(`http://localhost:3000/api/addresses/${addressesId}`);
                    console.log("Fetched address:", response.data); // Kiểm tra dữ liệu
                    setAddress(response.data);
                    await fetchProvinces();
                } else {
                    console.error("No address ID found in the URL");
                }
            } catch (error) {
                console.error("Error fetching address:", error);
            }
        };
        fetchAddress();
        const cartItemsBackup = JSON.parse(localStorage.getItem('cartItemsBackup')) || [];
        setCartItems(cartItemsBackup);
    }, []);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/addresses/${addressId}`, {
                    withCredentials: true
                });
                if (response.data && response.data.districtCode) {
                    setAddress(response.data);
                    console.log("Fetched address:", response.data);
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

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' }
            });
            setProvinces(response.data.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchShipFee = async () => {
        const XuanKhanhDistrictID = 1572;
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
                headers: {
                    'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f'
                },
                params: {
                    from_district_id: XuanKhanhDistrictID,
                    to_district_id: address.districtCode,
                    weight: 1000,
                    length: 10,
                    width: 10,
                    height: 10,
                    service_id: 0,
                    service_type_id: 2,
                    coupon_code: ""
                }
            });
            console.log("Shipping fee response:", response.data);
            setShipFee(response.data.data);
        } catch (error) {
        }
    };

    useEffect(() => {
        if (address && address.districtCode) {
            fetchShipFee();
        }
    }, [address]);

    useEffect(() => {
        fetchShipFee();
    }, []);

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' },
                params: { province_id: provinceId }
            });
            setDistricts(response.data.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' },
                params: { district_id: districtId }
            });
            setWards(response.data.data);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const handleButtonClick = (paymentMethod) => {
        setSelectedPayment(paymentMethod);
        setShowPaymentButtons(paymentMethod !== 'Direct Check');
    };

    const handleChangePaymentMethod = () => {
        setSelectedPayment('');
        setShowPaymentButtons(true);
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
        const addressItem = list.find(item => {
            if (type === 'province' && item.ProvinceID === Number(id)) return true;
            if (type === 'district' && item.DistrictID === Number(id)) return true;
            if (type === 'ward' && item.WardCode === String(id)) return true;
            return false;
        });
        if (addressItem) {
            if (type === 'province') return addressItem.ProvinceName;
            if (type === 'district') return addressItem.DistrictName;
            if (type === 'ward') return addressItem.WardName;
        }
        return 'Unknown';
    };

    const handleRemoveItems = async () => {
        const cartItemsBackup = JSON.parse(localStorage.getItem('cartItemsBackup')) || [];
        const selectedItemIds = cartItemsBackup
            .filter(item => item.selected)
            .map(item => item.cartdetailid);
        if (selectedItemIds.length === 0) {
            console.error("No items selected for removal");
            return;
        }
        try {
            const response = await axios.delete('http://localhost:3000/api/cart/delete', {
                data: selectedItemIds,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                console.log("Items deleted successfully");
                const updatedCartItems = cartItemsBackup.filter(item => !selectedItemIds.includes(item.cartdetailid));
                localStorage.setItem('cartItemsBackup', JSON.stringify(updatedCartItems));
                setCartItems(updatedCartItems);

            } else {
                console.error("Failed to delete items:", response.data);
            }
        } catch (error) {
            console.error("Error deleting items:", error);
        }
    };

    const handleClick = async () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
            return;
        }
        if (!selectedPayment) {
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
        };

        const cartDetailsDTO = selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        const accountId = Cookies.get('accountId');

        setIsLoading(true); // Set loading state to true at the start
        try {
            // Handle cash on delivery
            if (selectedPayment === 'Direct Check') {
                const payStatus = 'Not Paid'; // Status for cash on delivery
                const response = await axios.post(
                    `http://localhost:3000/api/checkout/${addressId}?accountId=${accountId}`,
                    {
                        addressDTO,
                        cartDetails: cartDetailsDTO,
                        payMethod: selectedPayment,
                        payStatus: payStatus,
                        shippingFree: shipFee.total
                    },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 200) {
                    console.log("Order placed successfully!");
                    toast.success("Đặt hàng thành công!");
                    await handleRemoveItems();
                    navigate('/Complete', {
                        state: {
                            address: addressDTO,
                            orderDetails: cartDetailsDTO,
                        }
                    });
                } else {
                    console.error('Failed to place order:', response.data);
                    toast.error("Có lỗi xảy ra khi đặt hàng.");
                }

                // Handle VNPAY payment
            } else if (selectedPayment === 'Bank Transfer') {
                const payStatus = 'Paid'; // Status for VNPAY
                const response = await axios.post(
                    `http://localhost:3000/api/checkout/${addressId}?accountId=${accountId}`,
                    {
                        addressDTO,
                        cartDetails: cartDetailsDTO,
                        payMethod: selectedPayment,
payStatus: payStatus,
                        shippingFree: shipFee.total
                    },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.paymentUrl) {
                    // Redirect to VNPAY payment page
                    window.location.href = response.data.paymentUrl;
                } else {
                    toast.error("Có lỗi xảy ra khi xử lý thanh toán VNPAY.");
                }

            } else {
                toast.warn("Phương thức thanh toán không hợp lệ.");
            }

        } catch (error) {
            console.error('Error placing order:', error.response ? error.response.data : error.message);
            toast.error("Có lỗi xảy ra khi đặt hàng.");
        } finally {
            setIsLoading(false); // Set loading state to false in the end
        }
    };

    const goBack = () => {
        navigate('/Cart');
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
            <Navbar/>
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="header py-3">
                        <button className="back-button" onClick={() => goBack()}>
                            <i className="ni ni-bold-left" />
                        </button>
                        <h5 className="mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Thanh toán</h5>
                    </div>
                    <div className="col-lg-12">
                        <div className="bg-light p-3 mb-4" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginLeft: "-10px", marginRight: "-10px" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 d-flex align-items-center" style={{ color: '#e63946', fontWeight: 'bold', marginLeft: "15px" }}>
                                    <i className="fa fa-map-marker-alt mr-2" style={{ color: 'red', fontSize: '1.2rem', marginRight: '5px' }}></i>
                                    Địa Chỉ Nhận Hàng
                                </h5>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-2" style={{ flexWrap: 'wrap', lineHeight: '1.5', marginLeft: "15px" }}>
                                {address ? (
                                    <>
                                        <div className="d-flex" style={{ alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '20px' }}>
                                                {address.fullNameAddress} (+84) {address.numberPhone.startsWith('0') ? address.numberPhone.substring(1) : address.numberPhone}
                                            </span>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                {address.address},{" "}
                                                {getAddressNameById(address.wardCode, wards, 'ward')},{" "}
                                                {getAddressNameById(address.districtCode, districts, 'district')},{" "}
                                                {getAddressNameById(address.provinceID, provinces, 'province')}
                                            </span>
                                            {address.status && (
                                                <span className="badge bg-danger" style={{ fontSize: '0.75rem', marginLeft: '10px' }}>Mặc định</span>
                                            )}
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-outline-primary btn-sm ml-2"
                                                style={{ fontWeight: 'bold', fontSize: '0.9rem', marginRight: '15px' }}
                                                onClick={() => setShowModal(true)}
                                            >
                                                Thay Đổi
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <strong>Không có thông tin địa chỉ nào có sẵn.</strong>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="bg-light p-30 mb-5" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginLeft: "-10px", marginRight: "-10px" }}>
                            <table className="table table-bordered table-hover border-bottom mb-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <thead className="thead-light " style={{ fontWeight: 'bold', color: '#fff' }}>
                                    <tr>
                                        <th scope="col" className="text-left" style={{ width: "350px" }}>Sản phẩm</th>
                                        <th scope="col" className="text-center" style={{ width: "250px" }}></th>
                                        <th scope="col" className="text-center">Đơn giá</th>
                                        <th scope="col" className="text-center">Số lượng</th>
                                        <th scope="col" className="text-center">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={index} style={{ verticalAlign: 'middle' }}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={item.image} style={{ width: 60, marginRight: '15px', borderRadius: '5px' }} alt="Product" />
                                                    <span style={{ fontWeight: 'medium' }}>{item.name}</span>
                                                </div>
                                            </td>
                                            <td className='py-4'>
                                                <div>Loại: <span style={{ fontWeight: 'medium' }}>{item.color}</span>, <span style={{ fontWeight: 'medium' }}>{item.size}</span></div>
                                            </td>
                                            <td style={{ fontWeight: 'medium' }} className="text-center py-4">{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                            <td className="text-center py-4">
                                                <span style={{ fontWeight: 'medium' }}>{item.quantity}</span>
                                            </td>
                                            <td style={{ fontWeight: 'medium' }} className="text-center py-4">{item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="bg-light p-4 mb-4" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginLeft: "-10px", marginRight: "-10px" }}>
                            <div className="d-flex justify-content-between flex-wrap">
                                <div className="col-lg-7 mb-4">
                                    <h5 className="mb-3 d-flex align-items-center" style={{ color: '#e63946', fontWeight: 'bold' }}>
                                        <span>Phương thức thanh toán</span>
                                        <div className="payment-options d-flex ml-3">
                                            {showPaymentButtons && (
                                                <>
                                                    <ArgonButton
                                                        className={`custom-btn payment-btn ${selectedPayment === 'Direct Check' ? 'active' : ''}`}
                                                        onClick={() => handleButtonClick('Direct Check')}
                                                    >
                                                        Thanh toán khi nhận hàng
                                                    </ArgonButton>
                                                    <ArgonButton
                                                        className={`custom-btn payment-btn ${selectedPayment === 'Bank Transfer' ? 'active' : ''}`}
                                                        onClick={() => handleButtonClick('Bank Transfer')}
                                                    >
                                                        Bank Transfer
                                                    </ArgonButton>
                                                </>
                                            )}
                                        </div>
                                    </h5>
                                    {!selectedPayment && (
                                        <div className="alert alert-danger" role="alert">
                                            Vui lòng chọn phương thức thanh toán.
                                        </div>
                                    )}
                                    {selectedPayment === 'Direct Check' && (
                                        <div className="payment-description mb-3">
                                            <p>Thanh toán COD (Cash on Delivery) là một dịch vụ giao hàng thu tiền hộ được sử dụng phổ biến trong giao dịch mua bán hàng hóa. Trong đó,
                                                người mua sẽ thanh toán tiền mặt (tiền đặt hàng) cho người giao hàng ngay tại thời điểm nhận hàng.</p>
                                        </div>
                                    )}
                                    {/* {selectedPayment === 'Bank Transfer' && (
                                        <div className="payment-description mb-3">
                                            <p>Chọn phương thức chuyển khoản:</p>
                                            <div className="payment-buttons d-flex flex-wrap">
                                                <button className="payment-btn1 mr-2 mb-2">
                                                    <div className="icon-container">
                                                        <FontAwesomeIcon icon={faCcVisa} />
                                                    </div>
                                                    <span>Giảm 50000đ</span>
                                                    <span>Đơn từ 250.000đ với thẻ VISA</span>
                                                </button>
                                                <button className="payment-btn1 mr-2 mb-2">
                                                    <div className="icon-container">
                                                        <FontAwesomeIcon icon={faCcMastercard} />
                                                    </div>
                                                    <span>Giảm 50000đ</span>
                                                    <span>Đơn từ 250.000đ với ví VNPAY</span>
                                                </button>
                                                <button className="payment-btn1 mb-2">
                                                    <div className="icon-container">
                                                        <FontAwesomeIcon icon={faCcAmex} />
                                                    </div>
                                                    <span>Giảm 50000đ</span>
                                                    <span>Đơn từ 250.000đ với thẻ TPBANK</span>
                                                </button>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                                <div className="col-lg-5">
                                    {selectedPayment === 'Direct Check' && (
                                        <div className="form-group mb-3 d-flex align-items-center" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
                                            <label
                                                htmlFor="payment-input"
                                                style={{
                                                    marginRight: '10px',
                                                    fontWeight: '500',
                                                    color: '#333'
                                                }}
                                            >
                                                Thanh toán khi nhận hàng
                                            </label>
                                            <ArgonButton className="change-payment-btn btn-custom" onClick={handleChangePaymentMethod}>
                                                Thay đổi
                                            </ArgonButton>
                                        </div>
                                    )}
                                    <div className="border-bottom pt-4" style={{ padding: '0 20px' }}>
                                        <div className="d-flex justify-content-between mb-3">
                                            <h6 className="font-weight-medium" style={{ fontSize: '1.2rem' }}>Tổng tiền hàng</h6>
                                            <h6 className="font-weight-medium" style={{ fontSize: '1.2rem' }}>
                                                {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </h6>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h6 className="font-weight-medium" style={{ fontSize: '1.2rem' }}>Phí vận chuyển</h6>
                                            <h6 style={{ fontSize: '1.2rem' }}>
                                                {shipFee?.total ? shipFee.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Đang tính...'}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="pt-3" style={{ padding: '0 20px' }}>
                                        <div className="d-flex justify-content-between mt-2">
                                            <h5 className="font-weight-bold">Tổng thanh toán</h5>
                                            <h5 className="font-weight-bold" style={{ color: '#ee4d2d' }}>
                                                {(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + (shipFee?.total || 0)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </h5>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClick}
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#ee4d2d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '12px 0',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s, transform 0.3s'
                                        }}
                                    > Đặt hàng
                                    </button>
                                    <p className="mt-3 text-center">
                                        Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo <a href=''>Điều khoản HasagiFashion</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {showBackup && <AddressSelection show={showBackup} onClose={handleAddressChange} addressId={addressId} />}
            <AddressSelection show={showModal} onClose={handleAddressModalClose} />
        </>
    );
};

export default Checkout;