import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "components/client/assets/css/phanloai1.css";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import axios from "axios";
import Select from "react-select";
import AddressService from "../../../services/AddressServices";

const Backup3 = ({ show, onClose, onAddressUpdated, addressId }) => {
    const [fullName, setFullName] = useState("");
    const [numberPhone, setNumBerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [status, setStatus] = useState(false);
    const [showTabs, setShowTabs] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const wrapperRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(true);
    const [disabled, setDisabled] = useState(false);

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
        );
    }
    {
        isSubmitted && errors.selectedDistrict && (
            <div className="text-danger">{errors.selectedDistrict}</div>
        );
    }
    {
        isSubmitted && errors.selectedWard && <div className="text-danger">{errors.selectedWard}</div>;
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
            validateForm();
        }
    };

    const handleNumberPhoneChange = (e) => {
        const value = e.target.value;
        setNumBerPhone(value);

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
            validateForm();
        }
    };

    const fetchAddressById = async () => {
        try {
            if (addressId) {
                const response = await axios.get(`http://localhost:3000/api/addresses/${addressId}`);
                const addressData = response.data;
                setFullName(addressData.fullName);
                setNumBerPhone(addressData.numberPhone);
                setAddress(addressData.address);
                setSelectedProvince(addressData.provinceID);
                setSelectedDistrict(addressData.districtCode);
                setSelectedWard(addressData.wardCode);
                setStatus(addressData.status);
                if (addressData.status) {
                    setDisabled(true);
                }
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
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                {
                    headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
                }
            );
            setProvinces(response.data.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                {
                    headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
                    params: { province_id: provinceId },
                }
            );
            setDistricts(response.data.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                {
                    headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
                    params: { district_id: districtId },
                }
            );
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
        setIsSubmitted(true);

        const isValid = validateForm();
        if (!isValid) return;

        const formData = {
            fullName,
            numberPhone,
            provinceID: selectedProvince,
            districtCode: selectedDistrict,
            wardCode: selectedWard,
            status,
            address,
        };
        try {
            await AddressService.updateAddress(addressId, formData);
            onClose();
            onAddressUpdated();
        } catch (error) {
            console.error("Error submitting address:", error);
        }
    };

    const handleCheckboxChange = (e) => {
        setStatus(e.target.checked); // Cập nhật trạng thái mặc định
        if (e.target.checked) {
            setShowCheckbox(true);
        }
    };

    const handleProvinceChange = (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");
        fetchDistricts(provinceId);
        setErrors((prevErrors) => ({ ...prevErrors, selectedProvince: "" }));
    };

    const handleDistrictChange = (id) => {
        setSelectedDistrict(id);
        setSelectedWard("");
        fetchWards(id);
        setErrors((prevErrors) => ({ ...prevErrors, selectedDistrict: "" }));
    };

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
        resetForm();
        onClose();
    };

    const customStylesProvince = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: "225px",
            overflowY: "auto",
        }),
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
            maxHeight: "160px",
            overflowY: "auto",
        }),
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
            maxHeight: "100px",
            overflowY: "auto",
        }),
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
                        <h5 className="modal1-title">Cập nhật địa chỉ</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4" ref={wrapperRef}>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <ArgonInput
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    onBlur={handleFullNameBlur}
                                    onClick={() => handleInputClick("fullName")}
                                    onFocus={() => handleInputClick("fullName")}
                                    className={errors.fullName ? "border-danger" : ""}
                                    style={{
                                        color: errors.fullName ? "red" : "black",
                                        fontWeight: errors.fullName ? "bold" : "normal",
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
                                    onBlur={handleNumberPhoneBlur}
                                    onClick={() => handleInputClick("numberPhone")}
                                    onFocus={() => handleInputClick("numberPhone")}
                                    className={errors.numberPhone ? "border-danger" : ""}
                                    style={{
                                        color: errors.numberPhone ? "red" : "black",
                                        fontWeight: errors.numberPhone ? "bold" : "normal",
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
                                    onBlur={handleAddressBlur}
                                    onClick={() => handleInputClick("address")}
                                    onFocus={() => handleInputClick("address")}
                                    className={errors.address ? "border-danger" : ""}
                                    style={{
                                        color: errors.address ? "red" : "black",
                                        fontWeight: errors.address ? "bold" : "normal",
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
                                    className="province-select"
                                    value={provinceOptions.find((option) => option.value == selectedProvince)}
                                    onChange={(selectedOption) => {
                                        handleProvinceChange(selectedOption.value);
                                        setErrors((prevErrors) => ({ ...prevErrors, selectedProvince: "" }));
                                    }}
                                    options={provinceOptions}
                                    isSearchable
                                />
                                {isSubmitted && errors.selectedProvince && (
                                    <div className="text-danger">{errors.selectedProvince}</div>
                                )}
                            </div>
                            <div className="col-md-12 form-group">
                                <Select
                                    styles={customStylesDistrict}
                                    className="district-select"
                                    value={districtOptions.find((option) => option.value == selectedDistrict)}
                                    onChange={(selectedOption) => {
                                        handleDistrictChange(selectedOption.value);
                                        setErrors((prevErrors) => ({ ...prevErrors, selectedDistrict: "" }));
                                    }}
                                    options={districtOptions}
                                    placeholder="Chọn quận/huyện"
                                    isDisabled={!selectedProvince}
                                    isSearchable
                                />
                                {isSubmitted && errors.selectedDistrict && (
                                    <div className="text-danger">{errors.selectedDistrict}</div>
                                )}
                            </div>
                            <div className="col-md-12 form-group">
                                <Select
                                    styles={customStylesWard}
                                    className="ward-select"
                                    value={wardOptions.find((option) => option.value === selectedWard)}
                                    onChange={(selectedOption) => {
                                        setSelectedWard(selectedOption.value);
                                        setErrors((prevErrors) => ({ ...prevErrors, selectedWard: "" }));
                                    }}
                                    options={wardOptions}
                                    placeholder="Chọn phường/xã"
                                    isDisabled={!selectedDistrict}
                                    isSearchable
                                />
                                {isSubmitted && errors.selectedWard && (
                                    <div className="text-danger">{errors.selectedWard}</div>
                                )}
                            </div>
                            {/* {!status && (
                <label style={{ marginLeft: "10px", marginBottom: "0" }}>
                  Đặt làm địa chỉ mặc định
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={handleCheckboxChange}
                    style={{ transform: "scale(1.5)", marginBottom: "0", marginLeft: "10px" }}
                  />
                </label>
              )} */}
                            {showCheckbox && (
                                <label style={{ marginLeft: "10px", marginBottom: "0" }}>
                                    Đặt làm địa chỉ mặc định
                                    <input
                                        type="checkbox"
                                        checked={status}
                                        onChange={handleCheckboxChange}
                                        disabled={disabled}
                                        style={{ transform: "scale(1.5)", marginBottom: "0", marginLeft: "10px" }}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <ArgonButton className="btn btn-light" onClick={handleModalClose}>
                                Trở Lại
                            </ArgonButton>
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

Backup3.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddressUpdated: PropTypes.func.isRequired,
    addressId: PropTypes.string.isRequired,
};

export default Backup3;
