import api from './api';

export const scheduleService = {
  // Lấy danh sách lịch trình
  getSchedules: async () => {
    try {
      const response = await api.get('/schedules');
      return response.data;
    } catch (error) {
      console.error('Error in getSchedules:', error);
      throw error;
    }
  },

  // Lấy chi tiết lịch trình
  getSchedule: async (id) => {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getSchedule:', error);
      throw error;
    }
  },

  // Tạo lịch trình mới
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error in createSchedule:', error);
      throw error;
    }
  },

  // Cập nhật lịch trình
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error in updateSchedule:', error);
      throw error;
    }
  },

  // Xóa lịch trình
  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteSchedule:', error);
      throw error;
    }
  }
}; 