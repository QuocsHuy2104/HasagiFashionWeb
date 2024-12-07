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
    }
};

export default PaymentService;
