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
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ScheduleForm from './ScheduleForm';
import { scheduleService } from '../../services/scheduleService';
import ConfirmDialog from '../common/ConfirmDialog';
import { useSelector } from 'react-redux';
import { zonedTimeToUtc } from 'date-fns-tz';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const vendorId = useSelector((state) => state.vendor.vendor.id);

  useEffect(() => {
    const now = new Date();

    const updateTimeSchedules = async () => {
      if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
          const arrival = new Date(schedule.arrivalTime);
          if (schedule.status !== "completed") {
            if (arrival < now) {
              try {
                await scheduleService.updateTimeSchedules();
              } catch (err) {
                console.error(`Update failed`, err);
              }
            }
          }
        }
      }
    };

    updateTimeSchedules();
  }, [schedules]);


  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await scheduleService.getSchedules();
      if (response && response.data) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Không thể tải dữ liệu lịch trình');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSchedule(null);
    setOpenForm(true);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenForm(true);
  };

  const handleDelete = (schedule) => {
    setScheduleToDelete(schedule);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await scheduleService.deleteSchedule(scheduleToDelete.id);
      await fetchSchedules();
      setOpenConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Không thể xóa lịch trình');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp khởi hành';
      case 'ongoing':
        return 'Đang chạy';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) return <Box p={3}>Đang tải...</Box>;
  if (error) return <Box p={3} color="error.main">{error}</Box>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Quản lý lịch trình
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm lịch trình
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã lịch trình</TableCell>
              <TableCell>Tuyến đường</TableCell>
              <TableCell>Xe</TableCell>
              <TableCell>Thời gian khởi hành</TableCell>
              <TableCell>Thời gian đến</TableCell>
              <TableCell>Giá vé</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length > 0 ? (
              schedules.map((schedule) => {
                return (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      {schedule.id}
                    </TableCell>
                    <TableCell>
                      {schedule.route ? schedule.route.routeName : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {schedule.bus ? schedule.bus.busNumber : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {schedule.departureTime
                        // ? schedule.departureTime
                        ? format(new Date(schedule.departureTime), 'HH:mm dd/MM/yyyy', { locale: vi })
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {schedule.arrivalTime
                        ? format(new Date(schedule.arrivalTime), 'HH:mm dd/MM/yyyy', { locale: vi })
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{schedule.price?.toLocaleString() || 0} VNĐ</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(schedule.status)}
                        color={getStatusColor(schedule.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(schedule)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(schedule)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ScheduleForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        schedule={selectedSchedule}
        onSubmitSuccess={fetchSchedules}
      />

      <ConfirmDialog
        open={openConfirmDelete}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa lịch trình ${scheduleToDelete?.route?.routeName || ''} không?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
      />
    </Box>
  );
};

export default Schedules; 