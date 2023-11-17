// Jobs component file

import React from 'react';
import JobDetails from './../../components/Jobs/JobDetails';
import { useForm } from 'react-hook-form';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { TextField, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Grid, Button } from '@mui/material';

import './Jobs.scss';

const queryClient = new QueryClient();

const fetchJobs = async (formData) => {
    const apiUrl = 'http://127.0.0.1:3000/api/v1/Jobs';
    const response = await fetch(`${apiUrl}`);
    return response.json();
};



const Jobs = () => {
    const { handleSubmit, register, control, reset } = useForm();

    const { data, isLoading, isError } = useQuery('jobs', () => fetchJobs(data), {
        onSuccess: (response) => {
            console.log(response);
        },
    });


    const onSubmit = (data) => {
        if (!data.keyword) {
            alert('Cannot search job without a keyword.');
            return;
        }
        data.min_salary = parseInt(data.min_salary, 10);
        data.max_salary = parseInt(data.max_salary, 10);
        // Use React Query's fetch function to trigger the job search
        queryClient.invalidateQueries('jobs', { exact: true, refetchInactive: true });
    };


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
                        <FormLabel component="legend">Job Type</FormLabel>
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
        <JobDetails
            title="React Developer"
            companyName="ABC Corp"
            // salaryMin={60000}
            salaryMax={80000}
            openings={3}
            remoteWork={true}
            description="Systems Limiteeeeeeeeeeeed"
            />
        </>
    );
};

export default Jobs;



