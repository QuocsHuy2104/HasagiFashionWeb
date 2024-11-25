import React, { useEffect, useState } from "react";

import ArgonBox from 'components/ArgonBox'
import Header from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter'
import Coupon from "./coupon";
import Policy from "./policy";
import Voucher from "./voucher";
import ImageCarousel from "components/client/HasagiCarousel";
import FeaturedProducts from "./sanpham";
import ChatBot from "components/client/HasagiChatBot";

const FeaturesAndAbout = () => {
  return (
    <>
      <Header />
      <ArgonBox px={20}>
        <ImageCarousel />
        <Policy />

        <Voucher />
        <FeaturedProducts />
      </ArgonBox>
      <Coupon />
      <ChatBot />
      <Footer /> 
    </>
  )
};
export default FeaturesAndAbout;
