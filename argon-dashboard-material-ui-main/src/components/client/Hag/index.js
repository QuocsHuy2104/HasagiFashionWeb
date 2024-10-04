import React, { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import "components/client/assets/css/style.css";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddressSelection from '../HasagiBackup1';
import Maps from '../HasagiMap/Map';
import SearchBox from '../HasagiMap/SearchBox';
const Backup2 = ({ show, onClose, onAddressUpdated}) => {
    const [fullNameAddress, setFullnameAddress] = useState('');
    const [naameOrder, setNameOrder] = useState('');
    const [numberPhone, setNumberphone] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');
    const [selectedProvince, setSelectedProvince] = useState(null); // Thêm state này
    const [selectedDistrict, setSelectedDistrict] = useState(null); // Thêm state này
    const [selectedWard, setSelectedWard] = useState(null); // Thêm state này
    const [cartItems, setCartItems] = useState([]);
    const [showTabs, setShowTabs] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const [status, setStatus] = useState(false);
    const [showAddressSelection , setshowAddressSelection] = useState(false);
    const [selectPosition, setSelectPosition] = useState(null);
    const [isAddressAvailable, setIsAddressAvailable] = useState(true);
    const [Address , setAddress] = useState('');
    // Kiểm tra địa chỉ có sẵn hay không
    useEffect(() => {
      
        const checkUserAddresses = async () => {
            try {
                const addressCheckResponse = await axios.get('http://localhost:3000/api/addresses/account', { withCredentials: true });
                const userHasAddresses = addressCheckResponse.data.length > 0;

                // Nếu người dùng chưa có địa chỉ, đặt status thành true (địa chỉ mặc định) và không cho phép chọn checkbox
                if (!userHasAddresses) {
                    setStatus(true);
                    setIsAddressAvailable(false);
                } else {
                    setIsAddressAvailable(true);
                }
            } catch (error) {
                console.error("Error checking user addresses:", error);
            }
        };

   
        checkUserAddresses();
    
       
    }, []);
    

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowTabs(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    
    const handleComplete = async () => {


        
        const formData = {
            fullNameAddress,
            numberPhone,
            provinceID: selectedProvince,
            districtCode: selectedDistrict,
            wardCode: selectedWard,
            status,
            address: Address,
            fullAddress:`${Address}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
        };
    
        try {
            const response = await axios.post('http://localhost:3000/api/addresses', formData, {
                withCredentials: true // Đặt withCredentials trong config
            });

    
          
            onClose();
            onAddressUpdated(); 
            <AddressSelection show={showAddressSelection} onClose={() => setshowAddressSelection(false)}/>
        } catch (error) {
            console.error("Error submitting address:", error);
        }
    };
    const handleCheckboxChange = (event) => {
        setStatus(event.target.checked); // Update status based on checkbox state
      };
    
    const handleInputClick = () => {
        setShowTabs(true);
    };

    const handleProvinceChange = (provinceName, provinceId) => {
        setProvinceName(provinceName); // Cập nhật tên tỉnh
        setSelectedProvince(provinceId); // Cập nhật ID tỉnh
    };
    
    
    
    const handleDistrictChange = (name, id) => {
        setDistrictName(name);
        setSelectedDistrict(id); // Cập nhật ID quận/huyện
    };
    
    const handleWardChange = (name, code) => {
        setWardName(name);
        setSelectedWard(code); // Cập nhật ID phường/xã
    };
    

    const handleClearClick = () => {
        setProvinceName('');
        setDistrictName('');
        setWardName('');
    };

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Địa chỉ mới</h5>
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
                                    onChange={(e) => setFullnameAddress(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>Số điện thoại</label>
                                <ArgonInput
                                    className="form-control"
                                    type="text"
                                    placeholder="0123 456 789"
                                    value={numberPhone}
                                    onChange={(e) => setNumberphone(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label>Địa chỉ cụ thể</label>
                                <ArgonInput
                                    className="form-control"
                                    type="text"
                                    placeholder="sỐ ĐƯỜNG"
                                    value={Address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label>Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</label>
                                <div className="custom-input-container">
                                    <ArgonInput
                                        className="form-control custom-input"
                                        placeholder="Chọn địa chỉ"
                                        value={
                                            [provinceName, districtName, wardName]
                                                .filter(Boolean)
                                                .join(", ")
                                        }
                                        onClick={handleInputClick}
                                    />
                                </div>
                                <input
                                type="checkbox"
                                checked={status}
                                onChange={handleCheckboxChange}
                                style={{ transform: "scale(1.5)", marginBottom: "0" }}
                            />


                            <label style={{ marginLeft: "10px", marginBottom: "0" }}>Address default</label>
                         
      
      
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

Backup2.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddressUpdated: PropTypes.func.isRequired,

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
        setSelectedProvince(provinceId); // Đặt ID của tỉnh đã chọn
        setSelectedDistrict(null); // Đặt lại quận/huyện khi chọn tỉnh mới
        setDistricts([]); // Xóa danh sách quận/huyện
        setWards([]); // Xóa danh sách phường/xã
        onSelectProvince(provinceName, provinceId);  // Gửi cả ID và tên tỉnh
        setValue(1); // Chuyển sang tab "Quận/Huyện"
    };
    
    
    
    const handleDistrictSelect = (districtId, districtName) => {
        setSelectedDistrict(districtId);
        onSelectDistrict(districtName, districtId); // Gửi cả ID
        setValue(2); // Tự động chuyển sang tab "Phường/Xã"
    };
    
    const handleWardSelect = (wardCode, wardName) => {
        onSelectWard(wardName, wardCode); // Gửi cả ID
        setShowTabs(false); // Tắt tab sau khi chọn xong phường/xã
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

export default Backup2;
