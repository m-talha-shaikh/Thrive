import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { makeRequest } from "../../axios";

import { Card, CardContent, Typography, Button, Avatar, Link } from '@mui/material';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Applicants = ({ user_id }) => {
  const [auth, setAuth] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await makeRequest.get(`/organizations/${user_id}/jobs`);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  if (user_id == currentUser.data.user.user_id) {
    setAuth(true);
  }
  fetchData();
}, [user_id]);

const handleJobApplicantsClick = async (job_id) => {
  try {
    const response = await makeRequest.get(`/jobs/${job_id}/applicants`);
    setSelectedJob({ ...selectedJob, [job_id]: response.data.job.applicants });
  } catch (error) {
    console.error('Error fetching applicants:', error);
  }
};


  const handleApplicantClick = (id) => {
    if(id === null){
      alert("User does not exist anymore");
    }
    else{
      navigate(`/person/${id}`);
    }
  }

  const handleJobClick = (id) => {
    if(id === null){
      alert("User does not exist anymore");
    }
    else{
      navigate(`/jobs/${id}`);
    }
  }

  return (
    <div>
      {jobs && (
        jobs.map((job) => (
          <div key={job.job_id} style={{ marginBottom: 16 }}>
            <Card>
              <CardContent>
                <Link key={job.job_id} onClick={() => handleJobClick(job.job_id)} style={{ textDecoration: 'none' }}>
                  <Typography variant="h5" component="div">
                    {job.title}
                  </Typography>
                </Link>
                <Typography color="textSecondary">{`Job ID: ${job.job_id}`}</Typography>
                <Typography color="textSecondary">{`Post Date: ${job.post_date}`}</Typography>
                <Typography color="textSecondary">{`Country: ${job.country}`}</Typography>
              </CardContent>
              {auth && (
              <>
    <Button onClick={() => handleJobApplicantsClick(job.job_id)}>
      View Applicants
    </Button>
    {selectedJob && selectedJob[job.job_id] && (
      <div>
        <Typography variant="h6">Applicants:</Typography>
        {selectedJob[job.job_id].map(applicant => (
          <Link key={applicant.user_id} onClick={() => handleApplicantClick(applicant.user_id)} style={{ textDecoration: 'none' }}>
            <div key={applicant.application_id}>
              <Typography>{`${applicant.first_name} ${applicant.last_name}`}</Typography>
              <Avatar src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${applicant.ProfilePic}`} />
            </div>
          </Link>
        ))}
      </div>
    )}
  </>
)}

            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default Applicants;
