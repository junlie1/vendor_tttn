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
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Divider,
  Stack,
  ButtonGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { routeService } from '../../services/routeService';
import { busService } from '../../services/busService';
import { vi } from 'date-fns/locale';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { API_URL } from '../../config/constants';
import { seatLayoutService } from '../../services/seatLayoutService';
import { format, parseISO } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { scheduleService } from '../../services/scheduleService';

const ScheduleForm = ({ open, handleClose, schedule, onSubmitSuccess }) => {
  
const [formData, setFormData] = useState({
    routeId: '',
    busId: '',
    departureTime: null,
    arrivalTime: null,
    price: '',
    status: 'upcoming',
    seatLayout: {
      floor1: {},
      floor2: {}
    }
});
  const [selectedBus, setSelectedBus] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFloor, setActiveFloor] = useState('floor1');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [openSeatDialog, setOpenSeatDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [busIdsInUse, setBusIdsInUse] = useState([]);
  const scheduleTime = selectedRoute?.duration;
  const vendor = useSelector((state) => state.vendor.vendor);
  console.log('schedule', schedule);

  useEffect(() => {
    if (open) {
      fetchRoutes();
      fetchBuses();
    }
  }, [open]);


  //Kiểm tra xe đã chạy hay chưa để cho lịch trình lựa chọn
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await scheduleService.getSchedules();
        console.log('response', response.data);
        if (response.success) {
          // Lọc ra danh sách các lịch trình chưa hoàn thành (upcoming hoặc ongoing)
          const activeSchedules = response.data.filter(
            (schedule) => schedule.status !== 'completed' // Chỉ lấy những lịch trình chưa hoàn thành
          );
          console.log('activeSchedules',activeSchedules);
          // Lấy danh sách các busId đang được sử dụng
          const usedBusIds = activeSchedules.map((schedule) => schedule.busId);
          setBusIdsInUse(usedBusIds);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách lịch trình:', error);
        setError('Không thể tải danh sách lịch trình');
      }
    };
  
    fetchSchedules();
  }, []);
  

  useEffect(() => {
    if (schedule) {
      const timeZone = 'Asia/Ho_Chi_Minh';
      const departureTime = schedule.departureTime ? utcToZonedTime(new Date(schedule.departureTime), timeZone) : null;
      const arrivalTime = schedule.arrivalTime ? utcToZonedTime(new Date(schedule.arrivalTime), timeZone) : null;

      setFormData({
        routeId: schedule.routeId || '',
        busId: schedule.busId || '',
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        price: schedule.price?.toString() || '',
        status: schedule.status || 'upcoming',
        seatLayout: convertSeatLayoutFromFirestore(schedule.seatLayout)
      });
    } else {
      setFormData({
        routeId: '',
        busId: '',
        departureTime: null,
        arrivalTime: null,
        price: '',
        status: 'upcoming',
        seatLayout: {
          floor1: {},
          floor2: {}
        }
      });
    }
  }, [schedule]);

  useEffect(() => {
    if (formData.busId) {
      const bus = buses.find(b => b.id === formData.busId);
      setSelectedBus(bus);
      if (!schedule && bus?.defaultSeatLayout) {
        console.log("Setting seat layout from defaultSeatLayout:", bus.defaultSeatLayout);
        setFormData(prev => ({
          ...prev,
          seatLayout: {
            floor1: bus.defaultSeatLayout.floor1 || {},
            floor2: bus.defaultSeatLayout.floor2 || {}
          }
        }));
      }
    }
  }, [formData.busId, buses, schedule]);

  useEffect(() => {
    if (formData.busId) {
      const bus = buses.find((b) => b.id === formData.busId);
      setSelectedBus(bus);
  
      // Kiểm tra nếu có seatLayoutId từ lịch trình thì ưu tiên sử dụng
      if (schedule?.seatLayoutId) {
        fetchSeatLayout(schedule.seatLayoutId);
      } 
      // Nếu không có, thì lấy từ defaultSeatLayoutId của bus
      else if (bus?.defaultSeatLayoutId) {
        console.log("Fetching seat layout for bus:", bus.busNumber, "SeatLayout ID:", bus.defaultSeatLayoutId);
        fetchSeatLayout(bus.defaultSeatLayoutId);
      }
    }
  }, [formData.busId, buses, schedule?.seatLayoutId]);
  

  const fetchRoutes = async () => {
    try {
      const response = await routeService.getRoutes();
      if (response && response.data) {
        setRoutes(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Không thể tải danh sách tuyến đường');
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await busService.getBuses();
      if (response && response.data) {
        setBuses(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      setError('Không thể tải danh sách xe');
    }
  };

  const fetchSeatLayout = async (seatLayoutId) => {
    try {
      const response = await seatLayoutService.getSeatLayout(seatLayoutId);
      if (response && response.data) {
        setFormData((prev) => ({
          ...prev,
          seatLayout: {
            floor1: response.data.floor1 || {},
            floor2: response.data.floor2 || {},
          },  
        }));
      }
    } catch (error) {
      console.error("Error fetching seat layout:", error);
      setError("Không thể tải sơ đồ ghế.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
        ...prev,
        [name]: value, 
    }));

    // Khi người dùng chọn tuyến đường, cập nhật cả selectedRoute và price
    if (name === 'routeId') {
        const route = routes.find(r => r.id === value);
        setSelectedRoute(route || null);

        // Nếu tìm thấy tuyến đường, cập nhật giá vào formData
        if (route) {
            setFormData(prev => ({
                ...prev,
                price: route.price?.toString() || '' 
            }));
        }
    }
};

useEffect(() => {
  if (formData.departureTime && scheduleTime) {
    const updatedArrivalTime = new Date(formData.departureTime);
    updatedArrivalTime.setMinutes(updatedArrivalTime.getMinutes() + scheduleTime);

    setFormData(prev => ({
      ...prev,
      arrivalTime: updatedArrivalTime
    }));
  }
}, [formData.departureTime, scheduleTime]); // Chạy khi `departureTime` hoặc `scheduleTime` thay đổi


  const handleDateChange = (name) => (date) => {
      // Chuyển đổi thời gian local thành UTC trước khi lưu
      const timeZone = 'Asia/Ho_Chi_Minh';
      const utcDate = zonedTimeToUtc(date, timeZone);
    setFormData(prev => ({
      ...prev,
      [name]: utcDate
    }));
    if (name === 'departureTime' && scheduleTime) {
      const updatedArrivalTime = new Date(utcDate);
      updatedArrivalTime.setMinutes(updatedArrivalTime.getMinutes() + scheduleTime);
  
      setFormData(prev => ({
        ...prev,
        arrivalTime: updatedArrivalTime
      }));
    }
  };

  const handleSeatPriceChange = (floor, seatKey, value) => {
    setFormData(prev => ({
      ...prev,
      seatLayout: {
        ...prev.seatLayout,
        [floor]: {
          ...prev.seatLayout[floor],
          [seatKey]: {
            ...prev.seatLayout[floor][seatKey],
            price: parseFloat(value) || 0
          }
        }
      }
    }));
  };

  const validateForm = () => {
    if (!formData.routeId) return false;
    if (!formData.busId) return false;
    if (!formData.departureTime) return false;
    if (!formData.arrivalTime) return false;
    if (new Date(formData.arrivalTime) <= new Date(formData.departureTime)) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const timeZone = 'Asia/Ho_Chi_Minh';
      const scheduleData = {
        ...formData,
        vendorId: vendor.id ,
        departureTime: formData.departureTime ? format(utcToZonedTime(formData.departureTime, timeZone), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone }) : null,
        arrivalTime: formData.arrivalTime ? format(utcToZonedTime(formData.arrivalTime, timeZone), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone }) : null,
      };
      let response;
      if (schedule) {
        response = await axios.put(`${API_URL}/schedules/${schedule.id}`, scheduleData);
      } else {
        response = await axios.post(`${API_URL}/schedules`, scheduleData);
      }
      if (response.data.success) {
        enqueueSnackbar(
          schedule 
            ? 'Cập nhật lịch trình thành công!' 
            : 'Tạo lịch trình thành công!',
          { variant: 'success' }
        );
        
        // Cập nhật lại dữ liệu local nếu thành công
        if (schedule && onSubmitSuccess) {
          onSubmitSuccess(response.data);
        } else if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        handleClose();
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar(error.message || 'Có lỗi xảy ra khi lưu lịch trình', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi dữ liệu ghế từ Firestore
  const convertSeatLayoutFromFirestore = (firestoreLayout) => {
    if (!firestoreLayout) {
      return {
        floor1: {},
        floor2: {}
      };
    }

    const result = {
      floor1: firestoreLayout.floor1 || {},
      floor2: firestoreLayout.floor2 || {}
    };

    ['floor1', 'floor2'].forEach(floor => {
      if (result[floor]) {
        Object.entries(result[floor]).forEach(([seatKey, seatData]) => {
          result[floor][seatKey] = {
            isBooked: seatData.isBooked || false,
            bookedBy: seatData.bookedBy || null,
            price: Number(seatData.price) || 0,
            type: seatData.type || 'normal',
            x: Number(seatData.x) || 0,
            y: Number(seatData.y) || 0
          };
          // Chỉ thêm phone nếu ghế đã được đặt và có số điện thoại
          if (seatData.isBooked && seatData.customerInfo) {
            result[floor][seatKey].customerInfo = seatData.customerInfo;
          }
        });
      }
    });

    return result;
  };

  const handleSeatClick = (floor, seatKey, seat) => {
    setSelectedSeat({ floor, key: seatKey, ...seat });
    setOpenSeatDialog(true);
  };

  const handleSeatUpdate = (updatedSeat) => {
    const normalizedSeatData = {
      isBooked: updatedSeat.isBooked,
      bookedBy: updatedSeat.isBooked ? updatedSeat.bookedBy : null,
      price: Number(updatedSeat.price) || 0,
      type: updatedSeat.type || 'normal',
      x: formData.seatLayout[selectedSeat.floor][selectedSeat.key].x,
      y: formData.seatLayout[selectedSeat.floor][selectedSeat.key].y
    };

    // Chỉ thêm phone vào dữ liệu nếu ghế được đặt và có số điện thoại
    if (updatedSeat.isBooked && updatedSeat.customerInfo) {
      normalizedSeatData.customerInfo = updatedSeat.customerInfo;
    }

    setFormData(prev => {
      const newSeatLayout = {
        ...prev.seatLayout,
        [selectedSeat.floor]: {
          ...prev.seatLayout[selectedSeat.floor],
          [selectedSeat.key]: normalizedSeatData
        }
      };
      return {
        ...prev,
        seatLayout: newSeatLayout
      };
    });

    setOpenSeatDialog(false);
  };

  // Thêm hàm kiểm tra xe 2 tầng
  const isTwoFloorBus = () => {
    // Kiểm tra nhiều điều kiện để xác định xe 2 tầng
    return (
      selectedBus?.busType?.numberOfFloors === 2 || // Kiểm tra qua numberOfFloors
      selectedBus?.busType?.typeName?.toLowerCase().includes('2 tầng') || // Kiểm tra qua tên loại xe
      Object.keys(formData.seatLayout.floor2 || {}).length > 0 // Kiểm tra có ghế tầng 2 không
    );
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {schedule ? 'Chỉnh sửa lịch trình' : 'Thêm lịch trình mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Section 1: Thông tin cơ bản */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Thông tin cơ bản
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Tuyến đường</InputLabel>
                      <Select
                        name="routeId"
                        value={formData.routeId}
                        onChange={handleChange}
                        label="Tuyến đường"
                      >
                        {routes.map((route) => (
                          <MenuItem key={route.id} value={route.id}>
                            {route.routeName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Xe</InputLabel>
                    <Select
                      name="busId"
                      value={formData.busId}
                      onChange={handleChange}
                      label="Xe"
                    >
                      {buses
                        .filter(
                          (bus) =>
                            !busIdsInUse.includes(bus.id) || // Xe không bị chiếm dụng
                            (schedule && schedule.busId === bus.id) // Nếu đang chỉnh sửa, xe này vẫn có thể chọn
                        )
                        .map((bus) => (
                          <MenuItem key={bus.id} value={bus.id}>
                            {bus.busNumber} {bus.busType ? `- ${bus.busType.typeName}` : ''}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                      <DateTimePicker
                        label="Thời gian khởi hành"
                        value={formData.departureTime}
                        onChange={handleDateChange('departureTime')}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true, 
                            required: true 
                          } 
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                      <DateTimePicker
                        label="Thời gian đến"
                        value={formData.arrivalTime}
                        onChange={handleDateChange('arrivalTime')}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true, 
                            required: true 
                          } 
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Giá vé (VNĐ)"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      readOnly 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Trạng thái"
                      >
                        <MenuItem value="upcoming">Sắp khởi hành</MenuItem>
                        <MenuItem value="ongoing">Đang chạy</MenuItem>
                        <MenuItem value="completed">Đã hoàn thành</MenuItem>
                        <MenuItem value="cancelled">Đã hủy</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Section 2: Thiết lập ghế */}
              {formData.busId && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Thiết lập sơ đồ ghế
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <ButtonGroup variant="outlined">
                          <Button
                            variant={activeFloor === 'floor1' ? 'contained' : 'outlined'}
                            onClick={() => setActiveFloor('floor1')}
                          >
                            TẦNG 1 ({Object.keys(formData.seatLayout.floor1).length} GHẾ)
                          </Button>
                          {isTwoFloorBus() && (
                            <Button
                              variant={activeFloor === 'floor2' ? 'contained' : 'outlined'}
                              onClick={() => setActiveFloor('floor2')}
                            >
                              TẦNG 2 ({Object.keys(formData.seatLayout.floor2).length} GHẾ)
                            </Button>
                          )}
                        </ButtonGroup>
                      </Stack>
                    </Stack>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Paper 
                        sx={{ 
                          p: 2,
                          minHeight: 400,
                          maxHeight: 600,
                          display: 'flex',
                          flexDirection: 'column',
                          
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          Danh sách ghế đã thêm
                        </Typography>
                        {Object.keys(formData.seatLayout[activeFloor]).length === 0 ? (
                          <Typography color="text.secondary" align="center">
                            Chưa có ghế nào được thêm
                          </Typography>
                        ) : (
                          <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <Table size="small" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell width="10%">Ghế</TableCell>
                                  <TableCell width="15%">Loại</TableCell>
                                  <TableCell width="15%">Giá</TableCell>
                                  <TableCell width="15%">Trạng thái</TableCell>
                                  <TableCell width="20%">Người đặt</TableCell>
                                  <TableCell width="15%">Số điện thoại</TableCell>
                                  <TableCell width="10%"></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(formData.seatLayout[activeFloor])
                                  .sort(([a], [b]) => {
                                    const rowA = a.charAt(0);
                                    const rowB = b.charAt(0);
                                    const colA = parseInt(a.slice(1));
                                    const colB = parseInt(b.slice(1));
                                    return rowA.localeCompare(rowB) || colA - colB;
                                  })
                                  .map(([seatKey, seat]) => (
                                    <TableRow 
                                      key={seatKey}
                                      onClick={() => handleSeatClick(activeFloor, seatKey, seat)}
                                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                      <TableCell>{seatKey}</TableCell>
                                      <TableCell>
                                        <Chip 
                                          size="small"
                                          label={
                                            seat.type === 'vip' ? 'VIP' :
                                            seat.type === 'sleeper' ? 'Giường nằm' : 'Thường'
                                          }
                                          color={
                                            seat.type === 'vip' ? 'warning' :
                                            seat.type === 'sleeper' ? 'primary' : 'success'
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          type="number"
                                          value={schedule?.price}
                                          onChange={(e) => handleSeatPriceChange(activeFloor, seatKey, e.target.value)}
                                          InputProps={{
                                            endAdornment: <Typography variant="caption">đ</Typography>
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Chip 
                                          size="small"
                                          label={seat.isBooked ? 'Đã đặt' : 'Trống'}
                                          color={seat.isBooked ? 'error' : 'success'}
                                        />
                                      </TableCell>
                                      <TableCell>{seat.bookedBy || '-'}</TableCell>
                                      <TableCell>{seat.customerInfo || '-'}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading || !validateForm()}
            >
              {loading ? 'Đang xử lý...' : (schedule ? 'Cập nhật' : 'Thêm mới')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog chỉnh sửa thông tin ghế */}
      <Dialog open={openSeatDialog} onClose={() => setOpenSeatDialog(false)}>
        <DialogTitle>
          Chỉnh sửa thông tin ghế {selectedSeat?.key}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giá"
                type="number"
                value={schedule?.price || ''}
                onChange={(e) => setSelectedSeat(prev => ({ ...prev, price: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedSeat?.isBooked || false}
                    onChange={(e) => setSelectedSeat(prev => ({ ...prev, isBooked: e.target.checked }))}
                  />
                }
                label="Đã đặt"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Người đặt"
                value={selectedSeat?.bookedBy || ''}
                onChange={(e) => setSelectedSeat(prev => ({ ...prev, bookedBy: e.target.value }))}
                disabled={!selectedSeat?.isBooked}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={selectedSeat?.customerInfo || ''}
                onChange={(e) => setSelectedSeat(prev => ({ ...prev, customerInfo: e.target.value }))}
                disabled={!selectedSeat?.isBooked}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSeatDialog(false)}>Hủy</Button>
          <Button 
            onClick={() => handleSeatUpdate({
              type: selectedSeat.type,
              price: Number(selectedSeat.price),
              isBooked: selectedSeat.isBooked,
              bookedBy: selectedSeat.bookedBy,
              customerInfo: selectedSeat.customerInfo
            })}
            variant="contained"
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScheduleForm; 