import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Profile.css";
import ProfileServices from "../../../services/ProfileServices";
const MenuTab = ({
  activeItem,
  setActiveItem,
  menuItems,
  subMenuItems,
  expandedItem,
  setExpandedItem,
  onEditProfileClick,
}) => {
  const handleMenuItemClick = (item) => {
    if (item.hasSubItems) {
      setExpandedItem(item.name);
      setActiveItem("Hồ Sơ");
    } else {
      setActiveItem(item.name);
      setExpandedItem(item.parent || null);
    }
  };
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


  return (
    <div className="sidebar">
      <div className="profile">
        <div className="profile-pic">
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={{ width: "100%", height: "auto" }} />
          ) : (
            <img src="default-avatar.png" alt="Profile" style={{ width: "100%", height: "auto" }} />
          )}
        </div>

        <span className="username">{name}</span>
        <button className="edit-profile" onClick={onEditProfileClick}>
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
  );
};

MenuTab.propTypes = {
  activeItem: PropTypes.string.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isNew: PropTypes.bool,
      hasSubItems: PropTypes.bool,
    })
  ).isRequired,
  subMenuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      parent: PropTypes.string.isRequired,
    })
  ),
  expandedItem: PropTypes.string,
  setExpandedItem: PropTypes.func.isRequired,
  onEditProfileClick: PropTypes.func.isRequired,
};

export default MenuTab;
