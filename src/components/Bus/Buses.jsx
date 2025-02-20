import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { busService } from '../../services/busService';
import { busTypeService } from '../../services/busTypeService';
import BusForm from './BusForm';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  useEffect(() => {
    fetchBuses();
    fetchBusTypes();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await busService.getBuses();
      setBuses(response.data || []);
    } catch (error) {
      console.error('Error fetching buses:', error);
      setError('Không thể tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusTypes = async () => {
    try {
      const response = await busTypeService.getBusTypes();
      if (Array.isArray(response)) {
        setBusTypes(response);
      }
    } catch (error) {
      console.error('Error fetching bus types:', error);
    }
  };

  const getBusTypeName = (busTypeId) => {
    const busType = busTypes.find(type => (type.id === busTypeId || type.busTypeId === busTypeId));
    return busType ? busType.typeName : '';
  };

  const handleAdd = () => {
    setSelectedBus(null);
    setOpenForm(true);
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setOpenForm(true);
  };

  const handleDelete = (bus) => {
    setBusToDelete(bus);
    setOpenConfirmDelete(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedBus(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedBus) {
        await busService.updateBus(selectedBus.id, formData);
      } else {
        const response = await busService.createBus(formData);
      }
      await fetchBuses();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving bus:', error);
      alert('Có lỗi xảy ra khi lưu thông tin xe: ' + error.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await busService.deleteBus(busToDelete.id);
      fetchBuses();
      setOpenConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };

  if (loading) return <Box p={3}>Đang tải...</Box>;
  if (error) return <Box p={3}>{error}</Box>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Quản lý xe
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm xe mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Số xe</TableCell>
              <TableCell>Loại xe</TableCell>
              <TableCell>Biển số</TableCell>
              <TableCell>Nhà sản xuất</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell>{bus.busNumber}</TableCell>
                <TableCell>{getBusTypeName(bus.busTypeId)}</TableCell>
                <TableCell>{bus.licensePlate}</TableCell>
                <TableCell>{bus.manufacturer}</TableCell>
                <TableCell>{bus.model}</TableCell>
                <TableCell>
                  {bus.status === 'active' ? 'Đang hoạt động' : 
                   bus.status === 'maintenance' ? 'Đang bảo dưỡng' : 'Ngưng hoạt động'}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(bus)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(bus)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BusForm
        open={openForm}
        handleClose={handleCloseForm}
        bus={selectedBus}
        onSubmit={handleSubmit}
      />

      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa xe {busToDelete?.busNumber}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Buses; 