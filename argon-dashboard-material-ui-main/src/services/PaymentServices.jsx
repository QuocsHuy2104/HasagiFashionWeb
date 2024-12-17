import apiClient from 'config/axiosConfig';

const PaymentService = {
    PaymentMethods: async (data) => {
        try {
            const response = await apiClient.post('payment/create-payment-link', data);
            return response.data;
        } catch (error) {
            console.error('Error in PaymentMethods:', error);
            throw error;
        }
    },
    PaySuccess: async (params) => {
        try {
            const response = await apiClient.post("payment/OrderSummary", params); // Sử dụng POST và truyền params qua body
            return response.data;
        } catch (error) {
            console.error('Error in PaySuccess:', error);
            throw error; 
        }
    }


};

export default PaymentService;
