import React, { useEffect, useState } from "react";

import ArgonBox from 'components/ArgonBox'
import BestSeller from "./bestSeller";
import Header from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter'
import Coupon from "./coupon";
import Policy from "./policy";
import Voucher from "./voucher";


const FeaturesAndAbout = () => {
  return (
    <>
      <Header />
      <ArgonBox px={20}>
        <Policy />
        <BestSeller />
        <Voucher />
      </ArgonBox>
      <Coupon />
      <Footer />
    </>
  )
};
export default FeaturesAndAbout;
