import api from './api';

export const ticketService = {
  // Tạo vé mới
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy danh sách vé
  getTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy vé theo lịch trình
  getTicketsBySchedule: async (scheduleId) => {
    try {
      const response = await api.get(`/tickets/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Cập nhật trạng thái vé
  updateTicketStatus: async (ticketId, status) => {
    try {
      const response = await api.patch(`/tickets/${ticketId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Hủy vé
  cancelTicket: async (ticketId) => {
    try {
      const response = await api.patch(`/tickets/${ticketId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}; 