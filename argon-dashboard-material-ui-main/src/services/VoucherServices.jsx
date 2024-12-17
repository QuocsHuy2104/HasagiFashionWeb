
import apiClient from "config/axiosConfig";

const VoucherService = {
    getAllVouchers: () => apiClient.get("/admin/coupon"),

    getActiveVouchers: async () => {
        const response = await apiClient.get("/admin/coupon");
        return response.data.filter(voucher => voucher.isActive);
    },

    getVoucherById: (voucherId) => apiClient.get(`/admin/coupon/${voucherId}`),

    createVoucher: (voucher) => apiClient.post("/admin/coupon", voucher),

    updateVoucher: (id, voucher) => apiClient.put(`/admin/coupon/${id}`, voucher),

    deleteVoucher: (id) => apiClient.delete(`/admin/coupon/${id}`),

    getUsedVouchersByAccount: (accountId) => apiClient.get(`/admin/coupon/${accountId}/used-vouchers`),

    getAllVouchersUS: () => apiClient.get("/user/coupon"),

    getUnusedVouchersByAccountUS: () => apiClient.get(`/user/coupon/unused-vouchers`),
};

export default VoucherService;
