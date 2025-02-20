import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const salesData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [
      {
        label: 'Doanh Thu',
        data: [30, 45, 35, 50, 40, 60],
        borderColor: '#2563eb',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Giường Nằm', 'Ghế Ngồi', 'Limousine', 'Phòng VIP'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
      },
    ],
  };

  const recentOrders = [
    { id: '#1234', customer: 'Nguyễn Văn A', route: 'TP.HCM - Đà Lạt', status: 'completed', amount: '350,000đ' },
    { id: '#1235', customer: 'Trần Thị B', route: 'TP.HCM - Nha Trang', status: 'pending', amount: '400,000đ' },
    { id: '#1236', customer: 'Lê Văn C', route: 'TP.HCM - Cần Thơ', status: 'processing', amount: '150,000đ' },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Tổng Quan</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-details">
            <h3>Tổng Số Vé</h3>
            <p className="stat-value">1,234</p>
            <p className="stat-change positive">+15.3% so với tháng trước</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-details">
            <h3>Doanh Thu</h3>
            <p className="stat-value">45,678,000đ</p>
            <p className="stat-change positive">+12.5% so với tháng trước</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>Khách Hàng</h3>
            <p className="stat-value">892</p>
            <p className="stat-change positive">+8.2% so với tháng trước</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="stat-details">
            <h3>Số Xe</h3>
            <p className="stat-value">156</p>
            <p className="stat-change positive">+5.7% so với tháng trước</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Biểu Đồ Doanh Thu</h3>
          <Line 
            data={salesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="chart-card">
          <h3>Thống Kê Theo Loại Xe</h3>
          <Doughnut 
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="recent-orders">
        <h3>Đặt Vé Gần Đây</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã Vé</th>
                <th>Khách Hàng</th>
                <th>Tuyến Đường</th>
                <th>Trạng Thái</th>
                <th>Giá Vé</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.route}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'completed' && 'Đã hoàn thành'}
                      {order.status === 'pending' && 'Chờ xác nhận'}
                      {order.status === 'processing' && 'Đang xử lý'}
                    </span>
                  </td>
                  <td>{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 