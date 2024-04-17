import React, { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { makeRequest } from "../../axios"; // Ensure this import points correctly to your axios setup

const Settings = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { currentUser } = useContext(AuthContext);



  const handleSendOtp = () => {
    makeRequest.post('/Auth/generateOTP', { email: currentUser.data.user.email })
      .then(response => {
        console.log('OTP sent:', response.data);
        setOtpSent(true);
        alert(`Your OTP has been sent to ${currentUser.data.user.email}`);
      })
      .catch(error => {
        console.error('Error sending OTP:', error);
      });
  };

  const handleVerifyOtp = () => {
    makeRequest.post('/Auth/verifyOTP', { email: currentUser.data.user.email, otp })
      .then(response => {
        console.log('OTP verified:', response.data);
        setOtpVerified(true);
      })
      .catch(error => {
        console.error('Error verifying OTP:', error);
        alert('OTP verification failed');
      });
  };

  const handleChangePassword = () => {
    makeRequest.post('/Auth/changePassword', { email: currentUser.data.user.email, newPassword })
      .then(response => {
        console.log('Password changed:', response.data);
        alert('Password successfully changed');
      })
      .catch(error => {
        console.error('Error changing password:', error);
      });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Change Password</Typography>
        {!otpSent && (
          <Button variant="contained" color="primary" onClick={handleSendOtp}>
            Send OTP
          </Button>
        )}
        {!otpVerified && (
          <>
            <TextField
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          </>
        )}
        {otpVerified && (
          <>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings;
