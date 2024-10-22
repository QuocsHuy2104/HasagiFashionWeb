
import apiClient from "config/axiosConfig";


const HistoryOrderService = {
    getHistory: () =>   apiClient.get('/history-order'),   
}

export default HistoryOrderService;