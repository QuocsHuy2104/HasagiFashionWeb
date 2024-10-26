
import apiClient from "config/axiosConfig";


const CheckoutService = {
    postCheckout: (addressId, checkoutData) => {
        return apiClient.post(`/checkout/${addressId}`, checkoutData, { withCredentials: true });
    },
    
}

export default CheckoutService;