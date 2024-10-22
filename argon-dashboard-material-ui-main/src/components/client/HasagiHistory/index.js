import React, { useEffect, useState } from "react";
import { Modal, Box, Tabs, Tab, Paper, Button, Grid, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import HasagiNav from "components/client/HasagiHeader";
import HistoryOrderService from "../../../services/HistoryOrderServices";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    const fetchOrderHistory = async () => {
      try {
        const response = await HistoryOrderService.getHistory();
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
    try {
      await axios.put(`http://localhost:3000/api/history-order/${selectedOrderId}/cancel`, {
        reason: cancelReason,
      });

      const response = await HistoryOrderService.getHistory();
      setOrders(response.data);

      const canceledOrder = response.data.find(order => order.id === selectedOrderId);

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
    try {
      const response = await axios.put(`http://localhost:3000/api/history-order/${orderId}/complete`);
      console.log("Complete Order Response:", response.data);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: 'hoan-thanh' } : order
        )
      );
      const response1 = await HistoryOrderService.getHistory();
      setOrders(response1.data);
    } catch (error) {
      console.error("There was an error updating the status to complete!", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
    formControl: {
      border: '1px solid #ddd',
      padding: '10px 20px',
      fontSize: '14px',
      width: '500px',
    },
  };

  return (
    <>
      <HasagiNav />
      <br />
      <ArgonBox p={3}>
        <div className="header" style={{ paddingTop: "50px" }}>
          <button className="back-button" onClick={goBack}>
            <i className="ni ni-bold-left" />
          </button>
          <h5 className="mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Lịch sử đơn hàng</h5>
        </div>

        {/* Tabs for filtering orders */}
        <Paper elevation={3} style={{ padding: "16px", position: "relative", maxWidth: "1000px", margin: "0 auto", marginBottom: "20px" }}>
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

        <Box p={3} style={{ padding: "16px", position: "relative", maxWidth: "1030px", margin: "0 auto", marginBottom: "20px" }}>
          {orders.length === 0 ? (
            <Typography>No orders found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredOrders.map((order) => (
                <Grid item xs={12} key={order.id}>
                  <Paper elevation={3} style={{ padding: "16px", position: "relative" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <i
                          className="fa fa-map-marker-alt"
                          style={{ color: 'red', fontSize: '1.5rem', marginRight: '5px' }}
                        ></i>
                        <Typography
                          variant="h6"
                          component="h5"
                          style={{ color: '#e63946', fontSize: '1.2rem', fontWeight: 'bold', marginRight: '10px' }}
                        >
                          Địa Chỉ Nhận Hàng:
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                          {order.fullNameAddress}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        {order.statusName}
                      </Typography>
                    </Box>
                    <section />
                    {order.products && order.products.length > 0 ? (
                      <Box display="flex" flexDirection="column">
                        {order.products.map((product, index) => (
                          <Box display="flex" alignItems="center" key={index} style={{ marginBottom: "8px" }}>
                            <img src={product.productImage} alt="Product" style={{ width: "100px", marginRight: "16px" }} />
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {product.productName}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" style={{ color: "black" }}>
                                Phân loại hàng: {product.color}, {product.size}
                              </Typography>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="textSecondary" style={{ color: "black" }}>
                                  Số lượng: {product.productQuantity}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" style={{ marginLeft: "600px", color: "black" }}>
                                  Thành tiền: {product.productPrice}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Không có sản phẩm nào trong đơn hàng.
                      </Typography>
                    )}
                    <section/>
                    <Typography variant="body2" color="textSecondary" style={{ marginLeft: "800px", color: "black" }}>
                      Tổng tiền: 40000đ
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      {order.statusSlug === 'dang-xu-ly' ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenCancelModal(order.id)}
                          style={{ marginRight: "10px", backgroundColor: "red" }}
                        >
                          Hủy đơn
                        </Button>
                      ) : order.statusSlug === 'da-giao' ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleStatusComplete(order.id)}
                          style={{ marginRight: "10px", backgroundColor: "green" }}
                        >
                          Hoàn thành
                        </Button>
                      ) : order.statusSlug === 'da-giao' ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleStatusComplete(order.id)}
                          style={{ marginRight: "10px", backgroundColor: "red" }}
                        >
                          Đã hủy </Button>) :
                        null}
                      <Button variant="contained" href={`/history-order/${order.id}`} color="primary" style={{ marginRight: "10px" }}>
                        Xem chi tiết hóa đơn
                      </Button>
                      <Button variant="contained" color="primary">
                        Mua Lại
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

      </ArgonBox>
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