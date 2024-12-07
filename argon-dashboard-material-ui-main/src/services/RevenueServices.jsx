import apiClient from 'config/axiosConfig';

const RevenueService = {
    getLast12Months: () => apiClient.get('/admin/revenue/last-12-months'),
}

export default RevenueService;