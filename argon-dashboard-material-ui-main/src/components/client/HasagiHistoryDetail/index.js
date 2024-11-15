import React, { useEffect, useState } from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import ArgonBox from "components/ArgonBox";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import Cookies from "js-cookie";

import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faWallet, faTruck, faBoxOpen, faStar, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

const HistoryOrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const [fullNameAdd, setFullNameAdd] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [orderDate, setOrderDate] = useState('');
  useEffect(() => {
    const accountId = Cookies.get('accountId');
    if (!accountId) {
      navigate(`/authentication/sign-in`);
      return;
    }
    if (orderId) {
      fetch(`http://localhost:8080/api/history-order/${orderId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setOrderDetails(data);
          if (data.length > 0) {
            const fee = data[0].shippingFee;

            setShippingFee(fee);
            const orderStatus = data[0].statusName;
            setStatus(orderStatus);

            const payMethod = data[0].payMethod;
            const displayPayMethod = payMethod === 'Direct Check' ? 'Thanh toán khi nhận hàng' : payMethod;
            setPayMethod(displayPayMethod);

            const orderDate = data[0].orderDate;
            const formattedOrderDate = orderDate
              ? format(new Date(orderDate), "HH:mm dd-MM-yyyy")
              : "Date not available";
            setOrderDate(formattedOrderDate);
            console.log("Shipping Fee:", fee);

            setFullNameAdd(data[0].name);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
          setError("Order not found");
          setLoading(false);
        });
    }
  }, [orderId]);



  if (error) {
    return <div>{error}</div>;
  }


  const subtotalList = orderDetails.map(item => item.productPrice * item.productQuantity);
  const totalSubtotal = subtotalList.reduce((total, subtotal) => total + subtotal, 0);

  const formattedTotalSubtotal = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(totalSubtotal);

  const finalTotal = totalSubtotal + shippingFee;
  const formattedFinalTotal = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(finalTotal);

  const goBack = () => {
    navigate(`/History`);
  };

  const statusMap = [
    { name: "Đơn Hàng Đã Đặt", icon: faReceipt, active: true },
    { status: 'Đang xử lý', name: 'Đang xử lý', icon: faReceipt },
    { status: 'Đang giao', name: 'Đang giao', icon: faTruck },
    { status: 'Đã giao', name: 'Đã giao', icon: faBoxOpen },
    { status: 'Hoàn thành', name: 'Hoàn thành', icon: faCheckCircle },
  ];

  const steps = statusMap.map((step, index) => ({
    label: step.name,
    icon: step.icon,
    active: status === step.status,
    completed: index <= statusMap.findIndex(s => s.status === status)
  }));

  const styles = {
    progressContainer: {
      display: "flex",
      justifyContent: "space-between",
      margin: "20px",
      textAlign: "center",
      position: "relative",
    },
    step: {
      position: "relative",
      flex: 1,
      textAlign: "center",
    },
    stepCircle: {
      width: "40px",
      height: "40px",
      backgroundColor: "#ccc",
      borderRadius: "50%",
      display: "inline-block",
      zIndex: 1,
      position: "relative",
      lineHeight: "40px",
      color: "white",
      fontSize: "18px",
    },
    activeStepCircle: {
      backgroundColor: "#4CAF50",
    },
    stepLabel: {
      marginBottom: "4px",
      fontSize: "12px",
    },
    activeStepLabel: {
      color: "#4CAF50",
    },
    stepLine: {
      position: "absolute",
      width: "calc(100% - 0px)",
      height: "2px",
      backgroundColor: "#ccc",
      top: "20%",
      left: "50%",
      zIndex: 0,

    },
    activeStepLine: {
      backgroundColor: "#4CAF50",
    },
  };

  return (
    <>
      <HasagiNav />
      <br />
      <ArgonBox p={10}>


        <Box p={3} style={{ padding: "16px", position: "relative", maxWidth: "1030px", margin: "0 auto" }}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Paper elevation={3} style={{ padding: "16px", position: "relative" }}>
                <div className="header" style={{ paddingTop: "10px" }}>
                  <button className="back-button" onClick={goBack}>
                    <i className="ni ni-bold-left" />
                  </button>
                  <h5 className="mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Quay lại</h5>
                </div>
                <div style={styles.progressContainer}>
                  {status !== 'Đã hủy' && steps.map((step, index) => (
                    <div key={index} style={styles.step}>
                      <div
                        style={{
                          ...styles.stepCircle,
                          ...(step.active ? styles.activeStepCircle : {}),
                          ...(step.completed ? styles.activeStepCircle : {}),
                        }}
                      >
                        <FontAwesomeIcon icon={step.icon} />
                      </div>
                      <div
                        style={{
                          ...styles.stepLabel,
                          ...(step.active ? styles.activeStepLabel : {}),
                        }}
                      >
                        {step.label}
                      </div>
                      {index === 0 && (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                        >
                          {orderDate}
                        </Typography>
                      )}
                      {index < steps.length - 1 && (
                        <div
                          style={{
                            ...styles.stepLine,
                            ...(steps[index + 1].completed ? styles.activeStepLine : {}),
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {status === "Đã hủy" && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    style={{
                      backgroundColor: "#fff9e6", // Light yellow background
                      padding: "8px 16px",
                    }}
                  >
                    <Typography variant="body1">
                      <h4>Đã hủy đơn hàng</h4>
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      style={{ fontSize: "20px" }}
                    >
                      vào 20:48 22-10-2024.
                    </Typography>
                  </Box>
                )}
                <section
                  style={{
                    borderTop: '2px dashed rgba(128, 128, 128, 0.4)',
                    margin: '10px 0',
                  }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" >
                      <h4>Người đặt hàng: {fullNameAdd}</h4>
                    </Typography>
                  </Box>
                  {status !== "Đã hủy" && (
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      MÃ ĐƠN HÀNG: {orderId}
                    </Typography>
                  )}
                </Box>
                <section
                  style={{
                    borderTop: '2px dashed rgba(128, 128, 128, 0.4)',
                    margin: '10px 0',
                  }}
                />

                {orderDetails.map((item, index) => (
                  <Box display="flex" alignItems="center" style={{ marginBottom: "25px", marginTop: "-15px" }} key={index}>
                    <img src={item.productImage} alt="Product" style={{ width: "100px", marginRight: "16px" }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {item.productName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ color: "black" }}>
                        Phân loại hàng: {item.size}, {item.color}
                      </Typography>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary" style={{ color: "black" }}>
                          Số lượng: {item.productQuantity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" style={{ marginLeft: "710px", color: "red" }}>
                          đ{new Intl.NumberFormat('vi-VN').format(item.productPrice)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}

                <section
                  style={{
                    borderTop: '2px dashed rgba(128, 128, 128, 0.4)',
                    margin: '10px 0',
                    marginTop: "-10px",
                  }}
                />
                {status !== "Đã hủy" && (
                  <>
                    <TableContainer
                      component={Paper}
                      style={{ marginTop: '-10px', borderRadius: '0px', overflow: 'hidden' }}
                    >
                      <Table style={{ borderCollapse: 'collapse' }}>
                        <TableBody>
                          <TableRow style={{ border: '1px solid #ddd' }}>
                            <TableCell
                              align="right"
                              style={{ fontWeight: 'bold', padding: '12px 16px', border: '1px solid #ddd', width: '610px' }}
                            >
                              Tổng tiền hàng
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              đ{formattedTotalSubtotal}
                            </TableCell>
                          </TableRow>
                          <TableRow style={{ border: '1px solid #ddd' }}>
                            <TableCell
                              align="right"
                              style={{ fontWeight: 'bold', padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              Phí vận chuyển
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              đ{new Intl.NumberFormat('vi-VN').format(shippingFee)}
                            </TableCell>
                          </TableRow>
                          <TableRow style={{ border: '1px solid #ddd' }}>
                            <TableCell
                              align="right"
                              style={{ fontWeight: 'bold', padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              Thành tiền
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ padding: '12px 16px', color: '#f5222d', fontWeight: 'bold', border: '1px solid #ddd' }}
                            >
                              ₫{formattedFinalTotal}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>


                    <TableContainer
                      component={Paper}
                      style={{ marginTop: '-10px', borderRadius: '0px', overflow: 'hidden', border: '1px solid #ddd', marginTop: "10px" }}
                    >
                      <Table style={{ borderCollapse: 'collapse' }}>
                        <TableBody>
                          <TableRow style={{ border: '1px solid #ddd' }}>
                            <TableCell
                              align="right"
                              style={{ fontWeight: 'bold', padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              Phương thức thanh toán
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ padding: '12px 16px', border: '1px solid #ddd', width: '370px' }}
                            >
                              {payMethod}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                {status === "Đã hủy" && (
                  <>
                    <TableContainer
                      component={Paper}
                      style={{ marginTop: '-10px', borderRadius: '0px', overflow: 'hidden', marginTop: "10px" }}
                    >
                      <Table style={{ borderCollapse: 'collapse' }}>
                        <TableBody>
                          <TableRow style={{ border: '1px solid #ddd' }}>
                            <TableCell
                              align="right"
                              style={{ fontWeight: 'bold', padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              Phương thức thanh toán
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ padding: '12px 16px', border: '1px solid #ddd', width: '370px' }}
                            >
                              COD
                            </TableCell>
                          </TableRow>
                          <TableRow style={{ border: '1px solid #ddd' }}>
                            <TableCell
                              align="right"
                              style={{ fontWeight: 'bold', padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              Mã đơn hàng
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ padding: '12px 16px', border: '1px solid #ddd' }}
                            >
                              7945700590
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </ArgonBox>
      <Footer />
    </>
  );
};

export default HistoryOrderDetail;