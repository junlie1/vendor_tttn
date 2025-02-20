import React, { useState } from "react";
import {
  Container,
  LeftSection,
  Logo,
  FormContainer,
  InputField,
  Button,
  SignInText,
  EyeIcon,
  ImageWrapper,
} from "./style";
import logo from "../../assets/logo.png";
import signup_icon from "../../assets/signup_icon-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { registerVendor } from "../../services/vendorService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [waitingForVerification, setWaitingForVerification] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNavigateSignIn = () => {
    navigate("/");
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!email || !name || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    else {
      setSuccess("Hãy vào email để xác thực tài khoản");
      setWaitingForVerification(true);
    }
    try {
      const response = await registerVendor({ email, password, name });

      if (response.status === 201) {
        setSuccess(response.message);
        setError("");

        // Bắt đầu đếm ngược thời gian xác thực (60 giây)
        setTimeout(() => {
          setWaitingForVerification(false);
          setSuccess("");
          setError("Bạn chưa xác thực email. Tài khoản của bạn đã bị hủy.");
        }, 20000);

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate('/pending');
      }
    } catch (error) {
      console.log("error", error);
      setWaitingForVerification(false); 

      if (error.message) {
        setError(error.message);
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    }
  };

  return (
    <Container>
      <LeftSection>
        <Logo src={logo} />
        <div className="illustration">
          <ImageWrapper>
            <img src={signup_icon} />
          </ImageWrapper>
        </div>
      </LeftSection>
      <FormContainer>
        <h2>Create Account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && waitingForVerification && (
          <p style={{ color: "green" }}>{success}</p>
        )}
        <InputField>
          <label>Email</label>
          <span className="icon">📧</span>
          <input
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputField>
        <InputField>
          <label>Name</label>
          <span className="icon">📧</span>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputField>
        <InputField>
          <label>Password</label>
          <span className="icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon onClick={handleTogglePassword}>
            {showPassword ? "👁️" : "🙈"}
          </EyeIcon>
        </InputField>
        <InputField>
          <label>Re-password</label>
          <span className="icon">🔒</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter your confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <EyeIcon onClick={handleToggleConfirmPassword}>
            {showConfirmPassword ? "👁️" : "🙈"}
          </EyeIcon>
        </InputField>
        <Button onClick={handleRegister}>Create Account</Button>
        <SignInText>
          - or - <p onClick={handleNavigateSignIn}>Sign in</p>
        </SignInText>
      </FormContainer>
    </Container>
  );
};

export default RegisterPage;
