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
function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 }); // Pagination state
  const [provinces, setProvinces] = useState([]);
  const [districtsByProvince, setDistrictsByProvince] = useState({});
  const [wardsByDistrict, setWardsByDistrict] = useState({});
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

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
        headers: { 'Token': '8d0588cd-65d9-11ef-b3c4-52669f455b4f' },
        params: { province_id: provinceId }
      });
      setDistrictsByProvince(prev => ({ ...prev, [provinceId]: response.data.data }));
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
      setWardsByDistrict(prev => ({ ...prev, [districtId]: response.data.data }));
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

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    const uniqueProvinceIds = new Set(filteredOrders.map(order => order.provinceID));
    uniqueProvinceIds.forEach(provinceId => {
      if (provinceId) {
        fetchDistricts(provinceId);
      }
    });
  }, [filteredOrders]);

  useEffect(() => {
    const uniqueDistrictIds = new Set(filteredOrders.map(order => order.districtCode));
    uniqueDistrictIds.forEach(districtId => {
      if (districtId) {
        fetchWards(districtId);
      }
    });
  }, [filteredOrders]);


  const handleSearch = (event) => {
    event.preventDefault();

    const status = event.target.status.value;
    const endDate = event.target.endDate.value
      ? new Date(event.target.endDate.value)
      : null;
    const phoneNumber = event.target.phoneNumber.value;

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);

      const isStatusMatch =
        status === "all" ? true : order.statusId === parseInt(status);
      const isDateMatch = endDate ? orderDate <= endDate : true;
      const isPhoneMatch = phoneNumber
        ? order.numberPhone.includes(phoneNumber)
        : true;

      return isStatusMatch && isDateMatch && isPhoneMatch;
    });

    setFilteredOrders(filteredOrders);
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
          statuses.find((status) => status.id === order.statusId)?.statusName ||
          "Unknown",
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

  const handleReset = () => {
    setFilteredOrders(orders);
    setPaginationModel({ page: 0, pageSize: 5 });
  };
  
  const columns = [
  
    
    { field: "fullNameAddress", headerName: "Full Name",    flex: 1 },
    
    { field: "orderDate", headerName: "Order Date",    flex: 1 },
    { field: "numberPhone", headerName: "Phone Number",    flex: 1},
    { field: "amount", headerName: "Amount",    flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const order = params.row;
        const currentStatus = order.slug;
        const getNextStatus = (currentStatus) => {
          const availableStatuses = ['dang-xac-nhan', 'da-xac-nhan', 'dang-giao'];
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
                {currentStatus !== 'huy-don-hang' && (
                  <ArgonButton
                    size="small"
                    color="primary"
                    onClick={() => handleNextStatus(order.id, currentStatus, getNextStatus)}
                  >
                    {statuses.find(status => status.slug === nextStatus)?.status || 'Unknown'}
                  </ArgonButton>
                )}
                {['dang-xac-nhan', 'da-xac-nhan'].includes(currentStatus) && (
                  <ArgonButton
                    size="small"
                    color="error"
                    onClick={() => handleStatusChange(order.id, 'huy-don-hang')}
                    style={{ marginLeft: '10px' }}
                  >
                    Hủy Đơn Hàng
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
    const nextStatusSlug = getNextStatus(currentStatus); // Get the next status slug
  
    if (nextStatusSlug) {
      try {
        await axios.put(`http://localhost:3000/api/order/${orderId}`, { slug: nextStatusSlug });
  
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, slug: nextStatusSlug } : order
          )
        );
  
        setFilteredOrders(prevFilteredOrders =>
          prevFilteredOrders.map(order =>
            order.id === orderId ? { ...order, slug: nextStatusSlug } : order
          )
        );
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
                  <select
                    name="status"
                    defaultValue="all"
                    size="large"
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="all">All</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.status}
                      </option>
                    ))}
                  </select>
                </ArgonBox>

                <ArgonBox mb={3} mx={3} width="100%" sm={6} md={4}>
                  <ArgonInput
                    name="endDate"
                    type="date"
                    placeholder="Select End Date"
                    size="large"
                    error={false}
                    className="form-control"
                  />
                </ArgonBox>

                <ArgonBox mb={3} mx={3} width="100%" sm={6} md={4}>
                  <ArgonInput
                    name="phoneNumber"
                    type="text"
                    placeholder="Enter Phone Number"
                    size="large"
                    error={false}
                    className="form-control"
                  />
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
          <Paper style={{ width: "100%", height: 400 }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]} 
              disableSelectionOnClick
              sx={{
                "& .MuiDataGrid-footerContainer": {
                  justifyContent: "space-between", 
                },
                "& .MuiTablePagination-selectLabel": {
                  marginRight: 0,
                },
                "& .MuiTablePagination-root": {
                  width: "400px", 
                },
                "& .MuiInputBase-root": {
                  maxWidth: "60px", 
                },
              }}
            />
          </Paper>
        </ArgonBox>
      </ArgonBox>
    </DashboardLayout>
  );
}

export default Order;