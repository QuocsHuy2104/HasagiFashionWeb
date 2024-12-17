import React, { useEffect, useState } from "react";

import ArgonBox from "components/ArgonBox";
import Header from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import Coupon from "./coupon";
import Policy from "./policy";
import ImageCarousel from "components/client/HasagiCarousel";
import FeaturedProducts from "./sanpham";
import ChatBot from "components/client/HasagiChatBot";
import ListCategories from "./categories";
import SaleProduct from "./saleProduct";
import CircularProgress from "@mui/material/CircularProgress"; // Thêm spinner từ Material-UI


const FeaturesAndAbout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1800));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <ArgonBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </ArgonBox>
      ) : (
        <>
          <ArgonBox px={20}>
            <ImageCarousel />
            <Policy />
            <FeaturedProducts />
            <ListCategories />
            <SaleProduct />
          </ArgonBox>
          <Coupon />
          <ChatBot />
        </>
      )}
      <Footer />
    </>
  );
};

export default FeaturesAndAbout;
