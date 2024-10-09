import apiClient from "config/axiosConfig";

const AccountService = {
    getAllAccounts: () => {
        return apiClient.get("/admin/account");
    },

    getAccountById: (id) => {
        return apiClient.get(`/admin/account/${id}`);
    },

    saveAccount: (formData) => {
        const url = formData.id
            ? `/admin/account/${formData.id}`
            : "/admin/account";
        const method = formData.id ? "PUT" : "POST";

        return apiClient({
            method: method,
            url: url,
            data: formData,
        });
    },

    deleteAccount: (id) => {
        return apiClient.delete(`/admin/account/${id}`);
    },

    dismissalAccount: id => apiClient.put(`/admin/account/dismissal/${id}`),

    getAuthor: () => apiClient.get('/admin/my-ìno'),

}

export default AccountService;
