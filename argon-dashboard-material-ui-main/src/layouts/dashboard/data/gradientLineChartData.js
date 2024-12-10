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

import React, { useEffect, useState } from "react";
import RevenueService from "services/RevenueServices";

const gradientLineChartData = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Doanh Thu",
        color: "info",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RevenueService.getLast12Months();
        const apiData = response.data;
        const labels = apiData.map((item) => item.month).reverse();
        const data = apiData.map((item) => item.revenue).reverse();

        setChartData({
          labels,
          datasets: [
            {
              label: "Doanh Thu",
              color: "info",
              data,
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };

    fetchData();
  }, []);

  return chartData;
};

export default gradientLineChartData;
