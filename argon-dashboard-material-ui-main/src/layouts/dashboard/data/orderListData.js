import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data without action buttons
const orderTableData = {
  columns: [
    { name: "ID", align: "left" },
    { name: "Username", align: "left" },
    { name: "Address", align: "left" },
    { name: "Created Date", align: "left" },
    { name: "Status", align: "left" },
    { name: "Action", align: "center" },
    { name: "Detail", align: "center" },
  ],
  rows: [
    {
      ID: "01",
      Username: "john_doe",
      Address: "123 Main St, City, Country",
      "Created Date": "2024-07-29",
      Status: "Pending",
    },
    // Thêm nhiều đối tượng hơn nếu cần
  ],
};
export default orderTableData;
