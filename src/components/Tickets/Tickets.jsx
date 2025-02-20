import React, { useState, useEffect } from 'react';
import './Tickets.css';
import { ticketService } from '../../services/ticketService';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Không thể tải dữ liệu vé');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    try {
      await ticketService.cancelTicket(ticketId);
      fetchTickets(); // Tải lại danh sách sau khi hủy vé
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      await ticketService.updateTicketStatus(ticketId, status);
      fetchTickets(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h1>Quản Lý Vé</h1>
        <div className="search-filter">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm vé..."
              className="search-input"
            />
          </div>
          <div className="date-filter">
            <i className="fas fa-calendar"></i>
            <input type="date" className="date-input" />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã Vé</th>
              <th>Khách Hàng</th>
              <th>Tuyến Đường</th>
              <th>Thời Gian</th>
              <th>Ghế</th>
              <th>Giá Vé</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.customerName}</td>
                <td>{ticket.route}</td>
                <td>{new Date(ticket.departureTime).toLocaleString()}</td>
                <td>{ticket.seatNumber}</td>
                <td>{ticket.price.toLocaleString()}đ</td>
                <td>
                  <span className={`status-badge ${ticket.status}`}>
                    {ticket.status === 'booked' && 'Đã đặt'}
                    {ticket.status === 'paid' && 'Đã thanh toán'}
                    {ticket.status === 'canceled' && 'Đã hủy'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {ticket.status !== 'canceled' && (
                      <>
                        <button 
                          className="action-btn check" 
                          title="Xác nhận thanh toán"
                          onClick={() => handleUpdateStatus(ticket.id, 'paid')}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button 
                          className="action-btn cancel" 
                          title="Hủy vé"
                          onClick={() => handleCancelTicket(ticket.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                    <button 
                      className="action-btn print" 
                      title="In vé"
                    >
                      <i className="fas fa-print"></i>
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

export default Tickets; 