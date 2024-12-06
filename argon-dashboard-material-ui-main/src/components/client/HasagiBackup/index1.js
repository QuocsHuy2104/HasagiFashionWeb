import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Backup3 from './index3';
import Backup2 from './index2';
import { ToastContainer } from 'react-toastify';
import AddressService from '../../../services/AddressServices';

const AddressSelection = ({ show, onClose }) => {
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [districts, setDistricts] = useState({});
    const [wards, setWards] = useState({});
    const [loading, setLoading] = useState(true);
    const [showBackup, setShowBackup] = useState(false);
    const [showBackup1, setShowBackup1] = useState(false);
    const [backupAddress, setBackupAddress] = useState(null);
    const navigate = useNavigate();

    const fetchAddress = async () => {
        try {
            setLoading(true);
            const response = await AddressService.getAllAddress();
            let addresses = response.data;

            // Fetching the province, district, and ward names directly from the GHN API
            for (const addr of addresses) {
                // Fetch province name
                const provinceData = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                    headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' }
                });
                const province = provinceData.data.data.find(p => p.ProvinceID === Number(addr.provinceID));
                addr.provinceName = province ? province.ProvinceName : 'Không xác định';

                // Fetch district name
                const districtData = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                    headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' },
                    params: { province_id: addr.provinceID }
                });
                const district = districtData.data.data.find(d => d.DistrictID === Number(addr.districtCode));
                addr.districtName = district ? district.DistrictName : 'Không xác định';

                // Fetch ward name
                const wardData = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                    headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' },
                    params: { district_id: addr.districtCode }
                });
                const ward = wardData.data.data.find(w => w.WardCode === String(addr.wardCode));
                addr.wardName = ward ? ward.WardName : 'Không xác định';
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


    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' },
                params: { province_id: provinceId }
            });
            setDistricts(prev => ({ ...prev, [provinceId]: response.data.data }));
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error fetching districts:", error);
            }
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                headers: { 'Token': '2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d' },
                params: { district_id: districtId }
            });
            setWards(prev => ({ ...prev, [districtId]: response.data.data }));
        } catch (error) {
            // Only log the error in development mode
            if (process.env.NODE_ENV === 'development') {
                console.error("Error fetching wards:", error);
            }
        }
    };


    if (!show && !showBackup) return null;

    return (
        <>
            <ToastContainer />
            {show && !showBackup && !showBackup1 && (
                <div className="modal" style={{ display: show ? 'block' : 'none' }}>
                    <div className="modal-dialog" style={{ marginTop: "92px" }}>
                        <div className="modal-content" style={{ fontSize: '14px', width: '600px' }}>
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ fontSize: '16px' }}>Địa Chỉ Của Tôi</h5>
                            </div>
                            <div className="modal-body">
                                <div>
                                    {address.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className="d-flex align-items-center justify-content-between"
                                            style={{
                                                padding: '10px 15px',
                                                borderBottom: '1px solid #f0f0f0',
                                                background: selectedAddress === addr.id ? '#f9f9f9' : '#fff',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddress === addr.id}
                                                    onChange={() => handleAddressChange(addr.id, addr.provinceID, addr.districtCode)}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {addr.fullName} <span style={{ fontSize: '12px' }}>({addr.numberPhone})</span>
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {addr.address}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                                                    </div>
                                                    {addr.status && (
                                                        <span className="badge bg-danger" style={{ fontSize: '10px', marginTop: '5px' }}>
                                                            Mặc định
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-link text-primary"
                                                style={{ fontSize: '13px', padding: '0' }}
                                                onClick={() => handleAddressUpdate(addr.id)}
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleAddAddress}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#fff',
                                        color: '#666',
                                        fontSize: '14px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        marginTop: "10px"
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#f9f9f9';
                                        e.target.style.borderColor = '#999';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.borderColor = '#ccc';
                                    }}
                                >
                                    <span style={{ fontSize: '18px', marginRight: '8px', fontWeight: 'bold' }}>+</span>
                                    Thêm Địa Chỉ Mới
                                </button>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    className="btn btn-light"
                                    onClick={handleClose}
                                    style={{ fontSize: '14px' }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn"
                                    onClick={handleComplete}
                                    style={{ fontSize: '14px', backgroundColor: "#E64A19", color: "white" }}
                                >
                                    Xác nhận
                                </button>
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