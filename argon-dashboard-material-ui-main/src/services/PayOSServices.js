import apiClient from 'config/axiosConfig';

const Payment = {
  paymentMethod: apiClient.post('/payment/create-payment-link')
}

export default  Payment;