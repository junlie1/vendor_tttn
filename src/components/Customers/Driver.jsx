import React, { useState, useEffect } from 'react';
import './Driver.css';
import { driverService } from '../../services/driverService';
import { scheduleService } from '../../services/scheduleService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const Drivers = () => {
  const vendorId = useSelector((state) => state.vendor.vendor.id);
  const [drivers, setDrivers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Lấy danh sách tài xế
        const driverResponse = await driverService.getAllDriver();
        if (driverResponse?.success) {
          setDrivers(driverResponse.data);
        }

        // Lấy danh sách lịch trình
        const scheduleResponse = await scheduleService.getSchedules();
        if (scheduleResponse?.success) {
          // 🔍 Chỉ giữ lại lịch trình có trạng thái "upcoming"
          const upcomingSchedules = scheduleResponse.data.filter(
            (schedule) => schedule.status === 'upcoming'
          );
          setSchedules(upcomingSchedules);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu', error);
      }
    };

    fetchAllData();
  }, [vendorId]);

  const handleAssignRoute = (driverId) => {
    setSelectedDriverId(driverId);
    setShowAssignModal(true);
  };

  const assignScheduleToDriver = async () => {
    try {
      if (!selectedSchedule) return;
  
      await driverService.assignSchedule(selectedDriverId, selectedSchedule);
      alert("Giao lịch trình thành công!");
      setShowAssignModal(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error("Lỗi khi giao lịch trình", error);
      alert("Giao lịch trình thất bại.");
    }
  };
  

  const handleDeleteDriver = async (driverId) => {
    if (window.confirm("Bạn có chắc muốn xóa tài xế này không?")) {
      try {
        await driverService.deleteDriver(driverId);
        setDrivers(drivers.filter(driver => driver.id !== driverId));
        alert("Xóa tài xế thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa tài xế", error);
      }
    }
  };

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1>Quản Lý Tài Xế</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã Driver</th>
              <th>Họ Tên</th>
              <th>Số Điện Thoại</th>
              <th>Email</th>
              <th>Số Chuyến Đi</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver?.id}</td>
                <td>{driver?.name}</td>
                <td>{driver?.phone}</td>
                <td>{driver?.email || driver['e-mail']}</td>
                <td>{driver?.totalTrips}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn assign-route"
                      title="Giao tuyến đường"
                      onClick={() => handleAssignRoute(driver.id)}
                    >
                      <i className="fas fa-route">🚚</i>
                    </button>
                    <button
                      className="action-btn delete"
                      title="Xóa tài xế"
                      onClick={() => handleDeleteDriver(driver.id)}
                    >
                      <i className="fas fa-trash">❌</i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup modal giao lịch trình */}
      {showAssignModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Chọn lịch trình để giao cho tài xế</h2>
              {schedules.length > 0 ? (
                <ul>
                  {schedules.map((schedule) => (
                    <li key={schedule.id} style={{ marginBottom: '10px' }}>
                      <div>
                        <strong>{schedule.routeName}</strong>
                        <div style={{ fontSize: '14px', color: '#555' }}>
                          🕒 <b>Thời gian đi:</b> {dayjs(schedule.departureTime).format('DD/MM/YYYY HH:mm')} <br />
                          🕓 <b>Thời gian đến:</b> {dayjs(schedule.arrivalTime).format('DD/MM/YYYY HH:mm')}<br />
                          📍 <b>{schedule.route.startPoint}</b> → <b>{schedule.route.endPoint}</b>
                        </div>
                      </div>
                      <button
                        style={{ marginLeft: '10px' }}
                        onClick={() => setSelectedSchedule(schedule.id)}
                      >
                        Chọn
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có lịch trình upcoming nào.</p>
              )}

              {selectedSchedule && (
                <div style={{ marginTop: '20px' }}>
                  <p><strong>Đã chọn lịch trình:</strong> {selectedSchedule}</p>
                  <button onClick={assignScheduleToDriver}>Xác nhận giao lịch trình</button>
                </div>
              )}

              <button onClick={() => setShowAssignModal(false)}>Đóng</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Drivers;
