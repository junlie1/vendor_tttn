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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { busTypeService } from '../../services/busTypeService';
import BusTypeForm from './BusTypeForm';

const BusTypes = () => {
  const [busTypes, setBusTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBusType, setSelectedBusType] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBusTypes();
  }, []);

  const fetchBusTypes = async () => {
    try {
      setLoading(true);
      const data = await busTypeService.getBusTypes();
      setBusTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bus types:', error);
      setError('Không thể tải dữ liệu loại xe');
      setBusTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBusType(null);
    setOpenForm(true);
  };

  const handleEdit = (busType) => {
    setSelectedBusType(busType);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await busTypeService.deleteBusType(deleteId);
      fetchBusTypes();
      setOpenDelete(false);
    } catch (error) {
      console.error('Error deleting bus type:', error);
    }
  };

  if (loading) return <Box p={3}>Đang tải...</Box>;
  if (error) return <Box p={3}>{error}</Box>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Quản lý loại xe
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm loại xe
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã loại xe</TableCell>
              <TableCell>Tên loại xe</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell>Danh sách ghế</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {busTypes && busTypes.length > 0 ? (
              busTypes.map((busType) => (
                <TableRow key={busType.id}>
                  <TableCell>{busType.id}</TableCell>
                  <TableCell>{busType.typeName}</TableCell>
                  <TableCell>{busType.capacity}</TableCell>
                  <TableCell>{busType.seatLayout ? busType.seatLayout.join(', ') : ''}</TableCell>
                  <TableCell>{busType.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(busType)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(busType.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <BusTypeForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        busType={selectedBusType}
        onSubmitSuccess={fetchBusTypes}
      />

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa loại xe này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusTypes; 