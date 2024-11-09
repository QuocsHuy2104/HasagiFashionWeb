import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./User.css"; // Importing CSS file for styling
import axios from "axios"; // Thêm thư viện axios để thực hiện gọi API

function User() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("cdcdcdc@gmail.com");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // State for handling modals
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Temporary states for new values
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);

  // Error messages
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Hàm lấy thông tin người dùng từ API
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user"); // Thay đổi URL này cho phù hợp với API của bạn
      const { username, name, email, phone, profileImage } = response.data;
      setUsername(username);
      setName(name);
      setEmail(email);
      setPhone(phone);
      setProfileImage(profileImage); // Giả sử API trả về URL của ảnh đại diện
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Lấy thông tin người dùng khi component được mount
  }, []);

  // Hàm xử lý chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxFileSize = 1 * 1024 * 1024; // 1 MB
      if (file.size > maxFileSize) {
        alert("Vui lòng chọn tệp có dung lượng tối đa 1 MB."); // Thông báo lỗi nếu tệp quá lớn
        return;
      }

      const validFormats = [".jpeg", ".jpg", ".png"];
      const fileExtension = file.name
        .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase();

      if (validFormats.includes(`.${fileExtension}`)) {
        setProfileImage(URL.createObjectURL(file)); // Tạo URL cho ảnh được chọn
      } else {
        alert("Vui lòng chọn tệp có định dạng .JPEG hoặc .PNG."); // Thông báo lỗi nếu định dạng không hợp lệ
      }
    }
  };

  const handleSave = async () => {
    try {
      const userData = {
        username,
        name,
        email,
        phone,
        // Thêm profileImage nếu cần thiết
      };
      // Gửi dữ liệu người dùng đến API
      await axios.put("/api/user", userData); // Thay đổi URL này cho phù hợp với API của bạn
      console.log("Profile saved");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@gmail\.com$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    const regex = /^\d{10}$/; // Điều chỉnh theo định dạng số điện thoại mong muốn
    return regex.test(phone);
  };

  const handleEmailChange = () => {
    if (!isValidEmail(tempEmail)) {
      setEmailError("Email không hợp lệ."); // Thiết lập thông báo lỗi
      return;
    }

    setEmail(tempEmail); // Cập nhật email khi người dùng lưu
    setShowEmailModal(false);
    setEmailError(""); // Xóa thông báo lỗi
    console.log("Email đã được lưu:", tempEmail);
  };

  const handlePhoneChange = () => {
    if (!isValidPhone(tempPhone)) {
      setPhoneError("Số điện thoại không hợp lệ."); // Thiết lập thông báo lỗi
      return;
    }

    setPhone(tempPhone); // Cập nhật số điện thoại khi người dùng lưu
    setShowPhoneModal(false);
    setPhoneError(""); // Xóa thông báo lỗi
    console.log("Số điện thoại đã được lưu:", tempPhone);
  };

  return (
    <div className="user-profile-container">
      <div className="row p-3">
        <h5>Hồ Sơ Của Tôi</h5>
        <h6 className="mb-4" style={{ color: "#555", fontSize: "17px" }}>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </h6>
        <hr style={{ color: "#888" }} />
        <div className="col-8">
          <div className="profile-form">
            <div className="form-row mt-3">
              <label className="form-label">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                style={{
                  fontSize: "14px",
                  padding: "8px",
                  border: "0.22px solid #888",
                  outline: "none",
                }}
              />
            </div>
            <p className="hint-text">Tên Đăng nhập chỉ có thể thay đổi một lần.</p>

            <div className="form-row mt-3">
              <label className="form-label">Tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{
                  fontSize: "14px",
                  padding: "8px",
                  border: "0.22px solid #888",
                  outline: "none",
                }}
              />
            </div>

            <div className="form-row mt-3">
              <label className="form-label">Email</label>
              <div className="form-input mb-2" style={{ fontSize: "14px" }}>
                {email ? (
                  <>
                    {email}{" "}
                    <span
                      onClick={() => {
                        setShowEmailModal(true);
                        setTempEmail(email); // Đặt biến tạm thời khi mở modal
                        setEmailError(""); // Reset error message
                      }}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      Thay Đổi
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      setShowEmailModal(true);
                      setTempEmail(""); // Đặt biến tạm thời cho email mới
                      setEmailError(""); // Reset error message
                    }}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Thêm
                  </span>
                )}
              </div>
            </div>

            <div className="form-row mt-2">
              <label className="form-label">Số điện thoại</label>
              <div className="form-input mb-1" style={{ fontSize: "14px" }}>
                {phone ? (
                  <>
                    {phone}{" "}
                    <span
                      onClick={() => {
                        setShowPhoneModal(true);
                        setTempPhone(phone); // Đặt biến tạm thời khi mở modal
                        setPhoneError(""); // Reset error message
                      }}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      Thay Đổi
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      setShowPhoneModal(true);
                      setTempPhone(""); // Đặt biến tạm thời cho số điện thoại mới
                      setPhoneError(""); // Reset error message
                    }}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Thêm
                  </span>
                )}
              </div>
            </div>

            {/* Other fields like gender and birth date */}
            {/* ... */}

            <button
              className="save-btn mt-3"
              style={{ width: "15%", padding: 5, marginLeft: "165px" }}
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>
        </div>

        <div className="col-4 profile-picture-section">
          <div className="profile-picture mb-3">
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: "100%", height: "auto" }} />
            ) : (
              <img alt="Profile" style={{ width: "100%", height: "auto" }} />
            )}
          </div>
          <input
            type="file"
            accept=".jpeg,.jpg,.png" // Chỉ cho phép định dạng .JPEG và .PNG
            style={{ display: "none" }} // Ẩn input file
            onChange={handleImageChange}
            id="file-input"
          />
          <label htmlFor="file-input" className="select-image-btn" style={{ cursor: "pointer" }}>
            Chọn Ảnh
          </label>
          <p className="file-hint">
            Dung lượng file tối đa 1 MB
            <br />
            Định dạng: JPEG, PNG
          </p>
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        show={showEmailModal}
        onHide={() => {
          setShowEmailModal(false);
          setEmailError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{email ? "Thay Đổi Email" : "Thêm Email"}</Modal.Title>{" "}
          {/* Thay đổi tiêu đề */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label style={{ textAlign: "left" }}>Email mới</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email mới"
                value={tempEmail} // Sử dụng biến tạm thời
                onChange={(e) => setTempEmail(e.target.value)}
                style={{ outline: "none", boxShadow: "none" }}
              />
            </Form.Group>
          </Form>
          {emailError && <div style={{ fontSize: "14px", color: "red" }}>{emailError}</div>}{" "}
          {/* Hiển thị lỗi trong modal */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={() => {
              setShowEmailModal(false);
              setEmailError("");
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEmailChange}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Phone Modal */}
      <Modal
        show={showPhoneModal}
        onHide={() => {
          setShowPhoneModal(false);
          setPhoneError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{phone ? "Thay Đổi Số Điện Thoại" : "Thêm Số Điện Thoại"}</Modal.Title>{" "}
          {/* Thay đổi tiêu đề */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label style={{ textAlign: "left" }}>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                value={tempPhone} // Sử dụng biến tạm thời
                onChange={(e) => setTempPhone(e.target.value)}
                style={{ outline: "none", boxShadow: "none" }}
              />
            </Form.Group>
          </Form>
          {phoneError && <div style={{ fontSize: "14px", color: "red" }}>{phoneError}</div>}{" "}
          {/* Hiển thị lỗi trong modal */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={() => {
              setShowPhoneModal(false);
              setPhoneError("");
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handlePhoneChange}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User;
