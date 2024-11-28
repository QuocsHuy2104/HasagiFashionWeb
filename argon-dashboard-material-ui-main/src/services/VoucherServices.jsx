import apiClient from "config/axiosConfig";

const VoucherService = {
    getAllVouchers: () => apiClient.get("/admin/coupon"),

    getActiveVouchers: async () => {
        const response = await apiClient.get("/admin/coupon");
        return response.data.filter(coupon => coupon.isActive);
    },

    getVoucherById: (couponId) => apiClient.get(`/admin/coupon/${couponId}`),

    createVoucher: (coupon) => apiClient.post("/admin/coupon", coupon),

    updateVoucher: (id, coupon) => apiClient.put(`/admin/coupon/${id}`, coupon),

    deleteVoucher: (id) => apiClient.delete(`/admin/coupon/${id}`),

    getUsedVouchersByAccount: (accountId) => apiClient.get(`/admin/coupon/${accountId}/used-coupons`)
};

export default VoucherService;