import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (orders.length > 0) {
      const uniqueProvinceIDs = [...new Set(orders.map(order => order.provinceID))];
      uniqueProvinceIDs.forEach(provinceID => fetchDistricts(provinceID));
    }
  }, [orders]);

  useEffect(() => {
    if (districts.length > 0) {
      const uniqueDistrictCodes = [...new Set(orders.map(order => order.districtCode))];
      uniqueDistrictCodes.forEach(districtCode => fetchWards(districtCode));
    }
  }, [districts]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const accountId = Cookies.get('accountId');
      try {
        const response = await axios.get(`http://localhost:3000/api/history-order?accountId=${accountId}`);
        setOrders(response.data);
      } catch (error) {
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' }
        });
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
        headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' },
        params: { province_id: provinceId }
      });
      setDistricts(prevDistricts => [...prevDistricts, ...response.data.data]);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
        headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' },
        params: { district_id: districtId }
      });
      setWards(prevWards => [...prevWards, ...response.data.data]);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const getAddressNameById = (id, list, type) => {
    const addressItem = list.find(item => {
      if (type === 'province' && item.ProvinceID === Number(id)) return true;
      if (type === 'district' && item.DistrictID === Number(id)) return true;
      if (type === 'ward' && item.WardCode === String(id)) return true;
      return false;
    });

    if (addressItem) {
      if (type === 'province') return addressItem.ProvinceName;
      if (type === 'district') return addressItem.DistrictName;
      if (type === 'ward') return addressItem.WardName;
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <ArgonBox display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </ArgonBox>
    );
  }

  if (error) {
    return (
      <ArgonBox p={3}>
        <ArgonTypography variant="h6" color="error" textAlign="center">
          {error}
        </ArgonTypography>
      </ArgonBox>
    );
  }

  const handleCancelOrder = async (orderId) => {
    const accountId = Cookies.get('accountId');
    try {
      await axios.put(`http://localhost:3000/api/history-order/${orderId}/cancel`, {});
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: 'huy' } : order
        )
      );
      const response1 = await axios.get(`http://localhost:3000/api/history-order?accountId=${accountId}`);
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error canceling the order!", error);
    }
  };

  const handleStatusComplete = async (orderId) => {
    const accountId = Cookies.get('accountId');
    try {
      const response = await axios.put(`http://localhost:3000/api/history-order/${orderId}/complete`);
      console.log("Complete Order Response:", response.data); // Log the response

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: 'hoan-thanh' } : order
        )
      );
      const response1 = await axios.get(`http://localhost:3000/api/history-order?accountId=${accountId}`);;
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error updating the status to complete!", error);
    }
  };
  
  const styles = {
    orderHistory: {
      width: '100%',
      margin: '20px auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'center',
    },
    th: {
      padding: '10px',
      borderBottom: '2px solid #ddd',
      fontWeight: 'bold',
      backgroundColor: '#f5f5f5',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    button: {
      width: '80px',
      padding: '5px 10px',
      borderRadius: '5px',
    },
    disabledButton: {
      backgroundColor: '#ddd',
      color: '#999',
      cursor: 'not-allowed',
    },
  };
  const navbarStyle = {
    backgroundColor: '#3D464D',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderBottom: 'white solid 1px',
    borderTop: 'white solid 1px',
};

const navMenuStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 auto',  // Căn giữa
    display: 'flex',
    justifyContent: 'center', // Căn giữa các danh mục
};

const navItemStyle = {
    marginRight: '20px',
};

const menuLinkStyle = {
    color: 'white',
    padding: '10px 15px',
    textDecoration: 'none',
    transition: 'color 0.3s ease, background-color 0.3s ease',
};

const dropdownMenuStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

  return (
    <>
      <HasagiNav />
      <nav className="navbar navbar-expand-lg p-0" style={navbarStyle}>
            <div className="container-fluid d-flex justify-content-between align-items-center py-5">
                <div className="collapse navbar-collapse" style={{paddingTop:'50px'}}>
                    <ul className="nav-menu" style={navMenuStyle}>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="categories" data-bs-toggle="dropdown" aria-expanded="false">
                                Trạng thái
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="categories">
                                {/* {categories.map((category) => (
                                    <li key={category.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {category.name}
                                        </a>
                                    </li>
                                ))} */}
                            </ul>
                        </li>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="brands" data-bs-toggle="dropdown" aria-expanded="false">
                                Ngày
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="brands">
                                {/* {brands.map((brand) => (
                                    <li key={brand.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {brand.name}
                                        </a>
                                    </li>
                                ))} */}
                            </ul>
                        </li>
                        <li className="nav-item dropdown" style={navItemStyle}>
                            <a className="nav-link dropdown-toggle menuLink" style={menuLinkStyle} role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">
                                Số điện thoại
                            </a>
                            <ul className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="colors">
                                {/* {colors.map((color) => (
                                    <li key={color.id}>
                                        <a href="/#" className="dropdown-item" style={dropdownItemStyle}>
                                            {color.name}
                                        </a>
                                    </li>
                                ))} */}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
      <ArgonBox p={3}>
      <div className="header">
          <button className="back-button" onClick={() => goBack()}>
            <i className="ni ni-bold-left" />
          </button>
          <h5 className="mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Lịch sử đơn hàng</h5>
        </div>
        <div style={styles.orderHistory}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã đơn hàng</th>
                <th style={styles.th}>Tên Người Đặt</th>
                <th style={styles.th}>Ngày đặt</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Tổng tiền</th>
                <th style={styles.th}>Địa chỉ</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>
                    <Link to={`/history-order/${order.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                      {order.id || 'null'}
                    </Link>
                  </td>
                  <td style={styles.td}>{order.fullNameAddress || 'null'}</td>
                  <td style={styles.td}>{new Date(order.orderDate).toLocaleDateString() || 'null'}</td>
                  <td style={styles.td}>
                    <span style={{ color: order.slug === "huy-don-hang" ? "red" : "#1d8cf8" }}>
                      {order.statusName || 'null'}
                    </span>
                  </td>
                  <td style={styles.td}>{(order.amount ? order.amount.toLocaleString() : 'null') + ' VND'}</td>
                  <td style={styles.td}>
                    {order.address || 'null'},{getAddressNameById(order.provinceID, provinces, 'province') || 'null'},{getAddressNameById(order.districtCode, districts, 'district') || 'null'},{getAddressNameById(order.wardCode, wards, 'ward') || 'null'}
                  </td>
                  <td style={styles.td}>
                    {order.statusSlug === 'dang-xu-ly' ? (
                      <ArgonButton
                        variant="contained"
                        style={{ backgroundColor: 'red', color: 'white' }}
                        size="small"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy
                      </ArgonButton>
                    ) : order.statusSlug === 'da-giao' ? (
                      <ArgonButton
                        variant="contained"
                        style={{ backgroundColor: 'green', color: 'white' }}
                        size="small"
                        onClick={() => handleStatusComplete(order.id)}
                      >
                        Hoàn Thành
                      </ArgonButton>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArgonBox>
      <Footer />
    </>
  );
};

export default History;