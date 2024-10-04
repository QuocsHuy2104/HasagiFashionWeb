import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import axios from 'axios';

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function OrderDetail() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orderdetails/${id}`); // Update URL as needed
        setOrderDetails(response.data);
      } catch (err) {
        setError("Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <ArgonTypography variant="body1">Loading...</ArgonTypography>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Order Detail</ArgonTypography>
            </ArgonBox>

            {error ? (
              <ArgonBox p={4}>
                <ArgonTypography variant="body1" color="error">
                  {error}
                </ArgonTypography>
              </ArgonBox>
            ) : orderDetails.length > 0 ? (
              <ArgonBox p={4}>
                {orderDetails.map((detail) => (
                  <div key={detail.id}>
                    <ArgonTypography variant="body1">
                      Order ID: {detail.orderId}
                    </ArgonTypography>
                    <ArgonTypography variant="body1">
                      Price: {detail.price}
                    </ArgonTypography>
                    <ArgonTypography variant="body1">
                      Quantity: {detail.quantity}
                    </ArgonTypography>
                    <ArgonTypography variant="body1">
                      Product Detail ID: {detail.productDetailId}
                    </ArgonTypography>
                    <hr />
                  </div>
                ))}
              </ArgonBox>
            ) : (
              <ArgonBox p={4}>
                <ArgonTypography variant="body1">No details found.</ArgonTypography>
              </ArgonBox>
            )}
          </Card>
        </ArgonBox>
      </ArgonBox>

      <Footer />
    </DashboardLayout>
  );
}

export default OrderDetail;
