import React, { useEffect, useState } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';

const HistoryOrderDetail = () => {
  const { orderId } = useParams(); // Get the orderId from the URL parameters
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingFee, setShippingFee] = useState(0); // State to store shipping fee
 const [status,setStatus] = useState(null);
 const navigate = useNavigate();
  useEffect(() => {
    console.log("Fetching order details for ID:", orderId);
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
            const fee = data[0].shippingFee; // Get the shipping fee from the first item
            setShippingFee(fee);
            const orderStatus = data[0].statusName; // Adjust to fetch status from first item
          setStatus(orderStatus);
            console.log("Shipping Fee:", fee); // Log the shipping fee
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

  // Calculate total product cost (excluding shipping fee)
  const totalProductCost = orderDetails.reduce((total, item) => {
    return total + (item.productPrice * item.productQuantity);
  }, 0);

  // Calculate the final total including the shipping fee
  const finalTotal = totalProductCost + shippingFee;
const goback  = ()=>{
  navigate(`/History`);
}

  return (
    <div className="history-order-detail">
      <div className="header">
        <button className="back-button" onClick={() => goback()}>
          <i className="ni ni-bold-left" /> 
        </button>
        <h3>Chi tiết Đơn hàng</h3>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
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
                <td>{item.productName}</td>
                <td><img src={item.imageUrl} alt={item.productName} style={{ width: '50px', height: '50px' }} /></td>
                <td>{item.productPrice} VND</td>
                <td>{item.productQuantity}</td>
                <td>{item.size || 'N/A'}</td>
                <td>{item.color || 'N/A'}</td>
                <td>{item.productPrice * item.productQuantity} VND</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="order-summary">
        <div className="shipping-fee">
          <strong>Phí Ship:</strong> {shippingFee} VND
        </div>
        <div className="status">
          <strong>Trạng thái:</strong> {status}
        </div>
        <div className="total">
          <strong>Tổng tiền:</strong> {finalTotal} VND
        </div>
      </div>

      <style>{`
        .history-order-detail {
          padding: 20px;
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
        }
        .order-table th, .order-table td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
        }
        .order-table th {
          background-color: #212529;
          color: white;
        }
        .order-summary {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
        }
        .shipping-fee {
          background-color: #ffc107;
          padding: 10px;
          color: black;
        }
        .status {
          background-color: #17a2b8;
          padding: 10px;
          color: white;
        }
        .total {
          background-color: #28a745;
          padding: 10px;
          color: white;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default HistoryOrderDetail;
