// Jobs component file
import axios from 'axios';
import React, { useState } from 'react';
import JobDetails from './../../components/Jobs/JobDetails';
import { useForm } from 'react-hook-form';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { TextField, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import './Jobs.scss';

const queryClient = new QueryClient();

const Jobs = () => {
  const { handleSubmit, register, control, reset } = useForm();
  const [jobData , setJobData] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);


  const onSubmit = async (data) => {
    if (!data.keyword) {
      alert('Cannot search job without a keyword.');
      return;
    }
    data.min_salary = parseInt(data.min_salary, 10);
    data.max_salary = parseInt(data.max_salary, 10);

    try {
      // Make a GET request to your backend
      const response = await axios.get('http://localhost:3000/api/v1/Jobs', { params: data });
      setJobData(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // Use React Query's fetch function to trigger the job search
    queryClient.invalidateQueries('jobs', { exact: true, refetchInactive: true });
  };

//   console.log(jobData);

    return (
        <>
        <QueryClientProvider client={queryClient}>
            <div className="jobs-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Keyword"
                            id="keyword"
                            {...register('keyword')}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Country"
                            id="country"
                            {...register('country')}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Min Salary"
                            type="number"
                            {...register('min_salary', { min: 1, max: 1000000 })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Max Salary"
                            type="number"
                            {...register('max_salary', { min: 1, max: 1000000 })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel component="legend">Remote Work</FormLabel>
                        <FormControlLabel
                            control={<Checkbox {...register('remote')} />}
                            label="Yes"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel component="legend">Job Type</FormLabel>
                        <FormControlLabel
                            control={<Checkbox {...register('jobType.fullTime')} />}
                            label="Full Time"
                        />
                        <FormControlLabel
                            control={<Checkbox {...register('jobType.partTime')} />}
                            label="Part Time"
                        />
                        <FormControlLabel
                            control={<Checkbox {...register('jobType.internship')} />}
                            label="Internship"
                        />
                        <FormControlLabel
                            control={<Checkbox {...register('jobType.contract')} />}
                            label="Contract"
                        />
                    </Grid>


                        <Grid item xs={12} container justifyContent="center" alignItems="center">
                            <Button type="submit" variant="contained" color="primary">
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </QueryClientProvider>
                {jobData.length > 0 && (
      <div className="job-details-container">
        {jobData.map((job) => (
            <div>
               <Link to={`/jobs/${job.job_id}`}>
              <JobDetails
                ProfilePic={job.ProfilePic}
                key={job.job_id}
                job_id = {job.job_id}
                title={job.title}
                companyName={job.companyName}
                salaryMin={job.salary_min}
                salaryMax={job.salary_max}
                openings={job.openings}
                remoteWork={job.remoteWork}
              />
              </Link> 
            </div>
          ))}
      </div>
    )}
        </>
    );
};

export default Jobs;



