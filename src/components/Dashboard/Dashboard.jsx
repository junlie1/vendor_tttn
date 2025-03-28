import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { DirectionsBus, Schedule, Route, Person } from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { busService } from '../../services/busService';
import { scheduleService } from '../../services/scheduleService';
import { routeService } from '../../services/routeService';
import { driverService } from '../../services/driverService';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      bgcolor: color,
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {icon}
      <Typography component="h2" variant="h4">
        {value}
      </Typography>
    </Box>
    <Typography component="p" variant="h6" sx={{ mt: 2 }}>
      {title}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  const fetchBuses = async () => {
    try {
      const response = await busService.getBuses();
      setBuses(response.data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await scheduleService.getSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await routeService.getRoutes();
      setRoutes(response.data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const fetchDriver = async () => {
    try {
      const response = await driverService.getAllDriver();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchSchedules();
    fetchRoutes();
    fetchDriver();
  }, []);

  // Hàm xử lý navigation khi click vào từng StatCard
  const handleStatClick = (title) => {
    if (title === 'Tổng số xe') {
      navigate('/home/buses');
    } else if (title === 'Lịch trình') {
      navigate('/home/schedules');
    } else if (title === 'Tuyến đường') {
      navigate('/home/routes');
    } else if (title === 'Tài xế') {
      navigate('/home/drivers');
    }
  };

  const stats = [
    {
      title: 'Tổng số xe',
      value: buses.length,
      icon: <DirectionsBus sx={{ fontSize: 40 }} />,
      color: '#2196f3',
    },
    {
      title: 'Lịch trình',
      value: schedules.length,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Tuyến đường',
      value: routes.length,
      icon: <Route sx={{ fontSize: 40 }} />,
      color: '#ff9800',
    },
    {
      title: 'Tài xế',
      value: drivers.length,
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#f44336',
    },
  ];

  const recentOrders = [
    { id: '#1234', customer: 'Nguyễn Văn A', route: 'TP.HCM - Đà Lạt', status: 'completed', amount: '350,000đ' },
    { id: '#1235', customer: 'Trần Thị B', route: 'TP.HCM - Nha Trang', status: 'pending', amount: '400,000đ' },
    { id: '#1236', customer: 'Lê Văn C', route: 'TP.HCM - Cần Thơ', status: 'processing', amount: '150,000đ' },
  ];

  return (
    <div className="dashboard">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Box sx={{ flexGrow: 1, mb: 4 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...stat} onClick={() => handleStatClick(stat.title)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Các phần giao diện khác */}
      <h1 className="dashboard-title">Tổng Quan</h1>
      <div className="stats-grid">
        {/* Nội dung cũ */}
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-details">
            <h3>Tổng Số Vé</h3>
            <p className="stat-value">1,234</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-details">
            <h3>Doanh Thu</h3>
            <p className="stat-value">45,678,000đ</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>Khách Hàng</h3>
            <p className="stat-value">892</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="stat-details">
            <h3>Số Xe</h3>
            <p className="stat-value">{buses.length}</p>
          </div>
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
