import "./JobDetails.scss"

import React from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './JobDetails.scss'; // Import the SCSS file

const JobDetails = (props) => {
  const navigate = useNavigate();

  const onJobTitleClick = async (job_id) => {
    navigate(`/jobs/${job_id}`);
  };

  const {
    job_id,
    title,
    companyName,
    salaryMin,
    salaryMax,
    openings,
    remoteWork,
    ProfilePic
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
    <Card className="card">
      <CardContent className="card-content">
        {
              ProfilePic && (
                <Avatar src={`../../../public/uploads/${ProfilePic}`} />
              )
        }
        <Typography variant="h4" className="job-title" onClick={() => onJobTitleClick(job_id)}>
          {title}
        </Typography>
        <Typography variant="h6" className="company-name">
          {companyName}
        </Typography>
        <Typography variant="body1" className="salary">
          {formatSalary()}
        </Typography>
        <Typography variant="body1" className="openings">
          No. of Openings: {openings}
        </Typography>
        <Typography variant="body1" className="remote-work">
          Remote Work: {remoteWork ? 'Yes' : 'No'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobDetails;
