/* eslint-disable no-unused-vars */
/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";

// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";
import { useEffect, useState } from "react";
import RevenueService from "services/RevenueServices";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card } from "@mui/material";

function Default() {
  const { size } = typography;
  const chartData = gradientLineChartData();
  const [today, setToday] = useState(0);
  const [order, setOrder] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);
  const [yesterday, setPercentChange] = useState(0);
  const [dataPolar, setPolar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, res2, res3, res4, res5] = await Promise.all([
          RevenueService.getToday(),
          RevenueService.getThisMonth(),
          RevenueService.getYesterday(),
          RevenueService.getOrderToday(),
          RevenueService.getLessThan(),

        ]);
        setToday(res.data);
        setThisMonth(res2.data);
        setPercentChange(res3.data);
        setOrder(res4.data);
        setPolar(res5.data);
        if (res3.data > 0) {
          const change = ((res.data - res3.data) / res3.data) * 100;
          setPercentChange(change.toFixed(2)); // Giữ 2 chữ số thập phân
        } else {
          setPercentChange(0); // Tránh chia cho 0
        }
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Doanh thu hôm nay"
              count={`${today.toLocaleString()} đ`}
              icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
              percentage={{
                color: yesterday > 0 ? "success" : "error",
                count: `${yesterday}%`,
                text: "kể từ hôm qua",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Doanh thu tháng"
              count={`${thisMonth.toLocaleString()} đ`}
              icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
              percentage={{ color: "success", count: "+55%", text: "kể từ hôm qua" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Đơn hàng hôm nay"
              count={order}
              icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
              percentage={{ color: "error", count: "-2%", text: "since last quarter" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="sales"
              count="$103,430"
              icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
              percentage={{ color: "success", count: "+5%", text: "than last month" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: "100%" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead sx={{ width :"100%"}}>
                    <TableRow>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="right">Số lượng còn</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPolar.map(pd => (
                      <TableRow
                        key={pd.name}
                      >
                        <TableCell scope="row">
                          {pd.name}
                        </TableCell>
                        <TableCell align="right">{pd.importQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} lg={8}>
            <GradientLineChart
              title="Thống kê doanh thu"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox
                    fontSize={typography.size.lg}
                    color="success"
                    mb={0.3}
                    mr={0.5}
                    lineHeight={0}
                  >
                    <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                  </ArgonBox>
                  <ArgonTypography variant="button" color="text" fontWeight="medium">
                    Doanh thu{" "}
                    <ArgonTypography variant="button" color="text" fontWeight="regular">
                      năm {new Date().getFullYear()}
                    </ArgonTypography>
                  </ArgonTypography>
                </ArgonBox>
              }
              chart={chartData}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SalesTable title="Sales by Country" rows={salesTableData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CategoriesList title="categories" categories={categoriesListData} />
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;