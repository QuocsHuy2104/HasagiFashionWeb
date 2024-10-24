
import apiClient from "config/axiosConfig";


const CartService = {
    getCart: () =>   apiClient.get('/cart/account'),   

getCartUpdate: async (cartDetailId, selectedColor, selectedSize, productId) => {
    try {
        const response = await apiClient.put(`/cart/updateOfOption/${cartDetailId}?colorId=${selectedColor.id}&sizeId=${selectedSize.id}&productId=${productId}`);
        return response.data; 
    } catch (error) {
        console.error("Error during cart update:", error);
        throw error; 
    }
}

    
}

export default CartService;