import React, { useEffect, useState } from "react";
import "../css/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import NaverLogin from "./NaverLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faAt,
  faUnlockKeyhole,
  faUser,
} from "@fortawesome/free-solid-svg-icons"; // 솔리드 아이콘 import
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [name, setName] = useState("");
  const [regMessage, setRegMessage] = useState("");

  const [isRegister, setIsRegister] = useState(false); // 회원가입/로그인 상태 구분

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 막기

    if (isRegister) {
      // 회원가입 로직

      try {
        const response = await axios.post("http://127.0.0.1:5000/register", {
          email: regEmail, // 회원가입 시 사용되는 이메일 변수
          password: regPassword, // 회원가입 시 사용되는 비밀번호 변수
          name,
        });

        setRegMessage(response.data.message);

        // 성공 후 homepage로 이동
        if (response.status === 201) {
          localStorage.setItem("token", response.data.access_token); // 로그인과 마찬가지로 토큰 저장
          navigate("/homepage"); // 회원가입 완료 후 homepage로 이동
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setRegMessage("이미 등록된 사용자입니다.");
        } else {
          setRegMessage(error.response?.data?.message || "회원가입 실패");
        }
      }
    } else {
      // 로그인 로직
      try {
        const response = await axios.post("http://127.0.0.1:5000/login", {
          email, // 로그인 시 사용되는 이메일 변수
          password, // 로그인 시 사용되는 비밀번호 변수
        });
        localStorage.setItem("token", response.data.access_token);
        navigate("/homepage");
      } catch (error) {
        setMessage("로그인 실패: Invalid credentials");
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/homepage");
    } catch (error) {
      setMessage("구글 로그인 실패");
    }
  };

  const handleGoogleLoginFailure = () => {
    setMessage("구글 로그인 실패");
  };

  // 타이핑 커서 멈추기
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const typingElement = document.querySelector(".typing-text");
      if (typingElement) {
        typingElement.style.borderRight = "none";
      }
    }, 2500);

    // 타임아웃을 정리하는 함수
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="page-wrapper">
      {/*회원가입*/}
      <div
        className={`register-container ${
          isRegister ? "show-register" : "hidden"
        }`}
      >
        <form className="register-form" onSubmit={handleSubmit}>
          <button id="mobile-login-btn" onClick={() => setIsRegister(false)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <h1 className="register-form-title">SIGN UP</h1>

          <FontAwesomeIcon icon={faUser} id="user-icon" />

          <input
            type="text"
            placeholder="이름을 입력하세요"
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FontAwesomeIcon icon={faAt} id="email-register-icon" />

          <input
            type="email"
            placeholder="이메일을 입력하세요"
            id="email"
            value={regEmail}
            className="register-email"
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <FontAwesomeIcon icon={faUnlockKeyhole} id="pass-register-icon" />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            id="password"
            value={regPassword}
            className="register-password"
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <button type="submit" className="register-form-submit">
            회원가입
          </button>
          {/* {regMessage && <p className="register-message">{regMessage}</p>} */}
        </form>
      </div>

      {/*로그인*/}
      <div
        className={`login-container ${!isRegister ? "show-login" : "hidden"}`}
      >
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-form-title">SIGN IN</h1>
          <div class="typing-container">
            <p class="typing-text">Ottcha와 함께 나만의 스타일을 완성하세요!</p>
          </div>
          <FontAwesomeIcon icon="fa-solid fa-at" id="email-login-icon" />
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            className="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FontAwesomeIcon icon={faUnlockKeyhole} id="pass-login-icon" />
          <input
            type="password"
            className="login-password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button">로그인</button>
          <div id="mobile-register-div">
            {" "}
            아직 계정이 없으신가요?
            <span id="mobile-register-btn" onClick={() => setIsRegister(true)}>
              회원가입
            </span>
          </div>
          {/* {message && <p className="login-message">{message}</p>} */}
        </form>
      </div>

      <div className="another-login">
        <div class="separator">
          <p>OR</p>
        </div>
        <div className="another-login-components">
          <GoogleOAuthProvider clientId="845578172695-a9pll682qulsg8u18v6tsgi6ru96hid3.apps.googleusercontent.com">
            <div className="google login-icon-button">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onFailure={handleGoogleLoginFailure}
                useOneTap
              />
            </div>
          </GoogleOAuthProvider>
          <NaverLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
