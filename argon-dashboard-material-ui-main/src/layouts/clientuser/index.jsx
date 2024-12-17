import React, { useEffect, useState } from "react";
import ArgonBox from 'components/ArgonBox'
import Header from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter'
import Policy from "./policy";
import Voucher from "../../components/client/HasagiVorcher/index"
import ImageCarousel from "components/client/HasagiCarousel";
import FeaturedProducts from "./sanpham";
import ChatBot from "components/client/HasagiChatBot";
import ListCategories from './categories'
import SaleProduct from "./saleProduct";

const FeaturesAndAbout = () => {

  
  return (
    <>
      <Header />
      <ArgonBox pt={10} px={20}>
        <ImageCarousel />
        <Policy />
        <Voucher />
        <SaleProduct />
        <ListCategories />
        <FeaturedProducts />
      </ArgonBox>
      <ChatBot />
      <Footer />
    </>
  )
};
export default FeaturesAndAbout;