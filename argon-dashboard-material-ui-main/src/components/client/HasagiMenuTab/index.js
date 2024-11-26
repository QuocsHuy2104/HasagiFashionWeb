import React from "react";
import PropTypes from "prop-types";
import "./Profile.css";

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

  return (
    <div className="sidebar">
      <div className="profile">
        <div className="profile-pic">C</div>
        <span className="username">cnglp273</span>
        <button className="edit-profile" onClick={onEditProfileClick}>
          Sửa Hồ Sơ
        </button>
      </div>
      <div className="menu">
        {menuItems.map((item) => (
          <React.Fragment key={item.name}>
            <p
              className={`menu-item ${
                activeItem === item.name && !item.hasSubItems ? "active" : ""
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
                      className={`menu-item ${
                        activeItem === subItem.name ? "active sub-item" : "sub-item"
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
