import './JobPost.scss'
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const JobPost = ({ organization, user_id }) => {
  const { register, handleSubmit, setValue } = useForm();


  useEffect(() => {
    setValue('job_type', 'full_time');
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
        console.log(user_id)
      const apiUrl = `http://localhost:3000/api/v1/organizations/${user_id}/jobs`;


      const formattedData = {
        ...data,
        organization_id: organization.organization_id,
        post_date: new Date().toISOString(),
        expiry_date: new Date().toISOString(),
        is_active: true,
      };

      const response = await axios.post(apiUrl, formattedData);


      console.log('Job posted successfully:', response.data);
    } catch (error) {

      console.error('Error posting job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('title', { required: true })}
        label="Job Title"
        fullWidth
        margin="normal"
      />

      <TextField
        {...register('description', { required: true })}
        label="Job Description"
        multiline
        rows={4}
        fullWidth
        margin="normal"
      />

      <TextField
        {...register('salary_min')}
        label="Minimum Salary"
        type="number"
        fullWidth
        margin="normal"
      />

      <TextField
        {...register('salary_max')}
        label="Maximum Salary"
        type="number"
        fullWidth
        margin="normal"
      />

      <TextField
        {...register('country')}
        label="Country"
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="job-type-label">Job Type</InputLabel>
        <Select
        {...register('job_type')}
        labelId="job-type-label"
        label="Job Type"
        defaultValue="full_time"
      >
        <MenuItem value="full_time">Full Time</MenuItem>
        <MenuItem value="part_time">Part Time</MenuItem>
        <MenuItem value="contract">Contract</MenuItem>
      </Select>
      </FormControl>

      <TextField
        {...register('openings')}
        label="Number of Openings"
        type="number"
        fullWidth
        margin="normal"
      />

            <TextField
        {...register('expiry_date')}
        label="Expiry Date"
        type="date"
        fullWidth
        margin="normal"
        />

      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...register('remote_work')} />}
          label="Remote Work"
        />
      </FormGroup>

      <Button type="submit" variant="contained" color="primary">
        Post Job
      </Button>
    </form>
  );
};

export default JobPost;
