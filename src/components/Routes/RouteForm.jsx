import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { routeService } from '../../services/routeService';

const RouteForm = ({ open, handleClose, route, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    duration: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    if (route) {
      setFormData({
        routeName: route.routeName || '',
        startPoint: route.startPoint || '',
        endPoint: route.endPoint || '',
        distance: route.distance || '',
        duration: route.duration || '',
        price: route.price || '',
        description: route.description || ''
      });
    }
  }, [route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên tuyến đường"
                name="routeName"
                value={formData.routeName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Điểm đón khách"
                name="startPoint"
                value={formData.startPoint}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Điểm trả khách"
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
          <Button type="submit" variant="contained" color="primary">
            {route ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RouteForm; 