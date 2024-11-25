import apiClient from "config/axiosConfig";
const ProfileServices = {
    getProfile: async () => {
      try {
        const response = await apiClient.get('/account/profile');
        return response.data; // Return the profile data directly
      } catch (error) {
      }
    },
    changeProfile: async (formData) => {
        try {
            const response = await apiClient.put(`/account/profile/update`, formData, { withCredentials: true });
            return response; 
        } catch (error) {
            console.error("Error updating password:", error.response || error.message);
            throw error;
        }
    }
  };
  
  export default ProfileServices;
  