// Login.js - Modified

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import classes from './Login.module.css';

const Login = () => {
  const { Login } = useContext(AuthContext);
  const [inputs, setInput] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await Login(inputs);
      navigate("/");
    } catch (error) {
      setErr(error.response.data);
    }
  };

  return (
    <div className={classes.login}>
      <div className={classes.card}>
        <div className={classes.left}>
          <h1 className={classes.fadeIn}>Thrive</h1>
          <span>Don't you have an account?</span>
          <div>
            <Link to="/register">
              <button className={classes.bitto}>Register</button>
            </Link>
          </div>
          <p className={classes.fadeIn} style={{ fontWeight: 'bold', fontSize: '3em' }}>Talha & Hamza </p>
        </div>
        <div className={classes.right}>
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            <button onClick={handleLogin}>Login</button>

            {/* Display alerts based on error status */}
            {err && (
              <div className={classes.alert}>
                {err.error === 'Missing email or password' && (
                  <p className={classes.error}>Missing email or password</p>
                )}
                {err.error === 'Incorrect Email or password' && (
                  <p className={classes.error}>Incorrect email or password</p>
                )}
                {err.error === 'Internal Server Error' && (
                  <p className={classes.error}>Internal server error</p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
