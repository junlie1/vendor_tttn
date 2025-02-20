import api from './api';

export const routeService = {
  // Lấy danh sách tuyến đường
  getRoutes: async () => {
    try {
      const response = await api.get('/routes');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy chi tiết tuyến đường
  getRoute: async (id) => {
    try {
      const response = await api.get(`/routes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Tạo tuyến đường mới
  createRoute: async (routeData) => {
    try {
      const response = await api.post('/routes', routeData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Cập nhật tuyến đường
  updateRoute: async (id, routeData) => {
    try {
      const response = await api.put(`/routes/${id}`, routeData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xóa tuyến đường
  deleteRoute: async (id) => {
    try {
      const response = await api.delete(`/routes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}; 