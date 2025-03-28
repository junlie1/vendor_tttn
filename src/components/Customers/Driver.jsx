import React, { useState, useEffect } from 'react';
import './Driver.css';
import { driverService } from '../../services/driverService';
import { useSelector } from 'react-redux';

const Drivers = () => {
  const vendorId = useSelector((state) => state.vendor.vendor.id);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchAllDriver = async () => {
      try {
        const response = await driverService.getAllDriver();
        if(response?.success) {
          setDrivers(response?.data);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };
    fetchAllDriver();
  }, [vendorId]);

  // Xử lý giao tuyến đường cho tài xế
  const handleAssignRoute = (driverId) => {
    console.log(`Giao việc cho tài xế ${driverId}`);
    // TODO: Mở modal hoặc chuyển hướng đến trang phân công tuyến đường
  };

  // Xử lý xóa tài xế
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
                <td>{driver?.email}</td>
                <td>{driver?.totalTrips}</td>
                <td>
                  <div className="action-buttons">
                    {/* Giao việc - Cung cấp tuyến đường */}
                    <button 
                      className="action-btn assign-route" 
                      title="Giao tuyến đường"
                      onClick={() => handleAssignRoute(driver.id)}
                    >
                      <i className="fas fa-route">🐟</i> {/* Icon Giao Việc */}
                    </button>
                    {/* Xóa tài xế */}
                    <button 
                      className="action-btn delete" 
                      title="Xóa tài xế"
                      onClick={() => handleDeleteDriver(driver.id)}
                    >
                      <i className="fas fa-trash">❌</i> {/* Icon Xóa */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drivers;
