import apiClient from "config/axiosConfig";

const OrderService = {
  getAllOrder: () => apiClient.get('/order'),

}

export default OrderService;