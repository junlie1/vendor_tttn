import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { routeService } from '../../services/routeService';
import { cityVnService } from '../../services/cityVnService';

const RouteForm = ({ open, handleClose, route, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    from: '',
    to: '',
    distance: '',
    duration: '',
    price: '',
    description: '',
  });

  const [city, setCity] = useState([]);
  const [routes, setRoutes] = useState([]); // Danh sách tuyến đường hiện có
  const [routeExists, setRouteExists] = useState(false); // Biến kiểm tra tuyến đường đã tồn tại

  useEffect(() => {
    const fetchAllCity = async () => {
      const response = await cityVnService.getAllCity();
      setCity(response.data);
    };
    fetchAllCity();

    const fetchRoutes = async () => {
      const response = await routeService.getRoutes();
      if (response.success) {
        setRoutes(response.data);
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (route) {
      setFormData({
        routeName: route.routeName || '',
        startPoint: route.startPoint || '',
        endPoint: route.endPoint || '',
        from: route.from || '',
        to: route.to || '',
        distance: route.distance || '',
        duration: route.duration || '',
        price: route.price || '',
        description: route.description || '',
      });
    }
  }, [route]);

  useEffect(() => {
    // Tự động cập nhật routeName khi from hoặc to thay đổi
    if (formData.from && formData.to) {
      setFormData((prev) => ({
        ...prev,
        routeName: `${prev.from} - ${prev.to}`,
      }));

      // Kiểm tra xem tuyến đường đã tồn tại chưa
      const exists = routes.some(
        (r) => r.from === formData.from && r.to === formData.to
      );
      setRouteExists(exists);
    }
  }, [formData.from, formData.to, routes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (routeExists) {
      alert('Tuyến đường này đã tồn tại!');
      return;
    }

    try {
      if (route) {
        await routeService.updateRoute(route.id, formData);
      } else {
        await routeService.createRoute(formData);
      }
      onSubmitSuccess();
      handleClose();
    } catch (error) {
      console.error('Error submitting route:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {route ? 'Chỉnh sửa tuyến đường' : 'Thêm tuyến đường mới'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Dropdown chọn "From" */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  value={formData.from}
                  onChange={handleChange}
                  name="from"
                  required
                >
                  {city.map((item) => (
                    <MenuItem key={item.code} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Dropdown chọn "To" */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>To</InputLabel>
                <Select
                  value={formData.to}
                  onChange={handleChange}
                  name="to"
                  required
                >
                  {city.map((item) => (
                    <MenuItem key={item.code} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Hiển thị Tên tuyến đường (Không cho chỉnh sửa) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên tuyến đường"
                name="routeName"
                value={formData.routeName}
                disabled 
              />
            </Grid>

            {/* Hiển thị cảnh báo nếu tuyến đường đã tồn tại */}
            {routeExists && (
              <Grid item xs={12}>
                <Typography color="error">
                  Tuyến đường này đã tồn tại trong hệ thống. Vui lòng chọn tuyến khác!
                </Typography>
              </Grid>
            )}

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Điểm đầu"
                name="startPoint"
                value={formData.startPoint}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Điểm cuối"
                name="endPoint"
                value={formData.endPoint}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Khoảng cách (km)"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Thời gian (phút)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Giá vé"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={routeExists} 
          >
            {route ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RouteForm;
