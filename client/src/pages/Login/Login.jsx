import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classes from './Login.module.css';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/Auth/login',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
        console.log(response.data, response.status)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.login}>
      <div className={classes.card}>
        <div className={classes.left}>
          <h1 className={classes.fadeIn}>Thrive</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, neque?</p>
          <span>Don`t you have an account?</span>
          <div>
            <Link to="/register">
              <button className={classes.bitto}>Register</button>
            </Link>
          </div>
        </div>
        <div className={classes.right}>
          <h1>Login</h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={loginData.email}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={loginData.password}
            />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
