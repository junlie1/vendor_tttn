import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Title, Message, Button, ContactLink,
  LoadingWrapper, LoadingSpinner, SelectWrapper, Select
} from './style';

const PendingPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");

  const handleLogout = () => {
    navigate("/");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <Container>
      <Title>Đang đợi xác thực từ admin</Title>
      <LoadingWrapper>
        <LoadingSpinner />
      </LoadingWrapper>
      <Message>
        Bạn đã đăng ký thành công. Tài khoản của bạn cần được admin phê duyệt trước khi sử dụng.
        Nếu cần hỗ trợ, hãy liên hệ với admin qua email hoặc số điện thoại dưới đây.
      </Message>
      <ContactLink>Liên hệ Admin qua Email: woanbis@gmail.com</ContactLink>
      <ContactLink>Số điện thoại: 0987654321</ContactLink>

      {/* Thông báo và danh sách chọn thành phố */}
      <Message style={{ marginTop: "20px", fontWeight: "bold" }}>
        Hiện tại hệ thống của chúng tôi có ở những thành phố sau, vui lòng chọn thành phố cho nhà xe của bạn:
      </Message>
      <SelectWrapper>
        <Select value={selectedCity} onChange={handleCityChange}>
          <option value="">-- Chọn thành phố --</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Hải Phòng">Hải Phòng</option>
          <option value="Cần Thơ">Cần Thơ</option>
        </Select>
      </SelectWrapper>

      <div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </Container>
  );
};

export default PendingPage;
