import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ArgonButton from "components/ArgonButton";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Complete = () => {
    const location = useLocation();
    const { state } = location;
    const address = state?.address || {};
    const orderDetails = state?.orderDetails || [];
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const navigate = useNavigate();

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
        navigate('/History');
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
                <strong>{address.fullNameAddress}</strong> · (+84){address.numberPhone} <br />
                {address.address},
                {getAddressNameById(address.provinceID, provinces, 'province')},
                {getAddressNameById(address.districtCode, districts, 'district')},
                {getAddressNameById(address.wardCode, wards, 'ward')}
            </p>
            <div style={styles.buttonContainer}>
                <ArgonButton onClick={handleGoHome} color="secondary" style={styles.button}>
                    Quay về trang chủ
                </ArgonButton>
                <ArgonButton onClick={handleViewOrder} color="primary" style={styles.button}>
                    <i className="fas fa-lock"></i> View order
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
