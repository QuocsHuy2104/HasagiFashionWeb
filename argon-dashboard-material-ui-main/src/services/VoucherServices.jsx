import apiClient from "config/axiosConfig";

const VoucherService = {
    getAllVouchers: () => apiClient.get("/admin/voucher"),

    getActiveVouchers: async () => {
        const response = await apiClient.get("/admin/voucher");
        return response.data.filter(voucher => voucher.isActive);
    },

    getVoucherById: (voucherId) => apiClient.get(`/admin/voucher/${voucherId}`),

    createVoucher: (voucher) => apiClient.post("/admin/voucher", voucher),

    updateVoucher: (id, voucher) => apiClient.put(`/admin/voucher/${id}`, voucher),

    deleteVoucher: (id) => apiClient.delete(`/admin/voucher/${id}`),

    getUsedVouchersByAccount: (accountId) => apiClient.get(`/admin/voucher/${accountId}/used-vouchers`)
};

export default VoucherService;