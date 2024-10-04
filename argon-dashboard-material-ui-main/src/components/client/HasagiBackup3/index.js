import React, { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import "components/client/assets/css/phanloai1.css";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Cookies from "js-cookie";
const Backup3 = ({ show, onClose, onAddressUpdated, addressId }) => {
    const [fullNameAddress, setFullNameAddress] = useState('');
    const [numberPhone, setNumBerPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);    
    const [status, setStatus] = useState(false);
    const [showTabs, setShowTabs] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const wrapperRef = useRef(null);

    const fetchAddressById = async () => {
        try {
            if (addressId) {
                const response = await axios.get(`http://localhost:3000/api/addresses/${addressId}`);
                const addressData = response.data;
                setFullNameAddress(addressData.fullNameAddress);
                setNumBerPhone(addressData.numberPhone);
                setAddress(addressData.address);
                setSelectedProvince(addressData.provinceID);
                setSelectedDistrict(addressData.districtCode);
                setSelectedWard(addressData.wardCode);
                setStatus(addressData.status);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    useEffect(() => {
        if (addressId) {
            fetchAddressById();
        }
    }, [addressId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowTabs(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetchWards(selectedDistrict);
        }
    }, [selectedDistrict]);

    const handleComplete = async () => {
        const accountId = Cookies.get('accountId'); 
        const formData = {
            fullNameAddress,
            numberPhone,
            provinceID: selectedProvince,
            districtCode: selectedDistrict,
            wardCode: selectedWard,
            status,
            address,
        };
        try {
            await axios.put(`http://localhost:3000/api/addresses/update/${addressId}?accountId=${accountId}`, formData, {
                withCredentials: true
            });
            onClose();
            onAddressUpdated();
        } catch (error) {
            console.error("Error submitting address:", error);
        }
    };

    const handleCheckboxChange = (event) => {
        setStatus(event.target.checked);
    };

    const handleInputClick = () => {
        setShowTabs(true);
    };

    const handleProvinceChange = (provinceName, provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict(null);
        setSelectedWard(null);
        fetchDistricts(provinceId);
    };

    const handleDistrictChange = (name, id) => {
        setSelectedDistrict(id);
        setSelectedWard(null);
        fetchWards(id);
    };

    const handleWardChange = (name, code) => {
        setSelectedWard(code);
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
    };

    if (!show) return null;

    return (
        <div className="modal1">
            <div className="modal1-dialog">
                <div className="modal1-content">
                    <div className="modal1-header">
                        <h5 className="modal1-title">Cập nhật địa chỉ</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4" ref={wrapperRef}>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label>Họ và tên</label>
                                <ArgonInput
                                    className="form-control"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={fullNameAddress}
                                    onChange={(e) => setFullNameAddress(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>Số điện thoại</label>
                                <ArgonInput
                                    className="form-control"
                                    type="text"
                                    placeholder="0123 456 789"
                                    value={numberPhone}
                                    onChange={(e) => setNumBerPhone(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label>Địa chỉ chi tiết</label>
                                <ArgonInput
                                    className="form-control"
                                    type="text"
                                    placeholder="0123 456 789"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label>Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</label>
                                <div className="custom-input-container">
                                    <ArgonInput
                                        className="form-control custom-input"
                                        placeholder="Chọn địa chỉ"
                                        value={[getAddressNameById(selectedProvince, provinces, 'province'),
                                            getAddressNameById(selectedDistrict, districts, 'district'),
                                            getAddressNameById(selectedWard, wards, 'ward')]
                                            .filter(Boolean)
                                            .join(", ")}
                                        onClick={handleInputClick}
                                    />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={status}
                                    onChange={handleCheckboxChange}
                                    style={{ transform: "scale(1.5)", marginBottom: "0" }}
                                />
                                <label style={{ marginLeft: "10px", marginBottom: "0" }}>Đặt làm địa chỉ mặc định</label>        
                                {showTabs && (
                                    <BasicTabs
                                        onSelectProvince={handleProvinceChange}
                                        onSelectDistrict={handleDistrictChange}
                                        onSelectWard={handleWardChange}
                                        setShowTabs={setShowTabs}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                        <ArgonButton className="btn btn-light" onClick={onClose}>Trở Lại</ArgonButton>
                        <ArgonButton className="btn btn-primary" onClick={handleComplete}>Hoàn thành</ArgonButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Backup3.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddressUpdated: PropTypes.func.isRequired,
    addressId: PropTypes.string.isRequired,
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function BasicTabs({ onSelectProvince, onSelectDistrict, onSelectWard, setShowTabs }) {
    const [value, setValue] = useState(0);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                    headers: {
                        'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f'
                    }
                });
                console.log(response.data.data); // Log dữ liệu nhận được để kiểm tra
                setProvinces(response.data.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                        headers: {
                            'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f'
                        },
                        params: {
                            province_id: selectedProvince
                        }
                    });
                    setDistricts(response.data.data);
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                        headers: {
                            'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f'
                        },
                        params: {
                            district_id: selectedDistrict
                        }
                    });
                    setWards(response.data.data);
                } catch (error) {
                    console.error("Error fetching wards:", error);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleProvinceSelect = (provinceId, provinceName) => {
        setSelectedProvince(provinceId); 
        setSelectedDistrict(null); 
        setDistricts([]);
        setWards([]); // Xóa danh sách phường/xã
        onSelectProvince(provinceName, provinceId);
        setValue(1);
    };

    const handleDistrictSelect = (districtId, districtName) => {
        setSelectedDistrict(districtId);
        onSelectDistrict(districtName, districtId);
        setValue(2);
    };

    const handleWardSelect = (wardCode, wardName) => {
        onSelectWard(wardName, wardCode);
        setShowTabs(false);
    };


    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Tỉnh/Thành phố" {...a11yProps(0)} />
                <Tab label="Quận/Huyện" {...a11yProps(1)} />
                <Tab label="Phường/Xã" {...a11yProps(2)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {provinces.length > 0 ? (
                        <ul>
                            {provinces.map((province) => (
                                <li key={province.ProvinceID} onClick={() => handleProvinceSelect(province.ProvinceID, province.ProvinceName)}>
                                    {province.ProvinceName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {districts.length > 0 ? (
                        <ul>
                            {districts.map((district) => (
                                <li key={district.DistrictID} onClick={() => handleDistrictSelect(district.DistrictID, district.DistrictName)}>
                                    {district.DistrictName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Vui lòng chọn tỉnh/thành phố để xem quận/huyện.</p>
                    )}
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {wards.length > 0 ? (
                        <ul>
                            {wards.map((ward) => (
                                <li key={ward.WardCode} onClick={() => handleWardSelect(ward.WardCode, ward.WardName)}>
                                    {ward.WardName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Vui lòng chọn quận/huyện để xem phường/xã.</p>
                    )}
                </Box>
            </CustomTabPanel>
        </Box>
    );
}

BasicTabs.propTypes = {
    onSelectProvince: PropTypes.func.isRequired,
    onSelectDistrict: PropTypes.func.isRequired,
    onSelectWard: PropTypes.func.isRequired,
    setShowTabs: PropTypes.func.isRequired,
};

export default Backup3;