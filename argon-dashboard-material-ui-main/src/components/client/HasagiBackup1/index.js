import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Backup3 from '../HasagiBackup3';
import Backup2 from '../HasagiBackup2';
import Cookies from "js-cookie";

const AddressSelection = ({ show, onClose }) => {
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState({});
    const [wards, setWards] = useState({});
    const [loading, setLoading] = useState(true);
    const [showBackup, setShowBackup] = useState(false);
    const [showBackup1, setShowBackup1] = useState(false);
    const [backupAddress, setBackupAddress] = useState(null);
    const navigate = useNavigate();

    const fetchAddress = async () => {
        const accountId = Cookies.get('accountId'); 
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/addresses/account?accountId=${accountId}`, {
                withCredentials: true
            });
            let addresses = response.data;
            await fetchProvinces();
            for (const addr of addresses) {
                await fetchDistricts(addr.provinceID);
                await fetchWards(addr.districtCode);
            }
            const defaultAddress = addresses.find(addr => addr.status);
            if (defaultAddress) {
                addresses = [defaultAddress, ...addresses.filter(addr => addr.id !== defaultAddress.id)];
                setSelectedAddress(defaultAddress.id);
            }
            setAddress(addresses);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchAddress();
        }
    }, [show]);

    const handleAddressUpdated = () => {
        fetchAddress();
    };

    useEffect(() => {
        if (selectedAddress) {
            const selectedAddr = address.find(addr => addr.id === selectedAddress);
            if (selectedAddr) {
                if (!districts[selectedAddr.provinceID]) {
                    fetchDistricts(selectedAddr.provinceID);
                }
                if (!wards[selectedAddr.districtCode]) {
                    fetchWards(selectedAddr.districtCode);
                }
            }
        }
    }, [selectedAddress]);

    const handleAddressChange = async (id, provinceID, districtCode) => {
        setSelectedAddress(id);
        if (provinceID && !districts[provinceID]) {
            await fetchDistricts(provinceID);
        }
        if (districtCode && !wards[districtCode]) {
            await fetchWards(districtCode);
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?");
            if (!confirmDelete) return;
            const payload = {}; 
            await axios.put(`http://localhost:3000/api/addresses/delete/${id}`, payload);
            alert("Địa chỉ đã được xóa thành công");
            fetchAddress();
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
            alert("Xóa địa chỉ thất bại");
        }
    };

    const handleComplete = () => {
        if (selectedAddress) {
            handleAddressSelect(selectedAddress);
            navigate(`/Checkout?id=${selectedAddress}`); 
        }
    };

    const handleClose = () => {
        handleAddressSelect(selectedAddress);
        onClose(selectedAddress);
    };

    const handleAddressUpdate = (id) => {
        setBackupAddress(id);
        setShowBackup(true);
    };

    const handleAddAddress = () => {
        setShowBackup1(true);
    };

    const handleAddressSelect = (selectedAddress) => {
        onClose(selectedAddress);
    };

    const getAddressNameById = (id, list, type) => {
        if (!id) return 'Đang tải...';
        const addressItem = list.find(item => {
            if (type === 'province' && item.ProvinceID === Number(id)) {
                return true;
            } else if (type === 'district' && item.DistrictID === Number(id)) {
                return true;
            } else if (type === 'ward' && item.WardCode === String(id)) {
                return true;
            }
            return false;
        });
        if (addressItem) {
            if (type === 'province') return addressItem.ProvinceName;
            if (type === 'district') return addressItem.DistrictName;
            if (type === 'ward') return addressItem.WardName;
        }
        return 'Không xác định';
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
            setDistricts(prev => ({ ...prev, [provinceId]: response.data.data }));
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
            setWards(prev => ({ ...prev, [districtId]: response.data.data }));
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    if (!show && !showBackup) return null;

    return (
        <>
            {show && !showBackup && !showBackup1 && (
                <div className="modal" style={{ display: show ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ fontSize: '14px' }}>
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ fontSize: '16px' }}>Địa Chỉ Của Tôi</h5>
                            </div>
                            <div className="modal-body p-4">
                                <div className="list-group">
                                    {address.map((addr) => (
                                        <div key={addr.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ padding: '10px 15px' }}>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddress === addr.id}
                                                    onChange={() => handleAddressChange(addr.id, addr.provinceID, addr.districtCode)}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <div className="ms-3">
                                                    <div style={{ fontWeight: '500' }}>{addr.fullNameAddress} <span style={{ fontSize: '12px' }}>({addr.numberPhone})</span></div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {addr.address},
                                                        {getAddressNameById(addr.provinceID, provinces, 'province')},
                                                        {districts[addr.provinceID] ? getAddressNameById(addr.districtCode, districts[addr.provinceID], 'district') : 'Đang tải...'},
                                                        {wards[addr.districtCode] ? getAddressNameById(addr.wardCode, wards[addr.districtCode], 'ward') : 'Đang tải...'}
                                                    </div>
                                                    {addr.status && <span className="badge bg-danger" style={{ fontSize: '10px' }}>Mặc định</span>}
                                                </div>
                                            </div>
                                            <button
                                                className="btn ms-2"
                                                style={{ transform: "scale(1)", fontSize: "13px" }}
                                                onClick={() => handleAddressUpdate(addr.id)} 
                                            >
                                                Update
                                            </button>
                                            <button className="btn ms-2" onClick={() => handleDeleteAddress(addr.id)} disabled={addr.status === true} style={{ transform: "scale(1)", fontSize: "13px" }}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="btn ms-2" style={{ transform: "scale(1)", fontSize: "13px" }} onClick={handleAddAddress}>Thêm địa chỉ mới</button>
                            <div className="modal-footer">
                                <ArgonButton className="btn btn-light" onClick={handleClose}>Trở Lại</ArgonButton>
                                <ArgonButton className="btn" onClick={handleComplete} style={{ fontSize: '14px' }}>Xác nhận</ArgonButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showBackup && (
                <Backup3
                    show={showBackup}
                    onClose={() => setShowBackup(false)}
                    onAddressUpdated={handleAddressUpdated}
                    addressId={backupAddress}
                />
            )}
            {showBackup1 && <Backup2 show={showBackup1} onClose={() => setShowBackup1(false)} onAddressUpdated={handleAddressUpdated} />}
        </>
    );
};

AddressSelection.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddressSelection;