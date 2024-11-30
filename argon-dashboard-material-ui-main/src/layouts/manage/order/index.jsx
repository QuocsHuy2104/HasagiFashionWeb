import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Card from "@mui/material/Card";
import ArgonBox from "components/ArgonBox";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import ArgonTypography from "components/ArgonTypography";
import { format } from "date-fns";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Modal from "react-bootstrap/Modal";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button'
import './style.css'; 
import logo from "components/client/assets/images/logo.png";
function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [voucherPrice, setVoucherPrice] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [nameOrder, setNameOrder] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [orderDate, setOrderDate] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order");
        if (response.data && response.data.orders) {
          console.log(response.data);
          const orders = response.data.orders.map(order => ({
            ...order,
            orderDate: order.orderDate ? format(new Date(order.orderDate), "dd-MM-yyyy") : "Date not available",
            amount : new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.amount),
            
          }));
          setOrders(orders);
          setFilteredOrders(orders);
        }
        if (response.data && response.data.statuses) {
          setStatuses(response.data.statuses);
        }
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const statusSlug = event.target.status.value; 
    const endDateInput = event.target.endDate.value
      ? new Date(event.target.endDate.value)
      : null;
    const phoneNumber = event.target.phoneNumber.value;

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);

      // Match the slug with order.slug
      const isStatusMatch = statusSlug === "all" ? true : order.slug === statusSlug;

      const isDateMatch = endDateInput ? orderDate <= endDateInput : true;

      const isPhoneMatch = phoneNumber
        ? order.numberPhone.includes(phoneNumber)
        : true;

      return isStatusMatch && isDateMatch && isPhoneMatch;
    });

    setFilteredOrders(filteredOrders);
  };
  const handleRowClick = async (params, event) => {
    // Kiểm tra nếu cột được bấm không phải là "status"
    if (params.field !== "status") {
      const orderId = params.row.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/orderdetails/${orderId}`);
        setSelectedOrder(response.data);
        const fee = response.data[0].shippingPrice;
        setShippingFee(fee);
        setVoucherPrice(response.data[0].voucherDiscount);
        setNumberPhone(response.data[0].numberPhone)
        setFullAddress(response.data[0].fullNameAddress)
        setNameOrder(response.data[0].nameOrder)
        setOrderDate(format(new Date(response.data[0].orderDate), "dd-MM-yyyy"))
        setShowDetailsModal(true);
      } catch (error) {
        console.error("Error fetching order details", error);
      }
    }
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order) => ({
        "Order ID": order.id,
        "Order Date": format(new Date(order.orderDate), "dd-MM-yyyy"),
        "Full Name": order.fullName,
        "Phone Number": order.numberPhone,
        Address: order.fullNameAddress,
        "Pay Method": order.payMethod,
        "Pay Status": order.payStatus,
        "Shipping Fee": order.shippingFree,
      "Amount": new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
}).format(order.amount),


        Status:
          statuses.find((status) => status.slug === order.slug)?.status || "Unknown",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "orders_summary.xlsx");
  };

  const handleReset = () => {
    setFilteredOrders(orders);
    setPaginationModel({ page: 0, pageSize: 5 });
  };

  const columns = [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "orderDate", headerName: "Order Date", flex: 1 },
    { field: "numberPhone", headerName: "Phone Number", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const order = params.row;
        const currentStatus = order.slug;
        const getNextStatus = (currentStatus) => {
          const availableStatuses = ['dang-xu-ly', 'dang-giao'];
          const currentIndex = availableStatuses.indexOf(currentStatus);

          if (currentIndex >= 0 && currentIndex < availableStatuses.length - 1) {
            return availableStatuses[currentIndex + 1];
          } else if (currentStatus === 'dang-giao') {
            return 'da-giao';
          }
          return null;
        };

        const nextStatus = getNextStatus(currentStatus);

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: '10px' }}>
              {statuses.find(status => status.slug === currentStatus)?.status || 'Unknown'}
            </span>
            {currentStatus !== 'hoan-thanh' && currentStatus !== 'da-giao' && (
              <>
                {currentStatus !== 'da-huy' && (
                  <ArgonButton
                    size="small"
                    color="primary"
                    onClick={() => handleNextStatus(order.id, currentStatus, getNextStatus)}
                  >
                    {statuses.find(status => status.slug === nextStatus)?.status || 'Unknown'}
                  </ArgonButton>
                )}
                {['dang-xu-ly'].includes(currentStatus) && (
                  <ArgonButton
                    size="small"
                    color="error"
                    onClick={() => handleStatusChange(order.id, 'da-huy')}
                    style={{ marginLeft: '10px' }}
                  >
                    Hủy
                  </ArgonButton>
                )}
              </>
            )}
          </div>
        );
      },
    }

  ];



  const handleStatusChange = async (orderId, newStatusSlug) => {
    try {
      await axios.put(`http://localhost:3000/api/order/${orderId}`, { slug: newStatusSlug });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, slug: newStatusSlug } : order
        )
      );

      setFilteredOrders(prevFilteredOrders =>
        prevFilteredOrders.map(order =>
          order.id === orderId ? { ...order, slug: newStatusSlug } : order
        )
      );
    } catch (error) {
      console.error("There was an error updating the status!", error);
    }
  };


  const handleNextStatus = async (orderId, currentStatus, getNextStatus) => {
    const nextStatusSlug = getNextStatus(currentStatus);

    if (nextStatusSlug) {
      try {
        await axios.put(`http://localhost:3000/api/order/${orderId}`, { slug: nextStatusSlug });

        setOrders(prevOrders =>
          prevOrders.map(order => (order.id === orderId ? { ...order, slug: nextStatusSlug } : order))
        );
        setFilteredOrders(prevFilteredOrders =>
          prevFilteredOrders.map(order => (order.id === orderId ? { ...order, slug: nextStatusSlug } : order))
        );
        setShowDetailsModal(false);
      } catch (error) {
        console.error("There was an error updating the status!", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox component="form" role="form" onSubmit={handleSearch} p={3}>
              <ArgonTypography variant="h6">Search Orders</ArgonTypography>
              <ArgonBox
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <ArgonBox mb={3} mx={3} width="100%" sm={6} md={4}>
                  <select name="status" defaultValue="all" size="large" className="form-select">
                    <option value="" disabled>Select Status</option>
                    <option value="all">All</option>
                    {statuses.map((status) => (
                      <option key={status.slug} value={status.slug}>
                        {status.status}
                      </option>
                    ))}
                  </select>
                </ArgonBox>

                <ArgonBox mb={3} mx={3} width="100%" sm={6} md={4}>
                  <ArgonInput name="endDate" type="date" placeholder="Select End Date" size="large" />
                </ArgonBox>

                <ArgonBox mb={3} mx={3} width="100%" sm={6} md={4}>
                  <ArgonInput name="phoneNumber" type="text" placeholder="Enter Phone Number" size="large" />
                </ArgonBox>

                <ArgonBox
                  mb={3}
                  mx={3}
                  width="100%"
                  sm={12}
                  md={4}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <ArgonButton type="submit" color="primary">
                    Search
                  </ArgonButton>
                  <ArgonButton type="button" onClick={handleReset} color="secondary">
                    Reset
                  </ArgonButton>
                  <ArgonButton type="button" onClick={exportToExcel} color="success">
                    Export
                  </ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </ArgonBox>
          </Card>
        </ArgonBox>
        <ArgonBox>
        <Paper style={{ height: 420, width: "100%" }}>
          <DataGrid
            onCellClick={handleRowClick}
            rows={filteredOrders}
            columns={columns}
            pageSize={5}
            pageSizeOptions={[5, 10, 20]} 
            checkboxSelection
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-footerContainer": {
                  justifyContent: "space-between", // Center-align the footer content
              },
              "& .MuiTablePagination-selectLabel": {
                  marginRight: 0, // Adjusts the right margin for the label
              },
              "& .MuiTablePagination-root": {
                  width: "400px", // Adjusts the total pagination width
              },
              "& .MuiInputBase-root": {
                  maxWidth: "60px",
                  marginTop: "-10px", // Điều chỉnh giá trị này để đẩy nó lên trên
              },
              "& .MuiTablePagination-actions": {
                  display: "flex",
                  alignItems: "center",
              },
              "& .MuiSelect-select": {
                  paddingRight: "24px", // Adjust padding for dropdown
              },
              border: 0,
          }}
      />
        </Paper>
        </ArgonBox>
      </ArgonBox>


      <Dialog
  open={showDetailsModal}
  onClose={() => setShowDetailsModal(false)}
  aria-labelledby="order-details-dialog"
  fullWidth
  maxWidth="sm" 
>
<div>
  <DialogTitle
    style={{
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      fontWeight: "bold",
      borderBottom: "1px solid #ccc",
      paddingBottom: "10px",
      marginBottom: "10px",
    }}
  >
    <img
      src={logo}
      alt="logo"
      style={{
        maxWidth: "230px",
        maxHeight: "100px",
        marginRight: "15px",
      }}
    />
    <div style={{ lineHeight: "1.5" }}>
      <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
        HASAGIFASHION
      </p>
      <p style={{ margin: 0, fontSize: "14px", fontWeight: "normal" }}>
        ĐC: 49 Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, Việt Nam
      </p>
      <p style={{ margin: 0, fontSize: "14px", fontWeight: "normal" }}>
        ĐT: 0911 012 689
      </p>
    </div>
  </DialogTitle>
  <div
    id="order-details-dialog"
    style={{
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "20px",
      marginTop: "10px",
    }}
  >
    Hóa đơn thanh toán
  </div>
</div>



  <DialogContent dividers>
    {selectedOrder ? (
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
  <div
    style={{
      flex: "1",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    }}
  >
    <h3
      style={{
        fontSize: "16px",
        fontWeight: "bold",
        margin: "0 0 10px 0",
        borderBottom: "1px solid #ddd",
        paddingBottom: "5px",
      }}
    >
      Thông tin người đặt
    </h3>
    <p style={{ margin: "5px 0" }}>
      <strong>Tên khách hàng:</strong>  {nameOrder}
    </p>
    <p style={{ margin: "5px 0" }}>
      <strong>Địa chỉ giao hàng:</strong> {fullAddress}
    </p>
    <p style={{ margin: "5px 0" }}>
      <strong>Số điện thoại:</strong> {numberPhone}
    </p>
    <p style={{ margin: "5px 0" }}>
      <strong>Ngày đặt hàng:</strong> {orderDate}
    </p>
  </div>

<br/>

        <div style={{ marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", textAlign: "left" }}>
  <thead>
    <tr style={{ backgroundColor: "#f8f8f8", borderBottom: "2px solid #ddd" }}>
      <th style={{ padding: "10px", fontWeight: "bold" }}>Tên sản phẩm</th>
      <th style={{ padding: "10px", fontWeight: "bold", textAlign: "center" }}>Số lượng</th>
      <th style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>Giá sản phẩm</th>
      <th style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>Tổng tiền</th>
    </tr>
  </thead>
  <tbody>
    {selectedOrder.map((detail, index) => (
      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
        <td style={{ padding: "10px" }}>{detail.productName}</td>
        <td style={{ padding: "10px", textAlign: "center" }}>{detail.quantity}</td>
        <td style={{ padding: "10px", textAlign: "right" }}>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(detail.price+detail.priceSize)}
        </td>
        <td style={{ padding: "10px", textAlign: "right" }}>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((detail.price+detail.priceSize)*detail.quantity)}
        </td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr style={{ backgroundColor: "#f8f8f8", borderTop: "2px solid #ddd" }}>
      <td colSpan="3" style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
        Tổng số tiền
      </td>
      <td style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          selectedOrder.reduce((sum, detail) => sum + (detail.price+detail.priceSize)*detail.quantity, 0)
        )}
      </td>
    </tr>
    {voucherPrice !== 0 && (
    <tr style={{ backgroundColor: "#f8f8f8", borderTop: "2px solid #ddd" }}>
      <td colSpan="3" style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
        Giảm giá
      </td>
      <td style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
    -{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          selectedOrder.reduce((sum, detail) => sum + (detail.price+detail.priceSize)*detail.quantity, 0) *voucherPrice/100
        )}
      </td>
    </tr>
    )}
    <tr style={{ backgroundColor: "#f8f8f8", borderTop: "2px solid #ddd" }}>
      <td colSpan="3" style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
        Phí vận chuyển
      </td>
      <td style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingFee)}
      </td>
    </tr>
  </tfoot>
</table>

</div>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <strong>Thành tiền: </strong>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          selectedOrder.reduce((sum, detail) => sum + (detail.price+detail.priceSize)*detail.quantity, 0) + shippingFee
        )}
        </div>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
    <p style={{ margin: 0, fontSize: "14px" }}>
   Xin cảm ơn quý khách và xin hẹn gặp lại
    </p>
  </div>


      </div>
    ) : (
      <p>Loading...</p>
    )}
  </DialogContent>
  <DialogActions style={{ padding: "10px" }}>
    <button
      className="hide-on-print"
      style={{
        padding: "6px 12px",
        backgroundColor: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginRight: "10px",
      }}
      onClick={() => setShowDetailsModal(false)}
    >
      Đóng
    </button>
    <button
      className="hide-on-print"
      style={{
        padding: "6px 12px",
        backgroundColor: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={() => window.print()}
    >
      Xuất hóa đơn 
    </button>
  </DialogActions>

</Dialog>

    </DashboardLayout>
  );
}

export default Order;