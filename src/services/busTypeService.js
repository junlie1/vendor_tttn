import api from './api';

export const busTypeService = {
  // Lấy danh sách loại xe
  getBusTypes: async () => {
    try {
      const response = await api.get('/bus-types');
      // Xử lý response theo nhiều format có thể có
      if (response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Service Error:', error);
      throw error;
    }
  },

  // Lấy chi tiết loại xe
  getBusType: async (id) => {
    try {
      const response = await api.get(`/bus-types/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo loại xe mới
  createBusType: async (busTypeData) => {
    try {
      const response = await api.post('/bus-types', busTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật loại xe
  updateBusType: async (id, busTypeData) => {
    try {
      const response = await api.put(`/bus-types/${id}`, busTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa loại xe
  deleteBusType: async (id) => {
    try {
      const response = await api.delete(`/bus-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 