import React, { useEffect, useState } from "react";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch orders
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

  // Fetch provinces
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

  // Fetch districts when provinces are fetched
  useEffect(() => {
    if (orders.length > 0) {
      const uniqueProvinceIDs = [...new Set(orders.map(order => order.provinceID))];
      uniqueProvinceIDs.forEach(provinceID => fetchDistricts(provinceID));
    }
  }, [orders]);

  // Fetch wards when districts are fetched
  useEffect(() => {
    if (districts.length > 0) {
      const uniqueDistrictCodes = [...new Set(orders.map(order => order.districtCode))];
      uniqueDistrictCodes.forEach(districtCode => fetchWards(districtCode));
    }
  }, [districts]);

  // Fetch districts
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

  // Fetch wards
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

  // Get address names by ID
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

  // Handle loading state
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
          order.id === orderId ? { ...order, statusSlug: 'complete' } : order
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
          order.id === orderId ? { ...order, statusSlug: 'cancel-order' } : order
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
    <ArgonBox p={3}>
      <ArgonTypography variant="h4" color="textPrimary" fontWeight="bold" mb={3}>
        Lịch Sử Đơn Hàng
      </ArgonTypography>
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
              <th style={styles.th}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={styles.td}>{order.id || 'null'}</td>
                <td style={styles.td}>{order.fullNameAddress || 'null'}</td>
                <td style={styles.td}>{new Date(order.orderDate).toLocaleDateString() || 'null'}</td>
                <td style={styles.td}>
                  <span style={{ color: order.statusSlug === "cancel-order" ? "red" : "#1d8cf8" }}>
                    {order.statusName || 'null'}
                  </span>
                </td>
                <td style={styles.td}>
                  {(order.amount ? order.amount.toLocaleString() : 'null') + ' VND'}
                </td>
                <td style={styles.td}>
                  {order.address || 'null'},
                  {getAddressNameById(order.provinceID, provinces, 'province') || 'null'},
                  {getAddressNameById(order.districtCode, districts, 'district') || 'null'},
                  {getAddressNameById(order.wardCode, wards, 'ward') || 'null'}
                </td>
                <td style={styles.td}>
                  <ArgonButton
                    variant="contained"
                    style={order.statusSlug === 'cancel-order' ? styles.disabledButton : { backgroundColor: 'red', color: 'white' }}
                    size="small"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={order.statusSlug === 'cancel-order' || order.statusSlug === 'delivered' || order.statusSlug === 'complete'}
                  >
                    Cancel Order
                  </ArgonButton>
                  &nbsp;
                  <ArgonButton
                    variant="contained"
                    style={order.statusSlug === 'cancel-order' ? styles.disabledButton : { backgroundColor: '#1d8cf8', color: 'white' }}
                    size="small"
                    onClick={() => handleStatusComplete(order.id)}
                    disabled={order.statusSlug !== 'delivered' || order.statusSlug === 'cancel-order'}
                  >
                    Complete
                  </ArgonButton>

                </td>
                <td style={styles.td}>
                  <Link to={`/history-order/${order.id}`}>
                    <ArgonButton
                      variant="contained"
                      style={{ backgroundColor: 'green', color: 'white' }}
                      size="small"
                    >
                      Chi tiết
                    </ArgonButton>
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ArgonBox>
  );
};

export default History;
