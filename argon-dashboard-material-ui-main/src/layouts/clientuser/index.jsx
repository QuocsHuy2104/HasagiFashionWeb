import React, { useEffect, useState } from "react";

import ArgonBox from 'components/ArgonBox'
import BestSeller from "./bestSeller";

const FeaturesAndAbout = () => {
  return ( 
    <>
      <ArgonBox py={7}>
        <BestSeller />
      </ArgonBox>
    </>
  )
};
export default FeaturesAndAbout;
