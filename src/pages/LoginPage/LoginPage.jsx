import React, { useState } from "react";
import {
  LoginContainer,
  LeftSection,
  RightSection,
  Title,
  Form,
  InputField,
  Label,
  Input,
  Button,
  ForgotPassword,
  SocialLogin,
  SignUp,
  PasswordWrapper,
  EyeIcon,
  ImageWrapper,
} from "./style";
import login_icon from "../../assets/login_icon-removebg-preview.png";
import gg_icon from "../../assets/gg_icon.jpg";
import fb_icon from "../../assets/fb_icon.png";
import { useNavigate } from "react-router-dom";
import MessageComponent from "../../components/MessageComponent/MessageComponent";
import { loginVendor } from "../../services/vendorService";
import { useDispatch } from "react-redux";
import { setVendor } from "../../redux/slices/vendorSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setWaitingForVerification(true);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      setWaitingForVerification(false);
      return;
    }

    try {
      const result = await loginVendor(email, password);
      if (result.vendor) {
        dispatch(setVendor(result.vendor));
        setSuccess("Đăng nhập thành công!");
      }
      if (result.navigateTo) {
        navigate(result.navigateTo);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setWaitingForVerification(false);
    }
  };

  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  return (
    <LoginContainer>

      <LeftSection>
        <Title>Welcome Back!!</Title>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        {waitingForVerification && <p>Đang xác thực...</p>}
        <Form>
          <InputField>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputField>
          <InputField>
            <Label>Password</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <EyeIcon onClick={handleTogglePassword}>
                {showPassword ? "👁️" : "🙈"}
              </EyeIcon>
            </PasswordWrapper>
          </InputField>
          <ForgotPassword>Forgot Password?</ForgotPassword>
          <Button type="button" onClick={handleLogin}>
            Login
          </Button>
        </Form>
        <SocialLogin>
          <span>- or -</span>
          <div>
            <img src={gg_icon} alt="Google Login" />
            <img src={fb_icon} alt="Facebook Login" />
          </div>
        </SocialLogin>
        <SignUp>
          Don't have an account? <p onClick={handleNavigateSignup}>Sign up</p>
        </SignUp>
      </LeftSection>
      <RightSection>
        <ImageWrapper>
          <img src={login_icon} alt="Login Illustration" />
        </ImageWrapper>
      </RightSection>
    </LoginContainer>
  );
};

export default LoginPage;
