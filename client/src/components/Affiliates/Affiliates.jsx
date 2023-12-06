import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Link, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Affiliates = ({ user_id }) => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/v1/institutes/${user_id}/affiliates`);
        setAffiliates(response.data.affiliates);
        console.log(affiliates[0].ProfilePic)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user_id]);

  const handleCardClick = (affiliate) => {
    navigate(`/profile/${affiliate.user_id}`);
  };

  return (
    <div>
      <Typography variant="h4">Affiliates</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        affiliates.map((affiliate, index) => (
          <Link key={index} onClick={() => handleCardClick(affiliate)} style={{ textDecoration: 'none' }}>
            <Card style={{ margin: '16px 0', cursor: 'pointer' }}>
              <CardContent>
                <Avatar src={`../../../public/uploads/${affiliate.ProfilePic}`} alt={`${affiliate.first_name} ${affiliate.last_name}`} />
                <Typography variant="h6">
                  {affiliate.first_name} {affiliate.last_name}
                </Typography>
                <Typography variant="subtitle1">{affiliate.major}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};

export default Affiliates;
