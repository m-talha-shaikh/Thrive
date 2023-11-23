import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const JobDetails = (props) => {
  const {
    title,
    companyName,
    salaryMin,
    salaryMax,
    openings,
    remoteWork,
    description,
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
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6">{companyName}</Typography>
        <Typography variant="body1">{formatSalary()}</Typography>
        <Typography variant="body1">No. of Openings: {openings}</Typography>
        <Typography variant="body1">Remote Work: {remoteWork ? 'Yes' : 'No'}</Typography>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default JobDetails;
