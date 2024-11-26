import React, { useRef, useEffect, useState } from "react";
import MenuTab from "../HasagiMenuTab/index";
import Header from "../HasagiHeader";
import AddressPage from "../HasagiAddress";
import User from "../HasagiUser";
import IndexHistory from "../HasagiMenuItemBackup/indexHisory";
import Footer from "../HasagiFooter";
import ChangePassword from "../HasagiChangePassword";
import Voucher from "components/client/HasagiVorcher/vorcher";

const History = () => {
  const [activeItem, setActiveItem] = useState("Đơn Mua");
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const menuItems = [
    { name: "Tài Khoản Của Tôi", hasSubItems: true },
    { name: "Đơn Mua" },
    { name: "Kho Voucher", isNew: true },
  ];
  const subMenuItems = [
    { name: "Hồ Sơ", parent: "Tài Khoản Của Tôi" },
    { name: "Địa Chỉ", parent: "Tài Khoản Của Tôi" },
    { name: "Đổi Mật Khẩu", parent: "Tài Khoản Của Tôi" },
    { name: "Kho Voucher", parent: "Tài Khoản Của Tôi" },
  ];

  const urlMapping = {
    "Tài Khoản Của Tôi": "my-account",
    "Đơn Mua": "purchase",
    "Kho Voucher": "voucher-store",
    "Hồ Sơ": "profile",
    "Địa Chỉ": "address",
    "Đổi Mật Khẩu": "change-password",
}; 

const updateURL = (item) => {
  const englishURL = urlMapping[item] || item.toLowerCase().replace(/\s/g, '-');
  const newURL = `/user/${englishURL}`;
  window.history.pushState(null, '', newURL);
};

useEffect(() => {
    if (activeItem) {
        updateURL(activeItem);
    }
}, [activeItem]);

  const handleEditProfileClick = () => {
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
        null;
    }
  };

  return (
    <>
      <Header />
      <div className="row w-100" style={{ marginTop: "7%" }}>
        <div className="col-3">
          <MenuTab
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            menuItems={menuItems}
            subMenuItems={subMenuItems}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
            onEditProfileClick={handleEditProfileClick}
          />
        </div>
        <div className="col-8 content-box">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );

};

export default History;
