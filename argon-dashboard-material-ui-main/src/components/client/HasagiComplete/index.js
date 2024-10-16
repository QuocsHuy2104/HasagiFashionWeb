import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArgonButton from "components/ArgonButton";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const Complete = () => {
    const [address, setAddress] = useState({});
    const [orderDetails, setOrderDetails] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const addressId = Cookies.get('addressId');
        const params = new URLSearchParams(location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const transactionStatus = params.get('vnp_TransactionStatus');
        const selectedPayment = Cookies.get('selectedPayment');

        if (selectedPayment !== 'Direct Check' && (responseCode !== '00' || transactionStatus !== '00')) {
            // Thanh toán thất bại, điều hướng đến trang Checkout mà không xóa sản phẩm
            navigate(`/Checkout?id=${addressId}`);
        } else {
            // Thanh toán thành công, gọi hàm xóa sản phẩm
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
            handleRemoveItems();
        }
    }, [location, navigate]);


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

    const handleViewOrder = async () => {
        navigate("/History", { state: { activeTab: 'dang-giao' } });
    };
    const handleGoHome = async () => {
        navigate('/feature-section');
    };


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

    return (
        <div style={styles.container}>
            <FaCheckCircle style={styles.icon} />
            <h2 style={styles.title}>Đã gửi đơn hàng</h2>
            <p style={styles.description}>
                Đơn hàng của bạn sẽ được vận chuyển đến: <br />
                <strong>{address.fullName || 'N/A'}</strong> (+84) {address.numberPhone?.startsWith('0') ? address.numberPhone.substring(1) : address.numberPhone || 'N/A'} <br />
                {address.address || 'N/A'},
                {getAddressNameById(address.wardCode, wards, 'ward') || 'Unknown'}, 
                {getAddressNameById(address.districtCode, districts, 'district') || 'Unknown'},
                {getAddressNameById(address.provinceID, provinces, 'province') || 'Unknown'}
            </p>
            <div style={styles.buttonContainer}>
                <ArgonButton onClick={handleGoHome} color="secondary" style={styles.button}>
                    Quay về trang chủ
                </ArgonButton>
                <ArgonButton onClick={handleViewOrder} color="primary" style={styles.button}>
                    Xem đơn hàng
                </ArgonButton>
            </div>
        </div>
    );
};
const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: '400px',
        margin: '20px auto',
    },
    icon: {
        fontSize: '40px',
        color: '#00C851',
    },
    title: {
        fontSize: '24px',
        margin: '10px 0',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        minWidth: '120px',
        margin: '5px',
    },
};

export default Complete;