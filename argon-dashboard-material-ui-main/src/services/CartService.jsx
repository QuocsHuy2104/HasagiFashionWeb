
import apiClient from "config/axiosConfig";


const CartService = {
    getCart: () => apiClient.get('/cart/account'),

    getCartUpdate: async (cartDetailId, selectedColor, selectedSize, productId) => {
        try {
            const response = await apiClient.put(`/cart/updateOfOption/${cartDetailId}?colorId=${selectedColor}&sizeId=${selectedSize}&productId=${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error during cart update:", error);
            throw error;
        }
    },

    getRemove: async (cartDetailId) => {
        try {
            const response = await apiClient.delete(`/cart/remove/${cartDetailId}`);
            return response.data;
        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

}

export default CartService;