import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Applicants = ({ user_id }) => {
  const [jobs, setJobs] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/organizations/${user_id}/jobs`);
        setJobs(response.data.jobs);
        console.log(response.data.jobs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleJobClick = (job_id) => {
    // Navigate to the specific job route
    navigate(`/jobs/${job_id}`);
  };

  return (
    <div>
      {jobs && (
        jobs.map((job) => (
          <div key={job.job_id} style={{ marginBottom: 16 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {job.title}
                </Typography>
                <Typography color="textSecondary">{`Job ID: ${job.job_id}`}</Typography>
                <Typography color="textSecondary">{`Post Date: ${job.post_date}`}</Typography>
                <Typography color="textSecondary">{`Country: ${job.country}`}</Typography>
              </CardContent>
              <Button onClick={() => handleJobClick(job.job_id)}>
                View Job
              </Button>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default Applicants;
