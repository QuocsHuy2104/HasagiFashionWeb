import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Card from "@mui/material/Card";
import ArgonBox from "components/ArgonBox";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import ArgonTypography from "components/ArgonTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import { format } from "date-fns";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

function Flashsale() {
  const [flashsale, setFlashsale] = useState([]); 
  const [flashSaleName, setFlashSaleName] = useState(""); 
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productDetails, setProductDetails] = useState([]);  // To store the product details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductDetailIds, setSelectedProductDetailIds] = useState([]);  
  const [selectedFlashSaleId, setSelectedFlashSaleId] = useState(null); 
  
  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      // Add the product ID to the selected list
      setSelectedProductDetailIds((prev) => [...prev, id]);
    } else {
      // Remove the product ID from the selected list
      setSelectedProductDetailIds((prev) => prev.filter((productId) => productId !== id));
    }
  };
  
  
  
  const handleSave = async () => {
    // Kiểm tra xem đã chọn sản phẩm chưa
    if (!selectedProductDetailIds || selectedProductDetailIds.length === 0) {
      alert("Please select at least one product.");
      return;
    }
  
    if (!selectedFlashSaleId) {
      alert("Flash Sale ID cannot be null.");
      return;
    }
  
    // Tạo dữ liệu gửi đi, bao gồm cả danh sách ID sản phẩm và ID flash sale
    const updateData = {
      productDetailIds: selectedProductDetailIds,
      flashSaleId: selectedFlashSaleId,
    };
  
    console.log("Data being sent to API:", updateData); // In ra dữ liệu gửi đến API để kiểm tra
  
    try {
      // Gửi PUT request đến API
      const response = await axios.put(
        "http://localhost:3000/api/admin/flash_sale/update-flash-sale",
        updateData
      );
  
      alert("Flash Sale updated with selected products!");
      setIsModalOpen(false); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error("Error updating flash sale:", error);
      alert("Failed to update flash sale. " + (error.response ? error.response.data : error.message));
    }
  };
  
  
  

  const handleOpenModal = (flashsaleId) => {
    console.log("Flashsale ID:", flashsaleId); // Log the flashsaleId to the console
    setSelectedFlashSaleId(flashsaleId);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/flash_sale/detail");
      setProductDetails(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/flash_sale");
        const flashsaleData = response.data.map((flashsaleItem) => ({
          ...flashsaleItem,
          startDate: flashsaleItem.startDate
            ? format(new Date(flashsaleItem.startDate), "dd-MM-yyyy")
            : "Date not available",
          endDate: flashsaleItem.endDate
            ? format(new Date(flashsaleItem.endDate), "dd-MM-yyyy")
            : "Date not available",
        }));

        setFlashsale(flashsaleData);
      } catch (error) {
        console.error("Error fetching flash sales:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateFlashSale = async () => {
    if (!flashSaleName || !discountPercentage || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    const formattedStartDate = `${startDate}T00:00:00`;
    const formattedEndDate = `${endDate}T23:59:59`;
    const flashSaleData = {
      name: flashSaleName,
      startDate: formattedStartDate, 
      endDate: formattedEndDate,
      discountPercentage: parseFloat(discountPercentage),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/flash_sale/create",
        flashSaleData
      );

      setFlashsale((prevState) => [...prevState, response.data]);
      setFlashSaleName("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");

      alert("Flash Sale created successfully!");
    } catch (error) {
      console.error("Error creating flash sale:", error);
      alert("Failed to create flash sale.");
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: "startDate", headerName: "Ngày bắt đầu", flex: 1 },
    { field: "endDate", headerName: "Ngày kết thúc", flex: 1 },
    { field: "discountPercentage", headerName: "Giảm giá (%)", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <button
            onClick={() => handleOpenModal(params.row.id)}  // Pass the flashsale ID here
            style={{
              padding: "5px 10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            +
          </button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card sx={{ borderRadius: "15px", boxShadow: 3 }}>
            <ArgonBox display="flex" justifyContent="space-between" p={2} sx={{ borderRadius: "15px 15px 0 0" }}>
              <ArgonTypography variant="h6" color="dark">
                Manage Flash Sale
              </ArgonTypography>
            </ArgonBox>
            <ArgonBox p={3} sx={{ borderRadius: "0 0 15px 15px" }}>
              <ArgonBox mx={3}>
                <ArgonBox mb={3} position="relative">
                  <ArgonInput
                    type="text"
                    placeholder="Tên chương trình Flash Sale"
                    size="large"
                    value={flashSaleName}
                    onChange={(e) => setFlashSaleName(e.target.value)}
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                </ArgonBox>
                <ArgonBox mb={3} position="relative">
                  <ArgonInput
                    type="number"
                    placeholder="Giảm giá theo phần trăm"
                    size="large"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                </ArgonBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <ArgonBox mb={3} position="relative">
                      <ArgonInput
                        type="date"
                        size="large"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ bgcolor: "white", borderRadius: "8px", width: "100%" }}
                      />
                    </ArgonBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ArgonBox mb={3} position="relative">
                      <ArgonInput
                        type="date"
                        size="large"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ bgcolor: "white", borderRadius: "8px", width: "100%" }}
                      />
                    </ArgonBox>
                  </Grid>
                </Grid>
                <ArgonBox mb={3} sx={{ width: "100%" }}>
                  <ArgonButton
                    variant="gradient"
                    color="primary"
                    size="large"
                    onClick={handleCreateFlashSale}
                    sx={{ width: "100%" }}
                  >
                    Create Flash Sale
                  </ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>

      {/* Flash Sale Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Select Products for Flash Sale</DialogTitle>
        <DialogContent>
          <FormGroup>
            {productDetails.map((product) => (
              <FormControlLabel
                key={product.id}
                control={
                  <Checkbox
                    checked={selectedProductDetailIds.includes(product.id)}
                    onChange={(e) => handleCheckboxChange(e, product.id)}
                  />
                }
                label={product.name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <ArgonButton onClick={handleCloseModal} color="secondary">
            Cancel
          </ArgonButton>
          <ArgonButton onClick={handleSave} color="primary">
            Save
          </ArgonButton>
        </DialogActions>
      </Dialog>

      {/* Flash Sale Table */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={flashsale} columns={columns} pageSize={5} />
      </div>
    </DashboardLayout>
  );
}

export default Flashsale;
