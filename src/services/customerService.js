import api from './api';

export const customerService = {
  // Tạo khách hàng mới
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy danh sách khách hàng
  getCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy chi tiết khách hàng
  getCustomer: async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await api.put(`/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy lịch sử đặt vé của khách hàng
  getCustomerBookings: async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}/bookings`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}; 