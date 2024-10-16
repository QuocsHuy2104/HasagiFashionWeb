import apiClient from 'config/axiosConfig';

const PaymentService = {
    PaymentMethods: async () => {
        try {
            const response = await apiClient.post('payment/create-payment-link');
            return response.data;
        } catch (error) {
            console.error('Error creating payment link:', error);
            throw error;
        }
    }
};

export default PaymentService;
