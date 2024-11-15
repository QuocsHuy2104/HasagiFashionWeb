// OpenAIServices.js
import apiClient from 'config/axiosConfig';

const OpenAIServices = {
    async generateText(prompt) {
        try {
            const response = await apiClient.post('/api/gpt/generate', { prompt });
            return response.data;
        } catch (error) {
            console.error("Error generating text:", error);
            return null; // or return a meaningful error message
        }
    },
};

export default OpenAIServices;
