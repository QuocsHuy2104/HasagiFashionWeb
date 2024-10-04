import apiClient from 'config/axiosConfig';

const PermissionService = {
    getAllPermissions: () => apiClient.get('/admin/permission'),
    getPermissionByName: () => apiClient.get(`/admin/permission/${name}`)
}

export default PermissionService;