
import apiClient from "config/axiosConfig";

const AddressService = {

    getAllAddress: () => apiClient.get("/addresses/account"),
    getAddress: () => apiClient.get('/addresses/exists'),
    createAddress: (formData) => {
        apiClient.post('/addresses', formData, { withCredentials: true })
    },

    createAddressFirst: (formData) => {
        return apiClient.post('/addresses/create', formData, { withCredentials: true });
    },

    removeAddress: async (id) => {
        try {

            const response = await apiClient.put(`/addresses/delete/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error removing address:", error.response || error.message);
            throw error;
        }
    },
    updateAddress: async (id, formData) => {
        try {
            const response = await apiClient.put(`/addresses/update/${id}`, formData, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error updating address:", error.response || error.message);
            throw error;
        }
    },
}


export default AddressService;