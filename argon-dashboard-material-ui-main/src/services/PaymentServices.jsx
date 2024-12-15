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
            const response = await apiClient.get("payment/OrderSummary", {
                params: params // Đảm bảo tham số được truyền vào đúng
            });
            return response.data;
        } catch (error) {
            console.error('Error in PaySuccess:', error);
            throw error;
        }
    }

};

export default PaymentService;
