import { useEffect, useState } from 'react';
import axios from 'axios';
import cartService from "../../../services/ProductDetail";
const useCartQuantity = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchTotalQuantity = async () => {
        try {
            const response = await cartService.getAllShopDetail();
            setTotalQuantity(response.data);
        } catch (error) {
            console.error("Error fetching total quantity:", error.response?.data || error.message);
        }
    };
    

    useEffect(() => {
        fetchTotalQuantity();
        const intervalId = setInterval(() => {
            fetchTotalQuantity();
        }, 3000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return { totalQuantity, fetchTotalQuantity };
};

export default useCartQuantity;
