import { React, useState } from "react";
import "./Profile.css";
import Header from "../HasagiHeader";
import Footer from "../HasagiFooter";
import History from "../HasagiHistory";
import Shop from "../HasagiShopDetail";

const Profile = () => {
  // State để theo dõi mục đang active
  const [activeItem, setActiveItem] = useState("Tài Khoản Của Tôi");

  // Danh sách các mục trong sidebar
  const menuItems = [
    { name: "Tài Khoản Của Tôi" },
    { name: "Hồ Sơ" },
    { name: "Ngân Hàng" },
    { name: "Địa Chỉ" },
    { name: "Đổi Mật Khẩu" },
    { name: "Cài Đặt Thông Báo" },
    { name: "Những Thiết Lập Riêng Tư" },
    { name: "Đơn Mua" },
    { name: "Thông Báo" },
    { name: "Kho Voucher", isNew: true },
    { name: "Shopee Xu" },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "Tài Khoản Của Tôi":
        return;
      case "Hồ Sơ":
        return <Shop />;
      case "Địa Chỉ":
        return;
      case "Đơn Mua":
        return <History />;
      default:
        return;
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
              <div className="profile-pic">C</div>
              <span className="username">cnglp273</span>
              <button className="edit-profile">Sửa Hồ Sơ</button>
            </div>
            <div className="menu">
              {menuItems.map((item) => (
                <p
                  key={item.name}
                  className={activeItem === item.name ? "menu-item active" : "menu-item"}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.name} {item.isNew && <span className="new">New</span>}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="col-8 content-box">{renderContent()}</div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
