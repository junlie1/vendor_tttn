import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  background-color: #fff8f2;
  padding: 0 120px; 
  margin-top: -100px;
`;


export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 200px;
  

  .illustration {
    background-color: #ff6b00;
    border-top-left-radius: 200px;
    border-top-right-radius: 200px;
    height: 100vh;
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  img {
    height: 100px;
    width: auto; 
    object-fit: contain;
    margin-top: -50px;
  }
`;


export const ImageWrapper = styled.div`
  position: absolute;
  right: -30%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2; 
  max-width: 400px;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;


export const Logo = styled.img`
  position: absolute;
  top: 20px;
  left: 20px;
  height: 60px; /* Tăng kích thước để nổi bật */
  width: auto;
  z-index: 10; /* Đảm bảo logo luôn hiển thị trên cùng */
`;

export const FormContainer = styled.div`
  flex: 1;
  max-width: 400px;
  padding: 60px; /* Điều chỉnh padding để khớp với yêu cầu */
  margin-left: -60px; /* Dịch FormContainer thêm về bên trái */
  
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
`;


export const InputField = styled.div`
  position: relative;
  margin-bottom: 15px;

  label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 12px 40px; /* Thêm khoảng cách cho biểu tượng */
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 30px; /* Bo tròn */
    outline: none;
    background-color: #f9f9f9;
    transition: border 0.3s;

    &:focus {
      border-color: #ff6b00;
      background-color: #fff;
    }
  }

  /* Thêm biểu tượng vào ô nhập liệu */
  .icon {
    position: absolute;
    top: 65%;
    left: 15px; /* Đặt biểu tượng gần viền */
    transform: translateY(-50%);
    font-size: 18px;
    color: #aaa;
  }
`;


export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #002d62;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background-color: #001b40;
  }
`;

export const SignInText = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;

  p {
    color: #ff6b00;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const EyeIcon = styled.span`
  position: absolute;
  top: 65%; 
  right: -50px;
  transform: translateY(-50%); 
  cursor: pointer;
  font-size: 18px; 
  color: #888;

  &:hover {
    color: #555; 
  }
`;

