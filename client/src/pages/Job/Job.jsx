import "./Job.scss";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  styled,
} from '@mui/material';

import RoomIcon from '@mui/icons-material/Room';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business'; // Import BusinessIcon for jobType

// Use styled utility instead of makeStyles
const StyledCard = styled(Card)({
  borderRadius: theme => theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const Job = () => {
  const [canApply, setCanApply] = useState(false);
  const { job_id } = useParams();
  const [job, setJob] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [user_id, setUserId] = useState(currentUser.data.user.user_id);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/Jobs/${job_id}`)
      .then((response) => {
        const { job } = response.data.job;
        setJob(job);
        if(currentUser.data.user.account_type === 'person'){
          setCanApply(true);
        }
        console.log(job);
      })
      .catch((error) => {
        console.error('Error fetching job data:', error);
      });
  }, [job_id]);

  const handleApply = () => {
    axios
      .post(`http://localhost:3000/api/v1/Jobs/${job_id}`, { user_id })
      .then((response) => {
        console.log('Application successful:', response.data);
        alert("Successfully Applied for Job");
      })
      .catch((error) => {
        console.error('Error applying for the job:', error);
        if (error.response && error.response.status === 400) {
          window.alert('You have already applied for this job');
        }
      });
  };

  return (
    <>
      {job && (
        <StyledCard className="job-card">
          <CardContent>
            {job.ProfilePic && (
              <Avatar src={`../../../public/uploads/${job.ProfilePic}`} />
            )}

            {job.title && (
              <Typography className="job-title" variant="h5" fontSize="1.5rem" fontWeight="bold" marginBottom={1}>
                {job.title}
              </Typography>
            )}

            {job.name && (
              <Typography className="job-name" variant="h6" fontSize="1.8rem" color="primary" marginBottom={1}>
                {job.name}
              </Typography>
            )}


            {job.description && (
              <Typography className="job-description" variant="body1" color="textSecondary">
                {job.description}
              </Typography>
            )}

            <Grid container spacing={2} alignItems="center">
              {job.openings && (
                <Grid item>
                  <Chip
                    icon={<WorkIcon marginRight={1} />}
                    label={`${job.openings} Openings`}
                  />
                </Grid>
              )}
              {job.country && (
                <Grid item>
                  <Chip
                    icon={<RoomIcon marginRight={1} />}
                    label={job.country}
                  />
                </Grid>
              )}
              {job.remote_work && (
                <Grid item>
                  <Chip
                    icon={<Avatar>🏠</Avatar>}
                    label="Remote Work"
                  />
                </Grid>
              )}

              {job.job_type && (
                <Grid item>
                  <Chip
                    icon={<BusinessIcon marginRight={1} />}
                    label={job.job_type}
                    sx={{
                      backgroundColor: '#e0e0e0',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} alignItems="center" marginBottom={2}>
              {job.post_date && (
                <Grid item>
                  <Chip
                    icon={<EventIcon marginRight={1} />}
                    label={`Posted on ${new Date(job.post_date).toLocaleDateString()}`}
                  />
                </Grid>
              )}
              {job.expiry_date && (
                <Grid item>
                  <Chip
                    icon={<EventIcon marginRight={1} />}
                    label={`Expires on ${new Date(job.expiry_date).toLocaleDateString()}`}
                  />
                </Grid>
              )}
            </Grid>

            {canApply && (
              <Grid container spacing={2} alignItems="center" marginBottom={2}>
                <Grid item>
                  <Button className="apply-button" variant="contained" color="primary" onClick={handleApply}>
                    Apply
                  </Button>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </StyledCard>
      )}
    </>
  );
};

export default Job;
