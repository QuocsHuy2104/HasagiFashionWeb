import { useEffect, useState } from 'react';
import axios from 'axios';
import cartService from "../../../services/ProductDetail";
const useCartQuantity = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchTotalQuantity = async () => {
        try {
            const response = await cartService.getAllShopDetail();
            console.log(response); // Kiểm tra phản hồi từ server
            setTotalQuantity(response.data);
        } catch (error) {
            console.error("Error fetching total quantity:", error.response?.data || error.message);
        }
    };
    

    useEffect(() => {
        fetchTotalQuantity();
    }, []);

    return { totalQuantity, fetchTotalQuantity };
};

export default useCartQuantity;
