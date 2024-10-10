import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import Cookies from "js-cookie";

const HistoryOrderDetail = () => {
  const { orderId } = useParams(); // Get the orderId from the URL parameters
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingFee, setShippingFee] = useState(0); // State to store shipping fee
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const [fullNameAdd, setFullNameAdd] = useState('');

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalProductCost = orderDetails.reduce((total, item) => {
    return total + (item.productPrice * item.productQuantity);
  }, 0);

  const subtotalList = orderDetails.map(item => item.productPrice * item.productQuantity);
  const totalSubtotal = subtotalList.reduce((total, subtotal) => total + subtotal, 0);
  const finalTotal = totalSubtotal + shippingFee;

  const goBack = () => {
    navigate(`/History`);
  };


  const navbarStyle = {
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderBottom: 'white solid 1px',
    borderTop: 'white solid 1px',
};

const navMenuStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 auto', 
    display: 'flex',
    justifyContent: 'center', 
};

  return (
    <>
      <HasagiNav />
      <nav className="navbar navbar-expand-lg p-0 pt-5" style={navbarStyle}>
            <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                <div className="collapse navbar-collapse">
                    <ul className="nav-menu" style={navMenuStyle}>
                    <marquee>CẢM ƠN QUÝ KHÁCH ĐÃ MUA HÀNG!</marquee>
                    </ul>
                </div>
            </div>
        </nav>
      <div className="history-order-detail">
      <div className="header">
          <button className="back-button" onClick={() => goBack()}>
            <i className="ni ni-bold-left" />
          </button>
          <h5 className="section-title mb-1" style={{ fontWeight: "bold", fontSize: "24px", color: "#343a40", marginLeft: '-15px' }}>Chi tiết đơn hàng</h5>
        </div>

        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Người đặt hàng: {fullNameAdd}</h3>
          <div className="order-status">
            <strong>Trạng thái: </strong>
            <span>{status}</span>
          </div>
        </div>

        <table className="order-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Kích thước</th>
              <th>Màu sắc</th>
              <th>Tạm tính</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.length > 0 ? (
              orderDetails.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} className="product-image" /></td>
                  <td>{item.productName}</td>
                  <td>{item.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td>{item.productQuantity}</td>
                  <td>{item.size || 'N/A'}</td>
                  <td>{item.color || 'N/A'}</td>
                  <td>{new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.productPrice * item.productQuantity)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="order-summary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '320px', marginLeft: 'auto' }}>
          <div className="status" style={{ display: 'flex', justifyContent: 'space-between', width: '300px', marginBottom: '10px' }}>
            <strong>Tổng tiền:</strong>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSubtotal)}</span>
          </div>
          <div className="shipping-fee" style={{ display: 'flex', justifyContent: 'space-between', width: '300px', marginBottom: '10px' }}>
            <strong>Phí vận chuyển:</strong>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
          </div>
          <div className="total" style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
            <strong>Thành tiền:</strong>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}</span>
          </div>
        </div>

        <style>{`
          .history-order-detail {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          .back-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            margin-right: 20px;
          }
          .order-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
          }
          .order-table th, .order-table td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: center;
            transition: background-color 0.3s;
          }
          .order-table th {
            background-color: #212529;
            color: white;
            font-weight: bold;
          }
          .order-table tr:hover {
            background-color: #f1f1f1;
          }
          .product-image {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            object-fit: cover;
          }
          .order-summary {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .shipping-fee {
            background-color: #ffc107;
            padding: 10px;
            color: black;
            border-radius: 4px;
          }
          .status {
            background-color: #17a2b8;
            padding: 10px;
            color: white;
            border-radius: 4px;
          }
          .total {
            background-color: #28a745;
            padding: 10px;
            color: white;
            border-radius: 4px;
            text-align: right;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default HistoryOrderDetail;
