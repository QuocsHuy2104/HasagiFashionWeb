import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../HasagiHeader";
import Footer from "../HasagiFooter";
import IndexHistory from "../HasagiMenuItemBackup/indexHisory";
import AddressPage from "../HasagiAddress";
import ChangePassword from "../HasagiChangePassword";
import Voucher from "components/client/HasagiVorcher/vorcher";
import User from "../HasagiUser";
import aboutImage5 from "layouts/assets/img/user.jpg";
import ProfileServices from "../../../services/ProfileServices";
const Profile = () => {
  const [activeItem, setActiveItem] = useState("Hồ Sơ");
  const [expandedItem, setExpandedItem] = useState("Tài Khoản Của Tôi");

  const menuItems = [
    { name: "Tài Khoản Của Tôi", hasSubItems: true },
    { name: "Đơn Mua" },
  ];

  const subMenuItems = [
    { name: "Hồ Sơ", parent: "Tài Khoản Của Tôi" },
    { name: "Địa Chỉ", parent: "Tài Khoản Của Tôi" },
    { name: "Đổi Mật Khẩu", parent: "Tài Khoản Của Tôi" },
  ];

  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const fetchUserData = async () => {
    try {
      const response = await ProfileServices.getProfile();
      const { avatar, fullName } = response;


      setProfileImage(avatar);
      setName(fullName);


    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleMenuItemClick = (item) => {
    if (item.hasSubItems) {
      setExpandedItem(item.name);
      setActiveItem("Hồ Sơ");
    } else {
      setActiveItem(item.name);
      setExpandedItem(item.parent || null);
    }
  };

  const handleEditProfileClick = () => {
    // Mở menu "Tài Khoản Của Tôi" và thiết lập hoạt động là "Hồ Sơ"
    setExpandedItem("Tài Khoản Của Tôi");
    setActiveItem("Hồ Sơ");
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Hồ Sơ":
        return <User />;
      case "Địa Chỉ":
        return <AddressPage />;
      case "Đơn Mua":
        return <IndexHistory />;
      case "Đổi Mật Khẩu":
        return <ChangePassword />;
      case "Kho Voucher":
        return <Voucher />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-5">
        <Header />
      </div>
      <div className="row w-100" style={{ marginTop: "7%" }}>
        <div className="col-3">
          <div className="sidebar">
            <div className="profile">
              <div className="profile-pic">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" style={{ width: "100%", height: "auto" }} />
                ) : (
                  <img src={aboutImage5} alt="Profile" style={{ width: "100%", height: "auto" }} />
                )}
              </div>
              <span className="username">{name}</span>
              <button className="edit-profile" onClick={handleEditProfileClick}>
                Sửa Hồ Sơ
              </button>
            </div>
            <div className="menu">
              {menuItems.map((item) => (
                <React.Fragment key={item.name}>
                  <p
                    className={`menu-item ${activeItem === item.name && !item.hasSubItems ? "active" : ""
                      }`}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    {item.name} {item.isNew && <span className="new">New</span>}
                  </p>
                  {item.hasSubItems && (
                    <div className={`sub-menu ${expandedItem === item.name ? "open" : ""}`}>
                      {subMenuItems
                        .filter((subItem) => subItem.parent === item.name)
                        .map((subItem) => (
                          <p
                            key={subItem.name}
                            className={`menu-item ${activeItem === subItem.name ? "active sub-item" : "sub-item"
                              }`}
                            onClick={() => handleMenuItemClick(subItem)}
                          >
                            {subItem.name}
                          </p>
                        ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="col-8 content-box mb-3">{renderContent()}</div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
