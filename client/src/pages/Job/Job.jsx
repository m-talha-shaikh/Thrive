import "./Job.scss"
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
  const { job_id } = useParams();
  const [job, setJob] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [user_id, setUserId] = useState(currentUser.data.user.user_id);

  useEffect(() => {
    // Make a GET request when the component mounts
    axios
      .get(`http://127.0.0.1:3000/api/v1/Jobs/${job_id}`)
      .then((response) => {
        // Handle the response data
        const { job } = response.data.job;
        setJob(job);
        console.log(job);
      })
      .catch((error) => {
        console.error('Error fetching job data:', error);
      });
  }, [job_id]);

  const handleApply = () => {
    // Make a POST request to apply for the job
    axios
      .post(`http://127.0.0.1:3000/api/v1/Jobs/${job_id}`, { user_id })
      .then((response) => {
        // Handle the response if needed
        console.log('Application successful:', response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error applying for the job:', error);
      });
  };

  return (
    <>
      {job && (
        <StyledCard className="job-card">
          <CardContent>
            {
              job.ProfilePic && (
                <Avatar src={`../../../public/uploads/${job.ProfilePic}`} />
              )
            }
            {job.title && (
              <Typography className="job-title" variant="h5" fontSize="1.5rem" fontWeight="bold" marginBottom={1}>
                {job.title}
              </Typography>
            )}

            {job.name && (
              <Typography className="job-name" variant="body1" fontSize="1rem" color="textSecondary">
                {job.name}
              </Typography>
            )}

            <Grid container justify="space-between" alignItems="center" marginBottom={2}>
              {job.job_type && (
                <Typography className="job-type" variant="subtitle1" color="textSecondary">
                  {job.job_type}
                </Typography>
              )}
            </Grid>

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

            <Grid container spacing={2} alignItems="center" marginBottom={2}>
              <Grid item>
                <Button className="apply-button" variant="contained" color="primary" onClick={handleApply}>
                  Apply
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      )}
    </>
  );
};

export default Job;
