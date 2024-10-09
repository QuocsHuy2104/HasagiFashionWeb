import React, { useEffect, useState } from "react";

import ArgonBox from 'components/ArgonBox'
import BestSeller from "./bestSeller";
import Header from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter'
import Coupon from "./coupon";
import Policy from "./policy";
import Voucher from "./voucher";
import ImageCarousel from "components/client/HasagiCarousel";
import NewProduct from "./newPD";


const FeaturesAndAbout = () => {
  return (
    <>
      <Header />
      <ArgonBox px={20}>
        <ImageCarousel />
        <Policy />
        <BestSeller />
        <Voucher />
        <NewProduct />
      </ArgonBox>
      <Coupon />
      <Footer />
    </>
  )
};
export default FeaturesAndAbout;
