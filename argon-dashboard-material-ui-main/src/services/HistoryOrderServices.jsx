
import apiClient from "config/axiosConfig";


const HistoryOrderService = {
    getHistory: () =>   apiClient.get('/history-order'),   
    getBuyAgain: (orderId) => {
        return apiClient.post(`/history-order/buy-again/${orderId}`)
            .then(response => {
                return response.data; // Handle response appropriately
            })
            .catch(error => {
                console.error("Error adding products to cart from order:", error);
                throw error; // Propagate error
            });
    }
}

export default HistoryOrderService;