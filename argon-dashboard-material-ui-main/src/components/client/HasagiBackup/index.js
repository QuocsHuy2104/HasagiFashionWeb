import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "components/client/assets/css/phanloai1.css";
import Select from "react-select";
import AddressService from '../../../services/AddressServices';
import { useLocation } from 'react-router-dom';
const Backup = ({ show, onClose }) => {
    const [fullName, setFullName] = useState("");
    const [numberPhone, setNumBerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [status, setStatus] = useState(false);
    const [isAddressAvailable, setIsAddressAvailable] = useState(true);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false); // New state variable
    const navigate = useNavigate();
    const location = useLocation();

    const handleCheckboxChange = (event) => {
        setStatus(event.target.checked);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống.";
        } else if (fullName.trim().split(" ").length < 2) {
            newErrors.fullName = "Vui lòng điền Họ và Tên.";
        }
        if (!numberPhone.trim()) {
            newErrors.numberPhone = "Số điện thoại không được để trống.";
        } else if (!/^0\d{9}$/.test(numberPhone.trim())) {
            newErrors.numberPhone = "Số điện thoại không hợp lệ.";
        }
        if (!address.trim()) {
            newErrors.address = "Địa chỉ cụ thể không được để trống.";
        }
        if (!selectedProvince) {
            newErrors.selectedProvince = "Vui lòng chọn tỉnh/thành phố.";
        }
        if (!selectedDistrict) {
            newErrors.selectedDistrict = "Vui lòng chọn quận/huyện.";
        }
        if (!selectedWard) {
            newErrors.selectedWard = "Vui lòng chọn phường/xã.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    {
        isSubmitted && errors.selectedProvince && (
            <div className="text-danger">{errors.selectedProvince}</div>
        )
    }
    {
        isSubmitted && errors.selectedDistrict && (
            <div className="text-danger">{errors.selectedDistrict}</div>
        )
    }
    {
        isSubmitted && errors.selectedWard && (
            <div className="text-danger">{errors.selectedWard}</div>
        )
    }


    const handleInputClick = (field) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: "",
        }));
    };

    const handleFullNameChange = (e) => {
        const value = e.target.value;
        setFullName(value);

        if (isSubmitted) {
            setErrors((prevErrors) => ({ ...prevErrors, fullName: "" }));
        }
    };

    const handleFullNameBlur = () => {
        if (isSubmitted) {
            validateForm(); // Validate only when the field loses focus
        }
    };

    const handleNumberPhoneChange = (e) => {
        const value = e.target.value;
        setNumBerPhone(value);

        // Clear the specific error on change
        if (isSubmitted) {
            setErrors((prevErrors) => ({ ...prevErrors, numberPhone: "" }));
        }
    };

    const handleNumberPhoneBlur = () => {
        if (isSubmitted) {
            validateForm();
        }
    };


    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        if (isSubmitted) {
            setErrors((prevErrors) => ({ ...prevErrors, address: "" }));
        }
    };

    const handleAddressBlur = () => {
        if (isSubmitted) {
            validateForm(); // Validate only when the field loses focus
        }
    };


    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    { headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" } }
                );
                if (response.data && response.data.data) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
                alert("Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại.");
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");

        setErrors((prevErrors) => ({ ...prevErrors, selectedProvince: "" }));

        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                { headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" }, params: { province_id: provinceId } }
            );
            if (response.data && response.data.data) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
            alert("Không thể tải danh sách quận/huyện. Vui lòng thử lại.");
        }
    };

    const handleDistrictChange = async (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedWard("");

        setErrors((prevErrors) => ({ ...prevErrors, selectedDistrict: "" }));

        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                { headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" }, params: { district_id: districtId } }
            );
            if (response.data && response.data.data) {
                setWards(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
            alert("Không thể tải danh sách phường/xã. Vui lòng thử lại.");
        }
    };

    const handleComplete = async () => {
        setIsSubmitted(true);
        const isMenuPage = location.pathname === '/profile' || location.pathname === '/History';

        const isValid = validateForm();
        if (!isValid) return;

        const formData = {
            fullName,
            numberPhone,
            address,
            status,
            provinceID: selectedProvince,
            districtCode: selectedDistrict,
            wardCode: selectedWard,
        };

        try {
            const response = await AddressService.createAddressFirst(formData);

            if (response && response.data && response.data.id) {
                if (!isMenuPage) {
                    const newAddressId = response.data.id;
                    onClose();
                    navigate(`/Checkout?id=${newAddressId}`);
                } else {
                    onClose();
                }
            } else {
                console.log("Invalid response structure or missing ID:", response);
                alert("Không thể lưu địa chỉ. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error submitting address:", error);
            alert("Không thể lưu địa chỉ. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        const checkUserAddresses = async () => {
            try {
                const response = await AddressService.getAllAddress();
                const userHasAddresses = response.data.length > 0;
                setIsAddressAvailable(userHasAddresses);
                if (!userHasAddresses) setStatus(true);
            } catch (error) {
            }
        };
        checkUserAddresses();
    }, []);

    const provinceOptions = provinces.map((province) => ({
        value: province.ProvinceID,
        label: province.ProvinceName,
    }));

    const districtOptions = districts.map((district) => ({
        value: district.DistrictID,
        label: district.DistrictName,
    }));

    const wardOptions = wards.map((ward) => ({
        value: ward.WardCode,
        label: ward.WardName,
    }));

    const resetForm = () => {
        setFullName("");
        setNumBerPhone("");
        setAddress("");
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setErrors({});
        setIsSubmitted(false);
        setDistricts([]);
        setWards([]);
    };

    const handleModalClose = () => {
        resetForm(); // Reset form data
        onClose(); // Close the modal
    };
    const customStylesProvince = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: "250px", // Chiều cao tối đa của danh sách dropdown
            overflowY: "auto", // Bật thanh cuộn dọc
        }),
        // Tùy chỉnh thanh cuộn trên trình duyệt hỗ trợ Webkit (Chrome, Edge, Safari)
        menuListScroll: {
            "::-webkit-scrollbar": {
                width: "6px",
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
            },
            "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
            },
        },
    };

    const customStylesDistrict = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: "190px", // Chiều cao tối đa của danh sách dropdown
            overflowY: "auto", // Bật thanh cuộn dọc
        }),
        // Tùy chỉnh thanh cuộn trên trình duyệt hỗ trợ Webkit (Chrome, Edge, Safari)
        menuListScroll: {
            "::-webkit-scrollbar": {
                width: "6px",
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
            },
            "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
            },
        },
    };

    const customStylesWard = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: "130px", // Chiều cao tối đa của danh sách dropdown
            overflowY: "auto", // Bật thanh cuộn dọc
        }),
        // Tùy chỉnh thanh cuộn trên trình duyệt hỗ trợ Webkit (Chrome, Edge, Safari)
        menuListScroll: {
            "::-webkit-scrollbar": {
                width: "6px",
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
            },
            "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
            },
        },
    };
    if (!show) return null;

    return (
        <div className="modal1">
            <div className="modal1-dialog">
                <div className="modal1-content">
                    <div className="modal1-header">
                        <h5 className="modal1-title">Địa chỉ mới</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal1-body p-4">
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <ArgonInput
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    onBlur={handleFullNameBlur} // Validate on blur
                                    onClick={() => handleInputClick("fullName")}
                                    onFocus={() => handleInputClick("fullName")} // Xóa lỗi khi focus vào input
                                    className={errors.fullName ? "border-danger" : ""}
                                    style={{
                                        color: errors.fullName ? 'red' : 'black',
                                        fontWeight: errors.fullName ? 'bold' : 'normal',
                                    }}
                                />
                                {isSubmitted && errors.fullName && (
                                    <div className="text-danger">{errors.fullName}</div>
                                )}
                            </div>
                            <div className="col-md-6 form-group">
                                <ArgonInput
                                    type="text"
                                    name="numberPhone"
                                    placeholder="Số điện thoại"
                                    value={numberPhone}
                                    onChange={handleNumberPhoneChange}
                                    onBlur={handleNumberPhoneBlur} // Validate on blur
                                    onClick={() => handleInputClick("numberPhone")}
                                    onFocus={() => handleInputClick("numberPhone")}
                                    className={errors.numberPhone ? "border-danger" : ""}
                                    style={{
                                        color: errors.numberPhone ? 'red' : 'black',
                                        fontWeight: errors.numberPhone ? 'bold' : 'normal',
                                    }}
                                />
                                {isSubmitted && errors.numberPhone && (
                                    <div className="text-danger">{errors.numberPhone}</div>
                                )}
                            </div>
                            <div className="col-md-12 form-group">
                                <ArgonInput
                                    type="text"
                                    name="address"
                                    placeholder="Địa chỉ cụ thể"
                                    value={address}
                                    onChange={handleAddressChange}
                                    onBlur={handleAddressBlur} // Validate on blur
                                    onClick={() => handleInputClick("address")}
                                    onFocus={() => handleInputClick("address")} // Xóa lỗi khi focus vào input
                                    className={errors.address ? "border-danger" : ""}
                                    style={{
                                        color: errors.address ? 'red' : 'black',
                                        fontWeight: errors.address ? 'bold' : 'normal',
                                    }}
                                />
                                {isSubmitted && errors.address && (
                                    <div className="text-danger">{errors.address}</div>
                                )}
                            </div>
                            <div className="col-md-12 form-group">
                                <Select
                                    styles={customStylesProvince}
                                    placeholder="Chọn tỉnh/thành phố"
                                    value={provinceOptions.find((option) => option.value === selectedProvince)}
                                    onChange={(option) => {
                                        handleProvinceChange(option.value);
                                        // Clear any errors related to province selection when a new province is selected
                                        setErrors((prevErrors) => ({ ...prevErrors, selectedProvince: "" }));
                                    }}
                                    options={provinceOptions}
                                />
                                {isSubmitted && errors.selectedProvince && (
                                    <div className="text-danger">{errors.selectedProvince}</div>
                                )}
                            </div>
                            <div className="col-md-12 form-group">
                                <Select
                                    styles={customStylesDistrict}
                                    placeholder="Chọn quận/huyện"
                                    value={districtOptions.find((option) => option.value === selectedDistrict)}
                                    onChange={(option) => {
                                        handleDistrictChange(option.value);
                                        // Clear any errors related to district selection when a new district is selected
                                        setErrors((prevErrors) => ({ ...prevErrors, selectedDistrict: "" }));
                                    }}
                                    options={districtOptions}
                                    isDisabled={!selectedProvince}
                                />
                                {isSubmitted && errors.selectedDistrict && (
                                    <div className="text-danger">{errors.selectedDistrict}</div>
                                )}
                            </div>
                            <div className="col-md-12 form-group">
                                <Select
                                    styles={customStylesWard}
                                    placeholder="Chọn phường/xã"
                                    value={wardOptions.find((option) => option.value === selectedWard)}
                                    onChange={(option) => {
                                        setSelectedWard(option.value);
                                        // Clear any errors related to ward selection when a new ward is selected
                                        setErrors((prevErrors) => ({ ...prevErrors, selectedWard: "" }));
                                    }}
                                    options={wardOptions}
                                    isDisabled={!selectedDistrict}
                                />
                                {isSubmitted && errors.selectedWard && (
                                    <div className="text-danger">{errors.selectedWard}</div>
                                )}
                            </div>
                            <label style={{ marginLeft: "10px" }}>
                                Đặt làm địa chỉ mặc định
                                <input
                                    type="checkbox"
                                    checked={status}
                                    onChange={handleCheckboxChange}
                                    disabled={!isAddressAvailable}
                                    style={{ transform: "scale(1.5)", marginLeft: "10px" }}
                                />
                            </label>
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <ArgonButton onClick={handleModalClose}>Trở lại</ArgonButton>
                            <ArgonButton className="btn btn-primary" onClick={handleComplete}>
                                Hoàn thành
                            </ArgonButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Backup.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Backup;
