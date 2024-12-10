import apiClient from 'config/axiosConfig';

const RevenueService = {
    getLast12Months: () => apiClient.get('/admin/revenue/last-12-months'),
    getToday: () => apiClient.get('/admin/revenue/today'),
    getThisMonth: () => apiClient.get('/admin/revenue/current-month'),
    getYesterday: () => apiClient.get('/admin/revenue/yesterday')
}

export default RevenueService;