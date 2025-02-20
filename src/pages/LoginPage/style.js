import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  background-color: #fdf4ed;
  padding: 0 10%;
  margin-top: -50px;
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
  margin-top: -50px;
`;

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    flex: 1;
    padding-right: 40px; /* Chừa chỗ cho icon */
  }
`;

export const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 18px; /* Kích thước icon */
  color: #888;

  &:hover {
    color: #555; /* Đổi màu khi hover */
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputField = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #555;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 35px;
`;

export const Button = styled.button`
  background-color: #1d3557;
  color: orange;
  padding: 10px;
  font-size: 15px;
  border: none;
  border-radius: 35px;
  cursor: pointer;
  margin-top: 50px;

  &:hover {
    background-color: #457b9d;
  }
`;

export const ForgotPassword = styled.a`
  align-self: flex-end;
  font-size: 0.9rem;
  color: #333;
  margin-top: -10px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export const SocialLogin = styled.div`
  text-align: center;
  margin-top: 20px;

  span {
    display: block;
    margin-bottom: 10px;
    color: #888;
  }

  div img {
    width: 30px;
    height: 30px;
    margin: 0 10px;
    cursor: pointer;
  }
`;

export const SignUp = styled.div`
  margin-top: 15px;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center; 
  p {
    margin-left: 5px;
    color: #e76f51;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RightSection = styled.div`
  flex: none;
  width: 30%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f47920;
  border-top-left-radius: 200px; 
  border-top-right-radius: 200px;
  position: sticky;
  height: 100vh;
  padding: 20px;
  margin-top: 100px;
`;



export const ImageWrapper = styled.div`
  max-width: 300px;
  position: absolute;
  left: -80px;
  img {
    width: 100%;
    height: auto;
  }
`;
