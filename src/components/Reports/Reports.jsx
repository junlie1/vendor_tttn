import React from 'react';
import './Reports.css';

const Reports = () => {
  const revenueStats = {
    daily: '15,000,000',
    weekly: '95,000,000',
    monthly: '380,000,000',
    yearToDate: '4,560,000,000'
  };

  const ticketStats = {
    total: 1250,
    confirmed: 980,
    pending: 180,
    cancelled: 90
  };

  const popularRoutes = [
    {
      route: 'TP.HCM - Đà Lạt',
      tickets: 450,
      revenue: '157,500,000'
    },
    {
      route: 'TP.HCM - Nha Trang',
      tickets: 380,
      revenue: '152,000,000'
    },
    {
      route: 'TP.HCM - Cần Thơ',
      tickets: 420,
      revenue: '126,000,000'
    }
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Báo Cáo Thống Kê</h1>
        <div className="date-range">
          <div className="date-picker">
            <i className="fas fa-calendar"></i>
            <input type="date" className="date-input" />
          </div>
          <span>đến</span>
          <div className="date-picker">
            <i className="fas fa-calendar"></i>
            <input type="date" className="date-input" />
          </div>
          <button className="apply-btn">
            <i className="fas fa-sync"></i>
            Cập Nhật
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Doanh Thu</h3>
            <div className="stat-numbers">
              <div className="stat-item">
                <span className="label">Hôm nay:</span>
                <span className="value">{revenueStats.daily}đ</span>
              </div>
              <div className="stat-item">
                <span className="label">Tuần này:</span>
                <span className="value">{revenueStats.weekly}đ</span>
              </div>
              <div className="stat-item">
                <span className="label">Tháng này:</span>
                <span className="value">{revenueStats.monthly}đ</span>
              </div>
              <div className="stat-item">
                <span className="label">Năm nay:</span>
                <span className="value">{revenueStats.yearToDate}đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card tickets">
          <div className="stat-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Vé Bán Ra</h3>
            <div className="stat-numbers">
              <div className="stat-item">
                <span className="label">Tổng số:</span>
                <span className="value">{ticketStats.total}</span>
              </div>
              <div className="stat-item">
                <span className="label">Đã xác nhận:</span>
                <span className="value confirmed">{ticketStats.confirmed}</span>
              </div>
              <div className="stat-item">
                <span className="label">Chờ xác nhận:</span>
                <span className="value pending">{ticketStats.pending}</span>
              </div>
              <div className="stat-item">
                <span className="label">Đã hủy:</span>
                <span className="value cancelled">{ticketStats.cancelled}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="popular-routes">
        <h2>Tuyến Đường Phổ Biến</h2>
        <div className="routes-table">
          <table>
            <thead>
              <tr>
                <th>Tuyến Đường</th>
                <th>Số Vé</th>
                <th>Doanh Thu</th>
                <th>Tỷ Lệ</th>
              </tr>
            </thead>
            <tbody>
              {popularRoutes.map((route, index) => (
                <tr key={index}>
                  <td>{route.route}</td>
                  <td>{route.tickets}</td>
                  <td>{route.revenue}đ</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${(route.tickets / ticketStats.total * 100).toFixed(1)}%` 
                        }}
                      ></div>
                      <span className="progress-text">
                        {(route.tickets / ticketStats.total * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="export-section">
        <button className="export-btn">
          <i className="fas fa-file-excel"></i>
          Xuất Excel
        </button>
        <button className="export-btn">
          <i className="fas fa-file-pdf"></i>
          Xuất PDF
        </button>
      </div>
    </div>
  );
};

export default Reports; 