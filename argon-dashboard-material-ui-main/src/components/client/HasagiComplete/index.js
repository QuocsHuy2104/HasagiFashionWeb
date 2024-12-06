import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const Complete = () => {
    const [address, setAddress] = useState({});
    const [orderDetails, setOrderDetails] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [alertShown, setAlertShown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const addressId = Cookies.get('addressId');
        const params = new URLSearchParams(location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const transactionStatus = params.get('vnp_TransactionStatus');
        const selectedPayment = Cookies.get('selectedPayment');

        if (selectedPayment !== 'COD' && (responseCode !== '00' || transactionStatus !== '00')) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi thanh toán',
                text: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.',
                confirmButtonText: 'Quay lại trang chủ',
                confirmButtonColor: '#d33',
                showConfirmButton: true, // Hiển thị nút xác nhận
                timer: 0, // Đặt timer thành 0 để không tự động đóng thông báo
            }).then(() => {
                // Sau khi người dùng nhấn xác nhận, chuyển hướng đến trang checkout
                navigate(`/Checkout?id=${addressId}`);
            });

            axios
                .delete('http://localhost:3000/api/order/deleteMostRecentOrder')
                .then((response) => {
                    console.log(response.data);
                    navigate(`/Checkout?id=${addressId}`);
                })
                .catch((error) => {
                    console.error('Error deleting the most recent order:', error);
                });
        } else {
            const handleRemoveItems = async () => {
                const cartItemsBackup = JSON.parse(localStorage.getItem('cartItemsBackup')) || [];
                const selectedItemIds = cartItemsBackup
                    .filter(item => item.selected)
                    .map(item => item.cartdetailid);
                try {
                    const response = await axios.delete('http://localhost:3000/api/cart/delete', {
                        data: selectedItemIds,
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (response.status === 200) {
                        const updatedCartItems = cartItemsBackup.filter(item => !selectedItemIds.includes(item.cartdetailid));
                        localStorage.setItem('cartItemsBackup', JSON.stringify(updatedCartItems));
                    } else {
                        console.error("Failed to delete items:", response.data);
                    }
                } catch (error) {
                    console.error("Error deleting items:", error);
                }
            };
            handleRemoveItems();
        }
    }, [navigate]);

    useEffect(() => {
        const storedAddress = JSON.parse(localStorage.getItem('address1'));
        const storedOrderDetails = JSON.parse(localStorage.getItem('orderDetails1'));

        if (storedAddress && storedOrderDetails) {
            setAddress(storedAddress);
            setOrderDetails(storedOrderDetails);
        }
        localStorage.removeItem('address');
        localStorage.removeItem('orderDetails');
    }, []);

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (address.provinceID) {
            fetchDistricts(address.provinceID);
        }
    }, [address.provinceID]);

    useEffect(() => {
        if (address.districtCode) {
            fetchWards(address.districtCode);
        }
    }, [address.districtCode]);

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


    useEffect(() => {
        if (address && provinces.length && districts.length && wards.length && !alertShown) {
            Swal.fire({
                icon: 'success',
                title: 'Đã gửi đơn hàng',
                html: `
                    <strong>${address.fullName || 'N/A'}</strong> (+84) ${address.numberPhone?.startsWith('0') ? address.numberPhone.substring(1) : address.numberPhone || 'N/A'} <br />
                    ${address.address || 'N/A'}, ${getAddressNameById(address.wardCode, wards, 'ward') || 'Unknown'}, 
                    ${getAddressNameById(address.districtCode, districts, 'district') || 'Unknown'},
                    ${getAddressNameById(address.provinceID, provinces, 'province') || 'Unknown'}
                `,
                showConfirmButton: true,
                confirmButtonText: 'Quay lại trang chủ',
                showDenyButton: true,
                denyButtonText: 'Xem hóa đơn',
                preConfirm: () => {
                    navigate('/feature-section');
                    Cookies.remove('selectedPayment');
                },
                denyButtonColor: '#3085d6',
                confirmButtonColor: '#d33',
            }).then((result) => {
                if (result.isDenied) {
                    navigate("/History", { state: { activeTab: 'dang-giao' } });
                    Cookies.remove('selectedPayment');
                }
            });
            setAlertShown(true);
        }
    }, [address, provinces, districts, wards, alertShown, navigate]);

    return <></>;
};

export default Complete;
