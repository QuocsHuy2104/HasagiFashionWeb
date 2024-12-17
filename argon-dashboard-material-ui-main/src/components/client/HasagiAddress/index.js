import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer} from "react-toastify";
import AddressService from "../../../services/AddressServices";
import Backup3 from "../HasagiBackup/index3";
import Backup2 from "../HasagiBackup/index2";
import Backup from "../HasagiBackup/index";
import Swal from "sweetalert2";
const AddressPage = () => {
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [districts, setDistricts] = useState({});
  const [wards, setWards] = useState({});
  const [backupAddress, setBackupAddress] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showBackup1, setShowBackup1] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const fetchAddress = async () => {
    try {
      const response = await AddressService.getAllAddress();
      const addressReponse = await AddressService.getAddress();
      setAccountExists(addressReponse.data.exists);
      let addresses = response.data;

      for (const addr of addresses) {
        const provinceData = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
          {
            headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
          }
        );
        const province = provinceData.data.data.find(
          (p) => p.ProvinceID === Number(addr.provinceID)
        );
        addr.provinceName = province ? province.ProvinceName : "Không xác định";
        const districtData = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
          {
            headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
            params: { province_id: addr.provinceID },
          }
        );
        const district = districtData.data.data.find(
          (d) => d.DistrictID === Number(addr.districtCode)
        );
        addr.districtName = district ? district.DistrictName : "Không xác định";
        const wardData = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
          {
            headers: { Token: "2bd710e9-8c4e-11ef-9b94-5ef2ee6a743d" },
            params: { district_id: addr.districtCode },
          }
        );
        const ward = wardData.data.data.find((w) => w.WardCode === String(addr.wardCode));
        addr.wardName = ward ? ward.WardName : "Không xác định";
      }

      const defaultAddress = addresses.find((addr) => addr.status);
      if (defaultAddress) {
        addresses = [defaultAddress, ...addresses.filter((addr) => addr.id !== defaultAddress.id)];
        setSelectedAddress(defaultAddress.id);
      }
      setAddress(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleAddressUpdated = () => {
    fetchAddress();
  };

  useEffect(() => {
    if (selectedAddress) {
      const selectedAddr = address.find((addr) => addr.id === selectedAddress);
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

  const handleAddressUpdate = (id) => {
    setBackupAddress(id);
    setShowBackup(true);
  };

  const handleAddAddress = () => {
    if (!accountExists) {
      setShowBackupModal(true);
    } else {
      setShowBackup1(true);
    }
  };

  const handleCloseBackupModal = () => {
    setShowBackupModal(false);
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
      setDistricts((prev) => ({ ...prev, [provinceId]: response.data.data }));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching districts:", error);
      }
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
      setWards((prev) => ({ ...prev, [districtId]: response.data.data }));
    } catch (error) {
      // Only log the error in development mode
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching wards:", error);
      }
    }
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      color: "#333",
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    title: {
      fontSize: "20px",
      margin: 0,
    },
    addButton: {
      padding: "10px 20px",
      backgroundColor: isHovered ? "#d84939" : "#f05340",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s ease",
    },
    addressDetails: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "20px",
      borderBottom: "1px solid #eee", // Add a separator for clarity
      paddingBottom: "10px",
    },
    addressInfo: {
      fontSize: "16px",
      lineHeight: "1.5",
      flex: "1",
    },
    phone: {
      marginLeft: "10px",
      color: "#888",
    },
    defaultLabel: {
      padding: "1px 6px",
      color: "red",
      border: "1px solid red",
      borderRadius: "none",
      fontSize: "15px",
      marginTop: "5px",
      textAlign: "center",
      width: "75px",
    },
    actionContainer: {
      display: "block",
      gap: "5px",
      textAlign: "right",
      marginTop: "20px"
    },
    actionLinks: {
      color: "#007bff",
      textDecoration: "none",
      cursor: "pointer",
      marginRight: "10px",
      fontSize: "14px",
    },
    setDefaultButton: {
      padding: "5px 10px",
      border: "1px solid #ccc",
      borderRadius: "0px",
      cursor: "pointer",
      fontSize: "14px",
      color: "#888",
      backgroundColor: "white",
    },
    noAddress: {
      textAlign: "center",
      marginTop: "50px",
      color: "#888",
    },
    noAddressIcon: {
      fontSize: "50px",
      color: "#ddd",
    },
  };

  const handleDeleteAddress = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-2",
        cancelButton: "btn btn-danger mx-2",
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: "Bạn chắc chắn xóa địa chỉ này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Không, hủy!",
      reverseButtons: true,
      scrollbarPadding: false,
      didOpen: () => {
        document.body.style.overflowY = "auto";
        document.body.style.padding = "0";
      },
      willClose: () => {
        document.body.style.overflowY = "auto";
        document.body.style.padding = "0";
      },
    });

    if (result.isConfirmed) {
      try {
        await AddressService.removeAddress(id);

        fetchAddress();
        swalWithBootstrapButtons.fire("Đã xóa!", "Địa chỉ đã được xóa.", "success");
      } catch (error) {
        swalWithBootstrapButtons.fire("Thất bại!", "Không thể xóa địa chỉ.", "error");
      }
    }
    document.body.style.padding = "0";
    document.body.style.overflowY = "auto";
  };

  return (
    <>
      <ToastContainer />
      <div style={styles.container}>
        <div style={styles.header}>
          <h4 style={styles.title}>Địa chỉ của tôi</h4>
          <button
            style={styles.addButton}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            onClick={handleAddAddress}
          >
            + Thêm địa chỉ mới
          </button>
        </div>
        <hr style={{ marginTop: "-1%" }} />

        {address.length > 0 ? (
          address.map((address, index) => (
            <div key={index} style={styles.addressDetails}>
              <div style={styles.addressInfo}>
                <h4 style={{ fontSize: "20px" }}>Địa chỉ</h4>
                <span>{address.fullName}</span>
                <span style={styles.phone}>| {address.numberPhone}</span>
                <br />
                <span style={{ color: "#888" }}>
                  {address.address},{address.wardName},{address.districtName},{address.provinceName}
                </span>
                {address.status && <div style={styles.defaultLabel}>Mặc định</div>}
              </div>
              <div style={styles.actionContainer}>
                {!address.isDefault && (
                  <span
                    style={{
                      ...styles.actionLinks,
                      position: "relative",
                      top: address.status ? "40px" : "", // Sử dụng `top` để đẩy nút xuống theo ý muốn
                    }}
                    onClick={() => handleAddressUpdate(address.id)}
                  >
                    Cập nhật
                  </span>
                )}

                {!address.status && (
                  <span
                    style={{
                      ...styles.actionLinks,
                      cursor: address.status ? "not-allowed" : "pointer",
                      color: "red",
                    }}
                    onClick={() => address.status || handleDeleteAddress(address.id)}
                  >
                    Xóa
                  </span>
                )}

                <br />
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noAddress}>
            <div style={styles.noAddressIcon}>
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <p>Bạn chưa có địa chỉ.</p>
          </div>
        )}
      </div>
      {showBackup && (
        <Backup3
          show={showBackup}
          onClose={() => setShowBackup(false)}
          onAddressUpdated={handleAddressUpdated}
          addressId={backupAddress}
        />
      )}
      {showBackup1 && (
        <Backup2
          show={showBackup1}
          onClose={() => setShowBackup1(false)}
          onAddressUpdated={handleAddressUpdated}
        />
      )}
      <Backup show={showBackupModal} onClose={handleCloseBackupModal} />
    </>
  );
};

export default AddressPage;
