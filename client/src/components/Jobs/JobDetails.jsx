import React from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const JobDetails = (props) => {
  const navigate = useNavigate();

  const onJobTitleClick = async (job_id) => {
      navigate(`/jobs/${job_id}`) ;
  };

  const {
    job_id,
    key,
    title,
    companyName,
    salaryMin,
    salaryMax,
    openings,
    remoteWork,
  } = props;

  const formatSalary = () => {
    if (salaryMin && salaryMax) {
      return `Salary: $${salaryMin} - $${salaryMax}`;
    } else if (salaryMax) {
      return `Salary: Up to $${salaryMax}`;
    } else if (salaryMin) {
      return `Salary: Above $${salaryMin}`;
    } else {
      return 'Salary: Unspecified';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" onClick={() => onJobTitleClick(job_id)}>{title}</Typography>
        <Typography variant="h6">{companyName}</Typography>
        <Typography variant="body1">{formatSalary()}</Typography>
        <Typography variant="body1">No. of Openings: {openings}</Typography>
        <Typography variant="body1">Remote Work: {remoteWork ? 'Yes' : 'No'}</Typography>
      </CardContent>
    </Card>
  );
};

export default JobDetails;
