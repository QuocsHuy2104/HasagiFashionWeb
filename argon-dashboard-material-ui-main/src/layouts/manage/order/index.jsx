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
function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order");
        if (response.data && response.data.orders) {
          console.log(response.data);
          const orders = response.data.orders.map(order => ({
            ...order,
            orderDate: order.orderDate ? format(new Date(order.orderDate), "dd-MM-yyyy") : "Date not available"
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

    const statusSlug = event.target.status.value; // Get the selected status slug
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
        Amount: order.amount,
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
    { field: "fullNameAddress", headerName: "Full Name", flex: 1 },
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
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                fontSize: "1rem", // Giảm kích thước chữ trong các ô của bảng
                padding: "4px", // Giảm padding để làm cho nội dung trong ô gần nhau hơn
              },
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "0.8rem", // Giảm kích thước chữ trong tiêu đề cột
              },
              "& .MuiTablePagination-root": {
                fontSize: "0.75rem", // Giảm kích thước chữ cho phần "Rows per page"
                minHeight: "30px", // Giảm chiều cao tối thiểu
              },
              "& .MuiTablePagination-select": {
                fontSize: "0.75rem", // Giảm kích thước chữ trong phần lựa chọn số hàng
                padding: "4px", // Giảm padding để nhỏ hơn
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "1rem", // Giảm kích thước chữ trong phần số trang được hiển thị
              },
            }}
            rowHeight={100} // Giảm chiều cao hàng để bảng trông nhỏ gọn hơn
          />
        </Paper>
        </ArgonBox>
      </ArgonBox>
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {selectedOrder.map(detail => (
                <li key={detail.id} style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                  <div>
                    <strong>Product ID:</strong> {detail.productDetailId}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {detail.quantity}
                  </div>
                  <div>
                    <strong>Price:</strong> ${detail.price.toFixed(2)}
                  </div>
                  <div>
                    <strong>Name:</strong> {detail.nameOrder}
                  </div>
                  <div>
                    <strong>Size:</strong> {detail.sizeName}
                  </div>
                  <div>
                    <strong>Color:</strong> {detail.colorName}
                  </div>
                  <div>
                    <strong>Status:</strong> {detail.statusName}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <ArgonButton variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </ArgonButton>
        </Modal.Footer>
      </Modal>

    </DashboardLayout>
  );
}

export default Order;