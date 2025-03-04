import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import vi from 'date-fns/locale/vi';
import { busTypeService } from '../../services/busTypeService';
import { useSelector } from 'react-redux';

const BusForm = ({ open, handleClose, bus, onSubmit }) => {
  const [busTypes, setBusTypes] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: '',
    busTypeId: '',
    licensePlate: '',
    manufacturer: '',
    model: '',
    yearOfManufacture: null,
    lastMaintenance: null,
    status: 'active',
    description: '',
    vendorId: ''
  });

  const vendor = useSelector((state) => state.vendor.vendor)
  const [seatLayout, setSeatLayout] = useState({
    floor1: {},
    floor2: {} 
  });
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [seatType, setSeatType] = useState('normal');
  const [defaultPrice, setDefaultPrice] = useState(160000);

  // Load bus types khi component mount
  useEffect(() => {
    const fetchBusTypes = async () => {
      try {
        const response = await busTypeService.getBusTypes();
        // Kiểm tra và xử lý response theo cấu trúc thực tế
        if (response && response.data && Array.isArray(response.data.data)) {
          setBusTypes(response.data.data);
        } else if (response && Array.isArray(response.data)) {
          setBusTypes(response.data);
        } else if (Array.isArray(response)) {
          setBusTypes(response);
        }
      } catch (error) {
        console.error('Error fetching bus types:', error);
      }
    };
    fetchBusTypes();
  }, []);

  // Load bus data khi editing
  useEffect(() => {
    if (bus) {
      setFormData({
        busNumber: bus.busNumber || '',
        busTypeId: bus.busTypeId || '',
        licensePlate: bus.licensePlate || '',
        manufacturer: bus.manufacturer || '',
        model: bus.model || '',
        yearOfManufacture: bus.yearOfManufacture ? new Date(bus.yearOfManufacture) : null,
        lastMaintenance: bus.lastMaintenance ? new Date(bus.lastMaintenance) : null,
        status: bus.status || 'active',
        description: bus.description || ''
      });
    } else {
      setFormData({
        busNumber: '',
        busTypeId: '',
        licensePlate: '',
        manufacturer: '',
        model: '',
        yearOfManufacture: null,
        lastMaintenance: null,
        status: 'active',
        description: '',
        vendorId: '',
      });
    }
  }, [bus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Kiểm tra và chuẩn hóa dữ liệu seatLayout
      const normalizedSeatLayout = {
        floor1: {},
        floor2: {}
      };

      // Xử lý floor1
      if (seatLayout.floor1) {
        Object.entries(seatLayout.floor1).forEach(([key, seat]) => {
          if (!seat) return; // Bỏ qua ghế không hợp lệ
          
          normalizedSeatLayout.floor1[key] = {
            isBooked: false,
            bookedBy: null,
            customerInfo: null,
            price: Number(seat.price) || Number(defaultPrice) || 0,
            type: seat.type || 'normal',
            x: Number(seat.x) || 0,
            y: Number(seat.y) || 0
          };
        });
      }

      // Xử lý floor2
      if (seatLayout.floor2) {
        Object.entries(seatLayout.floor2).forEach(([key, seat]) => {
          if (!seat) return; // Bỏ qua ghế không hợp lệ
          
          normalizedSeatLayout.floor2[key] = {
            isBooked: false,
            bookedBy: null,
            customerInfo: null,
            price: Number(seat.price) || Number(defaultPrice) || 0,
            type: seat.type || 'normal',
            x: Number(seat.x) || 0,
            y: Number(seat.y) || 0
          };
        });
      }

      // Kiểm tra số lượng ghế
      const totalSeats = 
        Object.keys(normalizedSeatLayout.floor1).length + 
        Object.keys(normalizedSeatLayout.floor2).length;

      if (totalSeats === 0) {
        throw new Error('Vui lòng thêm ít nhất một ghế');
      }

      // Chuẩn bị dữ liệu để gửi
      const submitData = {
        ...formData,
        vendorId: vendor.vendorId,
        yearOfManufacture: formData.yearOfManufacture ? new Date(formData.yearOfManufacture).toISOString() : null,
        lastMaintenance: formData.lastMaintenance ? new Date(formData.lastMaintenance).toISOString() : null,
        seatLayout: normalizedSeatLayout,
        defaultPriceFloor1: Number(defaultPrice) || 0,
        defaultPriceFloor2: Number(defaultPrice) || 0
      };

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error submitting bus data:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  const SeatLayoutDesigner = () => {
    const handleAddSeat = (x, y) => {
      const floorKey = `floor${selectedFloor}`;
      const seatId = `${String.fromCharCode(65 + y)}${x + 1}`;
      
      setSeatLayout(prev => ({
        ...prev,
        [floorKey]: {
          ...prev[floorKey],
          [seatId]: {
            x: x * 80, // 80px là khoảng cách giữa các ghế
            y: y * 80,
            type: seatType,
            price: defaultPrice,
            isBooked: false,
            bookedBy: null
          }
        }
      }));
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>Tầng</FormLabel>
            <RadioGroup row value={selectedFloor} onChange={(e) => setSelectedFloor(Number(e.target.value))}>
              <FormControlLabel value={1} control={<Radio />} label="Tầng 1" />
              <FormControlLabel value={2} control={<Radio />} label="Tầng 2" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Loại ghế</InputLabel>
            <Select value={seatType} onChange={(e) => setSeatType(e.target.value)}>
              <MenuItem value="normal">Thường</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
              <MenuItem value="bed">Giường nằm</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            sx={{ 
              width: '100%', 
              height: '400px', 
              position: 'relative',
              backgroundColor: '#f5f5f5'
            }}
          >
            {/* Vẽ grid cho sơ đồ ghế */}
            <div style={{ padding: '20px' }}>
              {Array.from({ length: 6 }).map((_, y) => (
                <div key={y} style={{ display: 'flex' }}>
                  {Array.from({ length: 4 }).map((_, x) => {
                    const seatId = `${String.fromCharCode(65 + y)}${x + 1}`;
                    const seat = seatLayout[`floor${selectedFloor}`][seatId];
                    
                    return (
                      <div
                        key={`${x}-${y}`}
                        onClick={() => handleAddSeat(x, y)}
                        style={{
                          width: '60px',
                          height: '60px',
                          border: '1px solid #ccc',
                          margin: '5px',
                          backgroundColor: seat ? '#2196f3' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {seat && seatId}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{bus ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số xe"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Loại xe</InputLabel>
                <Select
                  name="busTypeId"
                  value={formData.busTypeId}
                  onChange={handleChange}
                  label="Loại xe"
                >
                  {busTypes && busTypes.length > 0 ? (
                    busTypes.map((type) => (
                      <MenuItem key={type.busTypeId || type.id} value={type.busTypeId || type.id}>
                        {type.typeName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Không có loại xe nào</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Biển số xe"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nhà sản xuất"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                <DatePicker
                  label="Năm sản xuất"
                  value={formData.yearOfManufacture}
                  onChange={handleDateChange('yearOfManufacture')}
                  views={['year']}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'normal'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                <DatePicker
                  label="Lần bảo dưỡng cuối"
                  value={formData.lastMaintenance}
                  onChange={handleDateChange('lastMaintenance')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'normal'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="maintenance">Đang bảo dưỡng</MenuItem>
                  <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
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
              />
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Thiết lập sơ đồ ghế
          </Typography>
          <SeatLayoutDesigner />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            {bus ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BusForm; 