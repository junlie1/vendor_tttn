import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RouteForm from './RouteForm';
import { routeService } from '../../services/routeService';

const BusRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await routeService.getRoutes();
      setRoutes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Không thể tải dữ liệu tuyến đường');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedRoute(null);
    setOpenForm(true);
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) {
      try {
        await routeService.deleteRoute(id);
        fetchRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
      }
    }
  };

  if (loading) return <Box p={3}>Đang tải...</Box>;
  if (error) return <Box p={3}>{error}</Box>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Quản lý tuyến đường
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm tuyến đường
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên tuyến</TableCell>
              <TableCell>Điểm đầu</TableCell>
              <TableCell>Điểm cuối</TableCell>
              <TableCell>Khoảng cách (km)</TableCell>
              <TableCell>Thời gian (phút)</TableCell>
              <TableCell>Giá vé (VNĐ)</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.length > 0 ? (
              routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.routeName}</TableCell>
                  <TableCell>{route.startPoint}</TableCell>
                  <TableCell>{route.endPoint}</TableCell>
                  <TableCell>{route.distance}</TableCell>
                  <TableCell>{route.duration}</TableCell>
                  <TableCell>{route.price}</TableCell>
                  <TableCell>{route.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(route)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(route.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <RouteForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        route={selectedRoute}
        onSubmitSuccess={fetchRoutes}
      />
    </Box>
  );
};

export default BusRoutes; 