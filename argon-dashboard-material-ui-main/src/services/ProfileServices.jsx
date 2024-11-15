import apiClient from "config/axiosConfig";
const ProfileServices = {
    getProfile: async () => {
      try {
        const response = await apiClient.get('/account/profile');
        return response.data; // Return the profile data directly
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error; // Throw the error to handle it in the component
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
  