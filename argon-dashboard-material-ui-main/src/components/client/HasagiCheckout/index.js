import React, { useState, useEffect } from 'react';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import "components/client/assets/css/style.css";
import ArgonButton from "components/ArgonButton";
import AddressSelection from "components/client/HasagiBackup1";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import VoucherService from "../../../services/VoucherServices";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CheckoutService from '../../../services/CheckoutServices';
import ArgonInput from "../../../components/ArgonInput";
import ArgonBox from "../../../components/ArgonBox";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Container, Card, Dropdown } from 'react-bootstrap';

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
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [usedVouchers, setUsedVouchers] = useState([]);
    const [accountId, setAccountId] = useState(Cookies.get('accountId'));



    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 700);

        const fetchAddress = async () => {
            try {
                const addressesId = new URLSearchParams(window.location.search).get('id');
                if (addressesId) {
                    const response = await axios.get(`http://localhost:3000/api/addresses/${addressesId}`);
                    setAddress(response.data);

                    console.log(address);
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
                    console.log(address);
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
                headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' }
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
                    'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d'
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
                    coupon_code: ""
                }
            });
            setShipFee(response.data.data);
        } catch (error) {
            console.log(error);
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
                headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' },
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
                headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' },
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
        Cookies.set('selectedPayment', paymentMethod);
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
            fullName: address.fullName
        };

        const cartDetailsDTO = selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        const productDetailIdSelected = selectedItems.map(item => item.id);


        const payStatusDirect = 'Chưa thanh toán';
        const voucherId = selectedVoucher ? selectedVoucher.id : null;
        const checkoutDataDirect = {
            addressDTO,
            cartDetails: cartDetailsDTO,
            payMethod: selectedPayment,
            payStatus: payStatusDirect,
            voucherId: voucherId,
            shippingFree: shipFee.total,
            fullName: `${address.address}, ${getAddressNameById(address.wardCode, wards, 'ward')}, ${getAddressNameById(address.districtCode, districts, 'district')}, ${getAddressNameById(address.provinceID, provinces, 'province')}`,
            productDetailIdSelected: productDetailIdSelected
        };
        const payStatusBank = 'Đã thanh toán';
        const checkoutDataBank = {
            addressDTO,
            cartDetails: cartDetailsDTO,
            payMethod: selectedPayment,
            payStatus: payStatusBank,
            voucherId: voucherId,
            shippingFree: shipFee.total,
            fullName: `${address.address}, ${getAddressNameById(address.wardCode, wards, 'ward')}, ${getAddressNameById(address.districtCode, districts, 'district')}, ${getAddressNameById(address.provinceID, provinces, 'province')}`,
            productDetailIdSelected: productDetailIdSelected
        };

        const payStatusMomo = 'Đã thanh toán';
        const checkoutDataMomo = {
            addressDTO,
            cartDetails: cartDetailsDTO,
            payMethod: selectedPayment,
            payStatus: payStatusMomo,
            voucherId: voucherId,
            shippingFree: shipFee.total,
            fullName: `${address.address}, ${getAddressNameById(address.wardCode, wards, 'ward')}, ${getAddressNameById(address.districtCode, districts, 'district')}, ${getAddressNameById(address.provinceID, provinces, 'province')}`,
            productDetailIdSelected: productDetailIdSelected
        };



        setIsLoading(true);
        try {
            let response;
            if (selectedPayment === 'Direct Check') {
                response = await CheckoutService.postCheckout(addressId, checkoutDataDirect);

                if (response.status === 200) {
                    await handleRemoveItems();
                    localStorage.setItem('address1', JSON.stringify(addressDTO));
                    localStorage.setItem('orderDetails1', JSON.stringify(cartDetailsDTO));
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
            } else if (selectedPayment === 'Bank Transfer') {
                response = await CheckoutService.postCheckout(addressId, checkoutDataBank);
                if (response.data.paymentUrl) {
                    localStorage.setItem('address1', JSON.stringify(addressDTO));
                    localStorage.setItem('orderDetails1', JSON.stringify(cartDetailsDTO));
                    Cookies.set('addressId', address.id);
                    await handleRemoveItems();
                    window.location.href = response.data.paymentUrl;
                } else {
                    toast.error("Có lỗi xảy ra khi xử lý thanh toán VNPAY.");
                }

            } else if (selectedPayment === 'Momo') {
                response = await CheckoutService.postCheckout(addressId, checkoutDataMomo);
                if (response.data.paymentUrl) {
                    localStorage.setItem('address1', JSON.stringify(addressDTO));
                    localStorage.setItem('orderDetails1', JSON.stringify(cartDetailsDTO));
                    Cookies.set('addressId', address.id);
                    await handleRemoveItems();
                    window.location.href = response.data.paymentUrl;
                } else {
                    toast.error("Có lỗi xảy ra khi xử lý thanh toán Momo.");
                }

            } else {
                toast.warn("Phương thức thanh toán không hợp lệ.");
            }

        } catch (error) {
            console.error('Error placing order:', error.response ? error.response.data : error.message);
            toast.error("Có lỗi xảy ra khi đặt hàng.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        // Fetch all vouchers
        const fetchVouchers = async () => {
            try {
                // Fetch all vouchers
                const response = await VoucherService.getAllVouchers();

                // Filter out only active vouchers
                const activeVouchers = response.data.filter(voucher => voucher.isActive);

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

    // Hàm mở Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Hàm đóng Dialog
    const handleClose = () => {
        setOpen(false);
    };


    const handleApplyVoucher = (voucher) => {
        setSelectedVoucher(voucher);
        setAppliedVoucherId(voucher.id);
        toast.success(`Áp dụng mã giảm giá ${voucher.code} thành công!`);
    };



    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const applicableVouchers = vouchers
        .filter((voucher) =>
            !usedVouchers.some((usedVoucher) => usedVoucher.id === voucher.id)
        )
        .map((voucher) => {
            const isValid = totalAmount >= voucher.minimumOrderValue;

            return {
                ...voucher,
                isValid,
                discountAmount: isValid ? (totalAmount * voucher.discountPercentage) / 100 : 0,
            };
        })
        .sort((a, b) => {
            // Đưa voucher khớp từ khóa tìm kiếm lên đầu
            const aMatchesSearch = a.code.toLowerCase().includes(searchText.toLowerCase());
            const bMatchesSearch = b.code.toLowerCase().includes(searchText.toLowerCase());

            if (aMatchesSearch && !bMatchesSearch) return -1; // a khớp tìm kiếm, b không khớp
            if (!aMatchesSearch && bMatchesSearch) return 1;  // b khớp tìm kiếm, a không khớp

            // Nếu cả hai cùng khớp hoặc không khớp, sắp xếp theo discountAmount
            return b.discountAmount - a.discountAmount;
        });



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
                                                {address.fullName} (+84) {address.numberPhone.startsWith('0') ? address.numberPhone.substring(1) : address.numberPhone}
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
                                                    <ArgonButton
                                                        className={`custom-btn payment-btn ${selectedPayment === 'Momo' ? 'active' : ''}`}
                                                        onClick={() => handleButtonClick('Momo')}
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


                                    <Dialog open={open} onClose={handleClose}>
                                        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0' }}>
                                            {/* Danh sách phiếu giảm giá */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                Danh sách phiếu giảm giá
                                            </div>

                                            {/* Hỗ trợ */}
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    variant="link"
                                                    bsPrefix="icon-button"
                                                    style={{
                                                        color: 'black',
                                                        fontSize: '1.2rem',
                                                        textDecoration: 'none',
                                                        position: 'relative',
                                                        paddingBottom: '0',
                                                        display: 'flex',
                                                        alignItems: 'center', // Căn giữa biểu tượng và chữ
                                                    }}
                                                >
                                                    Hỗ trợ <AiOutlineQuestionCircle size={40} style={{ marginLeft: '8px' }} />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu
                                                    style={{
                                                        marginTop: '0',
                                                        paddingTop: '0',
                                                    }}
                                                >
                                                    <Dropdown.Item href="#action1">Hướng dẫn sử dụng</Dropdown.Item>
                                                    <Dropdown.Item href="#action2">Chính sách giảm giá</Dropdown.Item>
                                                    <Dropdown.Item href="#action3">Liên hệ hỗ trợ</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </DialogTitle>
                                        <hr />
                                        <ArgonBox style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', paddingTop: '0px', paddingBottom: '10px' }}>
                                            <ArgonBox
                                                controlId="searchVoucher"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                                <ArgonInput
                                                    type="text"
                                                    placeholder="Nhập mã giảm giá để tìm kiếm"
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: '1px solid #ced4da',
                                                        padding: '0.8rem',
                                                        fontSize: '1rem',
                                                        width: 'calc(100% - 120px)',
                                                        marginRight: '8px',
                                                    }}
                                                />

                                                <ArgonButton
                                                    variant="warning"
                                                    onClick={() => {
                                                        const voucher = vouchers.find((v) => v.code.toLowerCase() === searchText.toLowerCase());
                                                        if (voucher && !usedVouchers.some((usedVoucher) => usedVoucher.id === voucher.id)) {
                                                            handleApplyVoucher(voucher);
                                                            setAppliedVoucherId(voucher.id);
                                                        } else {
                                                            toast.error('Mã giảm giá không hợp lệ hoặc đã sử dụng.');
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '6px 14px',
                                                        fontSize: '0.8rem',
                                                        flexShrink: 0,
                                                        backgroundColor: 'yellow',
                                                        height: '50px'
                                                    }}
                                                >
                                                    Áp dụng
                                                </ArgonButton>
                                            </ArgonBox>
                                        </ArgonBox>




                                        <DialogContent style={{ padding: '5px' }}>
                                            <Container className="my-1 mx-0">
                                                {applicableVouchers.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        {applicableVouchers.map((voucher) => (
                                                            <Card
                                                                key={voucher.id}
                                                                className="text-center border-0 mb-3"
                                                                style={{
                                                                    backgroundColor: appliedVoucherId === voucher.id
                                                                        ? '#d3d3d3' // Màu xám khi voucher đã áp dụng
                                                                        : voucher.isValid
                                                                            ? '#fef5e3' // Màu nền vàng cho voucher hợp lệ
                                                                            : '#ffffff', // Màu trắng cho voucher không hợp lệ
                                                                    color: appliedVoucherId === voucher.id
                                                                        ? '#808080' // Màu chữ xám khi voucher đã áp dụng
                                                                        : voucher.isValid
                                                                            ? '#000'
                                                                            : '#000',
                                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                                    flexWrap: 'nowrap',
                                                                    height: 'auto', // Tăng chiều cao của voucher, có thể thêm giá trị cố định như '350px' nếu cần
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.transform = 'scale(1)';
                                                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                                                }}
                                                            >
                                                                <Card.Body className="py-3" style={{ minHeight: '100px', minWidth: '500px' }}> {/* Tăng chiều cao của Card Body */}
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <span
                                                                            style={{
                                                                                background: appliedVoucherId === voucher.id
                                                                                    ? 'linear-gradient(to right, #d3d3d3, #a9a9a9)' // Gradient màu xám khi đã áp dụng
                                                                                    : 'linear-gradient(to right, #FFD700, #FFA500)', // Gradient vàng cho voucher hợp lệ
                                                                                color: '#000',
                                                                                padding: '2px 4px',
                                                                                borderRadius: '8px',
                                                                                fontWeight: 'bold',
                                                                                fontSize: '1rem',
                                                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                                            }}
                                                                        >
                                                                            PHIẾU GIẢM GIÁ
                                                                        </span>
                                                                        <h3
                                                                            style={{
                                                                                fontSize: '1.4rem',
                                                                                color: appliedVoucherId === voucher.id ? '#808080' : (voucher.isValid ? '#FF4500' : '#000'),
                                                                                margin: '0',
                                                                            }}
                                                                        >
                                                                            Giảm {voucher.discountPercentage}%
                                                                        </h3>
                                                                    </div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Card.Title
                                                                            style={{
                                                                                fontSize: '1rem',
                                                                                color: appliedVoucherId === voucher.id ? '#808080' : (voucher.isValid ? '#FF4500' : '#000'),
                                                                                margin: '0',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            <span style={{ fontWeight: 'bold' }}> Mã: {voucher.code}</span>
                                                                        </Card.Title>
                                                                        {appliedVoucherId === voucher.id ? (
                                                                            <Button
                                                                                variant="secondary"
                                                                                style={{ marginLeft: '8px', padding: '6px 14px', fontSize: '1rem' }}
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
                                                                                    marginLeft: '8px', padding: '6px 14px', fontSize: '1rem',
                                                                                    background: voucher.isValid ? 'linear-gradient(to right, #FF7F50, #FF4500)' : '#808080',
                                                                                    color: 'white',
                                                                                    cursor: voucher.isValid ? 'pointer' : 'not-allowed',
                                                                                }}
                                                                                disabled={!voucher.isValid}
                                                                            >
                                                                                Áp dụng
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <Card.Text style={{ fontSize: '0.8rem', color: '#6c757d', textAlign: 'left' }}>
                                                                        Giảm {voucher.discountPercentage}% khi hóa đơn từ {voucher.minimumOrderValue}đ, giảm tối đa: {voucher.maxDiscount}đ

                                                                        <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
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
                                            <Button onClick={handleClose} color="info">
                                                Đóng
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
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

                                    <Button variant="contained" color="warning" onClick={handleClickOpen}>
                                        Áp dụng mã giảm giá
                                    </Button>

                                    <ArgonBox controlId="searchVoucher" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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
                                            }}
                                        />
                                        <Button
                                            variant="warning"
                                            onClick={() => {
                                                const voucher = vouchers.find(v => v.code.toLowerCase() === searchText.toLowerCase());
                                                if (voucher && !usedVouchers.some(usedVoucher => usedVoucher.id === voucher.id)) {
                                                    handleApplyVoucher(voucher);
                                                    setAppliedVoucherId(voucher.id); // Cập nhật voucher đã áp dụng
                                                } else {
                                                    toast.error('Voucher không hợp lệ hoặc đã sử dụng.');
                                                }
                                            }}
                                            style={{ marginLeft: '8px', padding: '6px 14px', fontSize: '0.8rem' }}
                                        >
                                            Áp dụng
                                        </Button>
                                    </ArgonBox>

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
                                        <div className="d-flex justify-content-between">
                                            <h6 className="font-weight-medium" style={{ fontSize: '1.2rem' }}>Giảm</h6>
                                            <h6 style={{ fontSize: '1.2rem' }}>
                                                {selectedVoucher ?
                                                    Math.min(
                                                        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * selectedVoucher.discountPercentage / 100,
                                                        selectedVoucher.maxDiscount
                                                    )
                                                    : 0
                                                }đ
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="pt-3" style={{ padding: '0 20px' }}>
                                        <div className="d-flex justify-content-between mt-2">
                                            <h5 className="font-weight-bold">Tổng thanh toán</h5>
                                            <h5 className="font-weight-bold" style={{ color: '#ee4d2d' }}>
                                                {(
                                                    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) -
                                                    (selectedVoucher ? Math.min(
                                                        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * selectedVoucher.discountPercentage / 100,
                                                        selectedVoucher.maxDiscount
                                                    ) : 0) +
                                                    (shipFee?.total || 0)
                                                ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
            </div >
            <Footer />
            {showBackup && <AddressSelection show={showBackup} onClose={handleAddressChange} addressId={addressId} />}
            <AddressSelection show={showModal} onClose={handleAddressModalClose} />
        </>
    );
};

export default Checkout;