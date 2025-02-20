import React, { useEffect, useState } from "react";
import {
  SettingsContainer,
  SettingsHeader,
  SettingsGrid,
  SettingsCard,
  CardHeader,
  CardContent,
  SettingItem,
  CheckboxItem,
  SaveButton,
} from "./style";
import { useSelector } from "react-redux";



const Settings = () => {
  const vendor = useSelector((state) => state.vendor.vendor);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleUpdateAccount = () => {
    console.log("đẫ đổi");
  }

  useEffect(() => {
    if(vendor && vendor.email) {
      setEmail(vendor.email);
    }
    if(vendor && vendor.name) {
      setName(vendor.name);
    }
  }, [vendor]);

  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>Cài Đặt Hệ Thống</h1>
      </SettingsHeader>

      <SettingsGrid>
        <SettingsCard>
          <CardHeader>
            <i className="fas fa-user-shield"></i>
            <h2>Quản Lý Tài Khoản</h2>
          </CardHeader>
          <CardContent>
            <SettingItem>
              <label>Email</label>
              <input 
                type="email" 
                value={vendor.email ? email : "vendor@gmail.com"}
                onChange={(e)=> setEmail(e.target.value)} 
              />
            </SettingItem>
            <SettingItem>
              <label>Tên</label>
              <input 
                type="email" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </SettingItem>
            <SaveButton onClick={handleUpdateAccount}>Cập Nhật Tài Khoản</SaveButton>
          </CardContent>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <i className="fas fa-bell"></i>
            <h2>Thông Báo</h2>
          </CardHeader>
          <CardContent>
            <CheckboxItem>
              <label>
                <input type="checkbox" defaultChecked />
                Thông báo đặt vé mới
              </label>
            </CheckboxItem>
            <CheckboxItem>
              <label>
                <input type="checkbox" defaultChecked />
                Thông báo hủy vé
              </label>
            </CheckboxItem>
            <CheckboxItem>
              <label>
                <input type="checkbox" defaultChecked />
                Thông báo bảo trì xe
              </label>
            </CheckboxItem>
            <CheckboxItem>
              <label>
                <input type="checkbox" />
                Thông báo khuyến mãi
              </label>
            </CheckboxItem>
            <SaveButton>Lưu Cài Đặt</SaveButton>
          </CardContent>
        </SettingsCard>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;
