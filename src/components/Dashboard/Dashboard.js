import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  Route,
  Person,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      bgcolor: color,
      color: 'white',
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
  const stats = [
    {
      title: 'Tổng số xe',
      value: '15',
      icon: <DirectionsBus sx={{ fontSize: 40 }} />,
      color: '#2196f3',
    },
    {
      title: 'Lịch trình hôm nay',
      value: '8',
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Tuyến đường',
      value: '12',
      icon: <Route sx={{ fontSize: 40 }} />,
      color: '#ff9800',
    },
    {
      title: 'Tài xế',
      value: '20',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#f44336',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 