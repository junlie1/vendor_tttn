import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { busTypeService } from '../../services/busTypeService';
import { useSelector } from 'react-redux';

const BusTypeForm = ({ open, handleClose, busType, onSubmitSuccess }) => {

  const [formData, setFormData] = useState({
    typeName: '',
    capacity: '',
    description: '',
    numberOfFloors: 1
  });

  useEffect(() => {
    if (busType) {
      setFormData({
        typeName: busType.typeName || '',
        capacity: busType.capacity || '',
        description: busType.description || '',
        numberOfFloors: busType.numberOfFloors || 1
      });
    } else {
      setFormData({
        typeName: '',
        capacity: '',
        description: '',
        numberOfFloors: 1
      });
    }
  }, [busType]);

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
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        numberOfFloors: parseInt(formData.numberOfFloors)
      };

      if (busType) {
        await busTypeService.updateBusType(busType.id, submitData);
      } else {
        await busTypeService.createBusType(submitData);
      }
      onSubmitSuccess();
      handleClose();
    } catch (error) {
      console.error('Error saving bus type:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {busType ? 'Chỉnh sửa loại xe' : 'Thêm loại xe mới'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên loại xe"
                name="typeName"
                value={formData.typeName}
                onChange={handleChange}
                required
                margin="normal"
                placeholder="VD: Limousine, Giường nằm..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sức chứa tối đa"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
                margin="normal"
                placeholder="VD: 40"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Số tầng</InputLabel>
                <Select
                  name="numberOfFloors"
                  value={formData.numberOfFloors}
                  onChange={handleChange}
                  label="Số tầng"
                >
                  <MenuItem value={1}>1 tầng</MenuItem>
                  <MenuItem value={2}>2 tầng</MenuItem>
                </Select>
              </FormControl>
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
                margin="normal"
                placeholder="Mô tả thêm về loại xe..."
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
          >
            {busType ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BusTypeForm; 