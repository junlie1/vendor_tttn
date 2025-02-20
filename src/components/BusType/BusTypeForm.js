import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import { busTypeService } from '../../services/busTypeService';

const BusTypeForm = () => {
  const [formData, setFormData] = useState({
    typeName: '',
    capacity: '',
    seatLayout: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seatLayout' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await busTypeService.createBusType(formData);
      // Reset form
      setFormData({
        typeName: '',
        capacity: '',
        seatLayout: []
      });
    } catch (error) {
      console.error('Error creating bus type:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Tạo loại xe mới
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên loại xe"
                name="typeName"
                value={formData.typeName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Sức chứa"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Danh sách ghế (phân cách bằng dấu phẩy)"
                name="seatLayout"
                value={formData.seatLayout.join(',')}
                onChange={handleChange}
                placeholder="VD: A1,A2,B1,B2"
                required
                helperText="Nhập danh sách ghế, phân cách bằng dấu phẩy"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Tạo loại xe
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BusTypeForm; 