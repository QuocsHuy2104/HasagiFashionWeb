import apiClient from "config/axiosConfig";

const RoleService = {
    getAllRoles: () => {
        return apiClient.get("/admin/role");
    },

    getRoleById: (roleName) => {
        return apiClient.get(`/admin/role/${roleName}`);
    },

    createRole: (role) => {
        return apiClient.post(`/admin/role`, role);
    },

    updateRole: (name, role) => {
        return apiClient.put(`/admin/role/${name}`, role);
    },

    deleteRole: (name) => {
        return apiClient.delete(`/admin/role/${name}`);
    }
};

export default RoleService;
