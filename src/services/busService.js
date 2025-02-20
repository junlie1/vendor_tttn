import api from './api';

export const busService = {
  // Lấy danh sách xe
  getBuses: async () => {
    try {
      const response = await api.get('/buses');
      return response.data;
    } catch (error) {
      console.error('Error in getBuses:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết xe
  getBus: async (id) => {
    try {
      const response = await api.get(`/buses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getBus:', error);
      throw error;
    }
  },

  // Tạo xe mới
  createBus: async (busData) => {
    try {
      const response = await api.post('/buses', busData);
      return response.data;
    } catch (error) {
      console.error('Error in createBus:', error);
      throw error;
    }
  },

  // Cập nhật thông tin xe
  updateBus: async (id, busData) => {
    try {
      const response = await api.put(`/buses/${id}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error in updateBus:', error);
      throw error;
    }
  },

  // Xóa xe
  deleteBus: async (id) => {
    try {
      const response = await api.delete(`/buses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteBus:', error);
      throw error;
    }
  }
}; 