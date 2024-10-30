import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');
    if (accessToken) {
      axios
        .post('http://localhost:5000/auth/naver', { token: accessToken })
        .then((response) => {
          localStorage.setItem('token', response.data.access_token);
          navigate('/homepage');
        })
        .catch((error) => {
          console.error('Error authenticating', error);
        });
    } else {
      console.error('No access token found');
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default AuthCallback;
