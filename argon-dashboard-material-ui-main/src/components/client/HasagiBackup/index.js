import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "components/client/assets/css/phanloai1.css";
import Select from "react-select";

const Backup = ({ show, onClose }) => {
  const [fullName, setFullname] = useState("");
  const [numberPhone, setNumBerPHone] = useState("");
  const [address, setAddress] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [isAddressAvailable, setIsAddressAvailable] = useState(true);

  const handleCheckboxChange = (event) => {
    setStatus(event.target.checked);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            headers: {
              Token: "8d0588cd-65d9-11ef-b3c4-52669f455b4f",
            },
          }
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setSelectedWard("");

    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          headers: {
            Token: "8d0588cd-65d9-11ef-b3c4-52669f455b4f",
          },
          params: { province_id: provinceId },
        }
      );
      setDistricts(response.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedWard("");

    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        {
          headers: {
            Token: "8d0588cd-65d9-11ef-b3c4-52669f455b4f",
          },
          params: { district_id: districtId },
        }
      );
      setWards(response.data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleComplete = async () => {
    const formData = {
      fullName,
      numberPhone,
      address,
      provinceID: selectedProvince,
      districtCode: selectedDistrict,
      wardCode: selectedWard,
      fullAddress: `${address}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
    };
    const accountId = Cookies.get("accountId");
    if (!accountId) {
      console.error("Account ID is missing");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/addresses/create?accountId=${accountId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      const newAddressId = response.data.id;
      onClose();
      navigate(`/Checkout?id=${newAddressId}`);
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  useEffect(() => {
    const checkUserAddresses = async () => {
      try {
        const accountId = Cookies.get("accountId"); // Get accountId from cookies or wherever it's stored
        if (!accountId) {
          console.error("Account ID is missing");
          return;
        }

        // Make the API request with accountId as a query parameter
        const addressCheckResponse = await axios.get(
          `http://localhost:3000/api/addresses/account?accountId=${accountId}`,
          { withCredentials: true }
        );

        const userHasAddresses = addressCheckResponse.data.length > 0;

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

  //chọn tỉnh thành phố
  const provinceOptions = provinces.map((province) => ({
    value: province.ProvinceID,
    label: province.ProvinceName,
  }));

  //chọn quận/huyện
  const districtOptions = districts.map((district) => ({
    value: district.DistrictID,
    label: district.DistrictName,
  }));

  //phường xã
  const wardOptions = wards.map((ward) => ({
    value: ward.WardCode,
    label: ward.WardName,
  }));

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
                <label>Họ và tên</label>
                <ArgonInput
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Số điện thoại</label>
                <ArgonInput
                  type="text"
                  placeholder="0123 456 789"
                  value={numberPhone}
                  onChange={(e) => setNumBerPHone(e.target.value)}
                />
              </div>
              <div className="col-md-12 form-group">
                <label>Địa chỉ cụ thể</label>
                <ArgonInput
                  type="text"
                  placeholder="Số đường"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Select tỉnh/thành phố */}
              <div className="col-md-12 form-group">
                <label>Tỉnh/Thành phố</label>
                <Select
                  className="province-select"
                  value={provinceOptions.find((option) => option.value === selectedProvince)} // Hiển thị giá trị đã chọn
                  onChange={(selectedOption) => handleProvinceChange(selectedOption.value)} // Gọi hàm với value của tùy chọn
                  options={provinceOptions} // Danh sách tỉnh/thành phố
                  placeholder="Chọn tỉnh/thành phố"
                  isSearchable
                />
              </div>

              {/* Select quận/huyện */}
              <div className="col-md-12 form-group">
                <label>Quận/Huyện</label>
                <Select
                  className="district-select"
                  value={districtOptions.find((option) => option.value === selectedDistrict)} // Hiển thị giá trị đã chọn
                  onChange={(selectedOption) => handleDistrictChange(selectedOption.value)} // Gọi hàm khi chọn giá trị mới
                  options={districtOptions} // Danh sách quận/huyện
                  placeholder="Chọn quận/huyện"
                  isDisabled={!selectedProvince} // Vô hiệu hóa nếu chưa chọn tỉnh
                  isSearchable // Cho phép tìm kiếm
                />
              </div>

              {/* Select phường/xã */}
              <div className="col-md-12 form-group">
                <label>Phường/Xã</label>
                <Select
                  className="ward-select"
                  value={wardOptions.find((option) => option.value === selectedWard)} // Hiển thị giá trị đã chọn
                  onChange={(selectedOption) => setSelectedWard(selectedOption.value)} // Cập nhật phường/xã khi chọn
                  options={wardOptions} // Danh sách phường/xã
                  placeholder="Chọn phường/xã"
                  isDisabled={!selectedDistrict} // Vô hiệu hóa nếu chưa chọn quận/huyện
                  isSearchable // Cho phép tìm kiếm
                />
              </div>
              <input
                type="checkbox"
                checked={status}
                onChange={handleCheckboxChange}
                disabled={!isAddressAvailable}
                style={{ transform: "scale(1.5)", marginBottom: "0" }}
              />
              <label style={{ marginLeft: "10px", marginBottom: "0" }}>Select All</label>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <ArgonButton className="btn btn-light" onClick={() => onClose()}>
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

Backup.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Backup;
