import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  // const navigate = useNavigate();
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   let token = urlParams.get('token');
  //   if (token) {
  //     localStorage.setItem('token', token);
  //   } else {
  //     token = localStorage.getItem('token');
  //   }

  //   if (!token) {
  //     navigate('/login');
  //   } else {
  //     // 토큰을 이용하여 사용자 정보를 가져오거나 인증을 확인하는 로직 추가
  //     fetch('http://127.0.0.1:5000/protected', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.user) {
  //           setUser(data.user);
  //         } else {
  //           navigate('/login');
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //         navigate('/login');
  //       });
  //   }
  // }, [navigate]);

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
    </div>
  );
};

export default Homepage;
