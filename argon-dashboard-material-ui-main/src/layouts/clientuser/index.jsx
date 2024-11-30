import React, { useEffect, useState } from "react";

import ArgonBox from 'components/ArgonBox'
import Header from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter'
import Coupon from "./coupon";
import Policy from "./policy";
import ImageCarousel from "components/client/HasagiCarousel";
import FeaturedProducts from "./sanpham";
import ChatBot from "components/client/HasagiChatBot";
import VoucherList from "components/client/HasagiVorcher";

const FeaturesAndAbout = () => {
  return (
    <>
      <Header />
      <ArgonBox pt={10} px={20}>
        <ImageCarousel />
        <Policy />

        <VoucherList />
        <FeaturedProducts />
      </ArgonBox>
      <Coupon />
    
      <Footer /> 
    </>
  )
};
export default FeaturesAndAbout;
