import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const initializeNaverLogin = (navigate) => {
  const naverLogin = new window.naver.LoginWithNaverId({
    clientId: "w_r91ZV2agab7hCGalg2",
    callbackUrl: "http://localhost:3000/auth/naver/callback",
    isPopup: false,
    loginButton: { color: "green", type: 3, height: 40 },
  });

  naverLogin.init();

  window.addEventListener("load", () => {
    naverLogin.getLoginStatus((status) => {
      if (status) {
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.replace("#", "")).get(
          "access_token"
        );
        if (token) {
          localStorage.setItem("token", token);
          navigate("/homepage");
        }
      }
    });
  });
};

const NaverLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let script;

    if (!window.naver || !window.naver.LoginWithNaverId) {
      script = document.createElement("script");
      script.src =
        "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
      script.type = "text/javascript";
      script.charset = "utf-8";
      document.head.appendChild(script);

      script.onload = () => {
        initializeNaverLogin(navigate);
      };
    } else {
      initializeNaverLogin(navigate);
    }

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [navigate]); // navigate만 의존성 배열에 포함

  return <div id="naverIdLogin" />;
};

export default NaverLogin;
