import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
const useCartQuantity = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchTotalQuantity = async () => {
        const accountId = Cookies.get('accountId');
        try {
           
            const response = await axios.get(`http://localhost:3000/api/cart/totalQuantity?accountId=${accountId}`, { withCredentials: true });
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
