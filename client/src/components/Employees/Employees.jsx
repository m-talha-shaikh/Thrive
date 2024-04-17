import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Link, Avatar } from '@mui/material';
import axios from 'axios';
import { makeRequest } from "../../axios";

import { useNavigate } from 'react-router-dom';

const Employees = ({ user_id }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await makeRequest.get(`/organizations/${user_id}/employees`);
      setEmployees(response.data.employees);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  fetchEmployees();
}, [user_id]);


  const handleCardClick = (employee) => {
    navigate(`/profile/${employee.user_id}`);
  };

  return (
    <div>
      <Typography variant="h4">Employees</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        employees.map((employee, index) => (
          <Link key={index} onClick={() => handleCardClick(employee)} style={{ textDecoration: 'none' }}>
            <Card style={{ margin: '16px 0', cursor: 'pointer' }}>
              <CardContent>
                <Avatar src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${employee.ProfilePic}`} alt={`${employee.first_name} ${employee.last_name}`} />
                <Typography variant="h6">
                  {employee.first_name} {employee.last_name}
                </Typography>
                <Typography variant="subtitle1">{employee.title}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};

export default Employees;
