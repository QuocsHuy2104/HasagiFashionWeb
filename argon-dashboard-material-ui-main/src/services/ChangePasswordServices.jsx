import apiClient from "config/axiosConfig";

const ChangePasswordService = {
    changePass: async (formData) => {
        try {
            const response = await apiClient.put(`/changePassword`, formData, { withCredentials: true });
            return response; // Return the full response object
        } catch (error) {
            console.error("Error updating password:", error.response || error.message);
            throw error;
        }
    }
    
}
export default ChangePasswordService;

