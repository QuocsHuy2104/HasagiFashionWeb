import React, { useEffect, useState } from "react";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
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

  // Handle error state
  if (error) {
    return (
      <ArgonBox p={3}>
        <ArgonTypography variant="h6" color="error" textAlign="center">
          {error}
        </ArgonTypography>
      </ArgonBox>
    );
  }

  // Handle status changes
  const handleStatusComplete = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/history-order/${orderId}/complete`);
      console.log("Complete Order Response:", response.data); // Log the response

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: 'complete' } : order
        )
      );
      const response1 = await axios.get(`http://localhost:3000/api/history-order?accountId=${accountId}`);;
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error updating the status to complete!", error);
    }
  };




  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const accountId = Cookies.get('accountId');
    try {
      await axios.put(`http://localhost:3000/api/history-order/${orderId}/cancel`, {});
      // Adjust API URL if needed
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: 'cancel-order' } : order
        )
      );
      const response1 = await axios.get(`http://localhost:3000/api/history-order?accountId=${accountId}`);;
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error canceling the order!", error);
    }
  };

  // Styling
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
      border: '1px solid #ddd',
      backgroundColor: '#212529',
      color: 'white',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
    },
    button: {
      width: '80px',
    },
    disabledButton: {
      backgroundColor: 'black',
      color: 'white',
    },
  };

  return (
    <>
      <HasagiNav />
      <ArgonBox p={3}>
        <ArgonTypography variant="h4" color="textPrimary" fontWeight="bold" mb={3}>
          Lịch Sử Đơn Hàng
        </ArgonTypography>
        <div style={styles.orderHistory}>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflowX: 'auto', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '150px' }}>Mã đơn hàng</th>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '200px' }}>Tên Người Đặt</th>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '150px' }}>Ngày đặt</th>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '150px' }}>Trạng thái</th>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '150px' }}>Tổng tiền</th>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '250px' }}>Địa chỉ</th>
                <th style={{ backgroundColor: '#1d8cf8', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd', minWidth: '150px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ backgroundColor: '#f9f9f9', textAlign: 'left', transition: 'background-color 0.2s ease' }}>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', wordWrap: 'break-word' }}>
                    <Link to={`/history-order/${order.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>{order.id || 'null'}</Link>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', wordWrap: 'break-word' }}>{order.fullNameAddress || 'null'}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', wordWrap: 'break-word' }}>{new Date(order.orderDate).toLocaleDateString() || 'null'}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', wordWrap: 'break-word' }}>
                    <span style={{ color: order.slug === "huy-don-hang" ? "red" : "#1d8cf8" }}>{order.statusName || 'null'}</span>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', wordWrap: 'break-word' }}>{(order.amount ? order.amount.toLocaleString() : 'null') + ' VND'}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', wordWrap: 'break-word' }}>
                    {order.address || 'null'},{getAddressNameById(order.provinceID, provinces, 'province') || 'null'},{getAddressNameById(order.districtCode, districts, 'district') || 'null'},{getAddressNameById(order.wardCode, wards, 'ward') || 'null'}
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>
                    <ArgonButton variant="contained" style={order.slug === 'huy-don-hang' ? { backgroundColor: '#ddd', color: '#999', padding: '5px 10px', borderRadius: '5px', cursor: 'not-allowed' } : { backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', cursor: 'pointer', transition: 'background-color 0.3s ease' }} size="small" onClick={() => handleCancelOrder(order.id)} disabled={order.slug === 'huy-don-hang' || order.slug === 'da-giao' || order.slug === 'hoan-thanh'}>Hủy</ArgonButton>
                    &nbsp;
                    <ArgonButton variant="contained" style={order.slug === 'huy-don-hang' ? { backgroundColor: '#ddd', color: '#999', padding: '5px 10px', borderRadius: '5px', cursor: 'not-allowed' } : { backgroundColor: '#1d8cf8', color: 'white', padding: '5px 10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', cursor: 'pointer', transition: 'background-color 0.3s ease' }} size="small" onClick={() => handleStatusComplete(order.id)} disabled={order.slug !== 'da-giao' || order.slug === 'huy-don-hang'}>Hoàn Thành</ArgonButton>
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



{/* <td style={styles.td}>
                    <Link to={`/history-order/${order.id}`}>
                      <ArgonButton
                        variant="contained"
                        style={{ backgroundColor: 'green', color: 'white' }}
                        size="small"
                      >
                        Chi tiết
                      </ArgonButton>
                    </Link>
                  </td> */}