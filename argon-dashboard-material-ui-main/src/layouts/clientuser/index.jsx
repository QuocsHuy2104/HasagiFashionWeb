import React, { useEffect, useState } from "react";

import ArgonBox from 'components/ArgonBox'
import BestSeller from "./bestSeller";
import Header from 'components/client/HasagiHeader';
import Footer from 'components/client/HasagiFooter'
import Coupon from "./coupon";
import Policy from "./policy";
import Voucher from "./voucher";
import Sanpham from "./sanpham"
const FeaturesAndAbout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); 
    };

    const filteredProducts = products.filter((product) => {
    
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearchTerm;
  });
  return (
    <>
      <Header onSearch={handleSearch} />
      <ArgonBox px={20}>
        <Policy />
        <BestSeller />
        <Voucher />
        <Sanpham searchTerm={searchTerm} />
      </ArgonBox>
      <Coupon />
      <Footer />
    </>
  )
};
export default FeaturesAndAbout;
