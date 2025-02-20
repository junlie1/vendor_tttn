import React, { useState, useEffect } from 'react';
import './Customers.css';
import { customerService } from '../../services/customerService';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Không thể tải dữ liệu khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = async (customerId) => {
    try {
      const response = await customerService.getCustomerBookings(customerId);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    }
  };

  const handleEditCustomer = async (customerId) => {
    // Thêm logic chỉnh sửa thông tin khách hàng
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1>Quản Lý Khách Hàng</h1>
        <div className="search-filter">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..."
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Họ Tên</th>
              <th>Số Điện Thoại</th>
              <th>Email</th>
              <th>Số Chuyến Đi</th>
              <th>Tổng Chi Tiêu</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.totalTrips}</td>
                <td>{customer.totalSpent.toLocaleString()}đ</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit" 
                      title="Chỉnh sửa"
                      onClick={() => handleEditCustomer(customer.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn history" 
                      title="Lịch sử đặt vé"
                      onClick={() => handleViewBookings(customer.id)}
                    >
                      <i className="fas fa-history"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers; 