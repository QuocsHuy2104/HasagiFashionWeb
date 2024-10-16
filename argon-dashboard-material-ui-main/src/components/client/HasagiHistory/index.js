import React, { useEffect, useState } from "react";
import { Modal, Box, RadioGroup, FormControlLabel, Radio, Tabs, Tab, Paper } from "@mui/material";
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import aboutImage from "layouts/assets/img/order.png";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOptions] = useState([
    "Đổi ý không muốn mua nữa",
    "Tìm được giá tốt hơn",
    "Thời gian giao hàng quá lâu",
    "Sản phẩm không còn nhu cầu",
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const accountId = Cookies.get('accountId');

    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    const fetchOrderHistory = async () => {
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
  }, [location.state]);

  const handleOpenCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenCancelModal(true);
  };

  const handleCancelOrder = async () => {
    const accountId = Cookies.get('accountId');
    try {
      await axios.put(`http://localhost:3000/api/history-order/${selectedOrderId}/cancel`, {
        reason: cancelReason
      });

      // Fetch the updated orders list
      const response1 = await axios.get(`http://localhost:3000/api/history-order?accountId=${accountId}`);
      setOrders(response1.data);

      // Find the canceled order to check its payStatus
      const canceledOrder = response1.data.find(order => order.id === selectedOrderId);

      // Set the active tab based on the payment status of the canceled order
      if (canceledOrder?.payStatus === "Đã thanh toán") {
        setActiveTab('cho-hoan-tien');
      } else {
        setActiveTab('da-huy');
      }

      setOpenCancelModal(false);
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


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Set the active tab when clicked
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query on input change
  };
  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.statusSlug !== activeTab) {
      return false;
    }
    if (searchQuery && !order.id.toString().includes(searchQuery)) {
      return false;
    }
    return true;
  });

  const goBack = () => {
    navigate(`/feature-section`);
  };

  const getOrderCount = (status) => {
    return orders.filter(order => order.statusSlug === status).length;
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
      fontSize: "18px",
    },
    formControl: {
      border: '1px solid #ddd',
      padding: '10px 20px',
      fontSize: '14px',
      width: '500px',
    },
  };

  // Inside your History component
  return (
    <>
      <HasagiNav />
      <br />
      <ArgonBox p={3}>
        <div className="header" style={{ paddingTop: "50px" }}>
          <button className="back-button" onClick={() => goBack()}>
            <i className="ni ni-bold-left" />
          </button>
          <h5 className="mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Lịch sử đơn hàng</h5>
        </div>
        {/* Tabs for filtering orders */}
        <Paper elevation={3} sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={`Tất cả (${orders.length})`} value="all" />
            <Tab label={`Đang xử lý (${getOrderCount('dang-xu-ly')})`} value="dang-xu-ly" />
            <Tab label={`Đang vận chuyển (${getOrderCount('dang-giao')})`} value="dang-giao" />
            <Tab label={`Đã giao (${getOrderCount('da-giao')})`} value="da-giao" />
            <Tab label={`Hoàn thành (${getOrderCount('hoan-thanh')})`} value="hoan-thanh" />
            <Tab label={`Đã hủy (${getOrderCount('da-huy')})`} value="da-huy" />
            <Tab label={`Trả hàng/Hoàn tiền (${getOrderCount('cho-hoan-tien')})`} value="cho-hoan-tien" />
          </Tabs>
        </Paper>

        {/* Conditionally render the search input */}
        {activeTab === 'all' && (
          <div className="d-flex justify-content-center">
            <input
              type="search"
              placeholder="Tìm kiếm"
              className="form-control rounded-pill me-2"
              aria-label="Search"
              style={styles.formControl}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        )}

        <div style={styles.orderHistory}>
          <table style={styles.table}>
            <thead>
              <tr style={{ fontSize: "18px" }}>
                <th style={styles.th}>Mã đơn hàng</th>
                <th style={styles.th}>Tên Người Đặt</th>
                <th style={styles.th}>Ngày đặt</th>
                <th style={styles.th}>Trạng thái thanh toán</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Tổng tiền</th>
                <th style={styles.th}>Địa chỉ</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="text-center py-4">
                      <img src={aboutImage} style={{ height: "60px", width: "60px" }} />
                      <p style={{ fontSize: "18px", color: "#6c757d" }}>Chưa có đơn hàng.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={styles.td}>
                      <Link to={`/history-order/${order.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                        {order.id || 'null'}
                      </Link>
                    </td>
                    <td style={styles.td}>{order.fullName || 'null'}</td>
                    <td style={styles.td}>{new Date(order.orderDate).toLocaleDateString() || 'null'}</td>
                    <td style={styles.td}>{order.payStatus || 'null'}</td>
                    <td style={styles.td}>
                      <span style={{ color: order.slug === "huy-don-hang" ? "red" : "#1d8cf8" }}>
                        {order.statusName || 'null'}
                      </span>
                    </td>
                    <td style={styles.td}>{(order.amount ? order.amount.toLocaleString() : 'null') + ' VND'}</td>
                    <td style={styles.td}>{order.fullNameAddress || 'null'}</td>
                    <td style={styles.td}>
                      {order.statusSlug === 'dang-xu-ly' ? (
                        <ArgonButton
                          variant="contained"
                          style={{ backgroundColor: 'red', color: 'white' }}
                          size="small"
                          onClick={() => handleOpenCancelModal(order.id)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </ArgonBox>
      <Footer />
      {/* Modal for cancel reason */}
      <Modal open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <Box p={3} style={{ backgroundColor: 'white', width: '300px', margin: '50px auto', borderRadius: '8px' }}>
          <ArgonTypography variant="h6">Chọn lý do hủy đơn hàng</ArgonTypography>
          <RadioGroup
            aria-label="cancel-reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            style={{ marginTop: '15px' }}
          >
            {cancelOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          <ArgonButton
            variant="contained"
            style={{ marginTop: '15px', backgroundColor: 'red', color: 'white' }}
            onClick={handleCancelOrder}
            disabled={!cancelReason}
          >
            Xác nhận hủy
          </ArgonButton>
        </Box>
      </Modal>
    </>
  );

};

export default History;