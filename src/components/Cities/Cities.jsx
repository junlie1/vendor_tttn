import React, { useState } from 'react';
import './Cities.css';

const Cities = () => {
  const [locations] = useState([
    { name: 'Bến xe Miền Đông', type: 'Bến xe chính', address: 'TP.HCM', routes: '12', status: 'active' },
    { name: 'Bến xe Đà Lạt', type: 'Bến xe chính', address: 'Đà Lạt', routes: '8', status: 'active' },
    { name: 'Điểm đón Ngã Tư Thủ Đức', type: 'Điểm đón/trả', address: 'TP.HCM', routes: '5', status: 'active' },
    { name: 'Bến xe Cần Thơ', type: 'Bến xe chính', address: 'Cần Thơ', routes: '6', status: 'active' },
    { name: 'Điểm đón Ngã Tư Bảy Hiền', type: 'Điểm đón/trả', address: 'TP.HCM', routes: '4', status: 'inactive' },
    { name: 'Bến xe Đà Nẵng', type: 'Bến xe chính', address: 'Đà Nẵng', routes: '10', status: 'active' },
    { name: 'Điểm đón Vũng Tàu', type: 'Điểm đón/trả', address: 'Vũng Tàu', routes: '3', status: 'active' },
    { name: 'Bến xe Nha Trang', type: 'Bến xe chính', address: 'Nha Trang', routes: '7', status: 'active' },
  ]);

  return (
    <div className="cities-container">
      <div className="cities-header">
        <h1>Điểm Đón/Trả Khách</h1>
        <div className="search-filter">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm điểm đón/trả..."
              className="search-input"
            />
          </div>
          <div className="filter-actions">
            <button className="add-btn">
              <i className="fas fa-plus"></i>
              Thêm Điểm Mới
            </button>
            <div className="filter-text">
              Sắp xếp: <a href="#" className="filter-link">A đến Z</a>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên Điểm</th>
              <th>Loại</th>
              <th>Địa Chỉ</th>
              <th>Số Tuyến</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location, index) => (
              <tr key={index}>
                <td>{location.name}</td>
                <td>{location.type}</td>
                <td>{location.address}</td>
                <td>{location.routes}</td>
                <td>
                  <span className={`status-badge ${location.status}`}>
                    {location.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit" title="Chỉnh sửa">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn view" title="Xem chi tiết">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn delete" title="Xóa">
                      <i className="fas fa-trash"></i>
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

export default Cities; 