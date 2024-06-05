import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeRequest } from "../../axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  styled,
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';

const StyledCard = styled(Card)({
    overflowX: 'auto'
});

export default function Ranking() {
    const [job, setJob] = useState({});
    const [jobString, setJobString] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [userResponses, setUserResponses] = useState({});
    const { job_id } = useParams();
    const [similarDocuments, setSimilarDocuments] = useState("");
    const [userRanks, setUserRanks] = useState({})

    const handleRankApplicants = async () => {
        console.log(userResponses)
        console.log(jobString)
        try {
            if (jobString && Object.keys(userResponses).length > 0) {
                const response = await makeRequest.post('http://localhost:5000/similarDocuments', {
                    jobString: jobString,
                    userResponses: userResponses
                });
                setSimilarDocuments(response.data.similar_documents);
                console.log(similarDocuments)
                let replacedStr = similarDocuments.replace(/\n/g, ' ');

                const pairs = replacedStr.split(' ');
                pairs.pop()
                console.log(pairs)
                const obj = {};

                pairs.forEach(pair => {
                    const [key, value] = pair.split(':').map(parseFloat);
                    obj[key] = value;
                });

                setUserRanks(obj)
                console.log(userRanks)
            } else {
                console.log("jobString or userResponses is empty");
            }
        } catch (error) {
            console.error('Error fetching similar documents:', error);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await makeRequest.get(`/jobs/${job_id}`);
                setJob(response.data.job.job);
                setJobString(JSON.stringify(response.data.job.job).replace(/["\[\]{}:,]/g, ' '))
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        fetchJob();
    }, [job_id]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await makeRequest.get(`/jobs/${job_id}/applicants`);
                setApplicants(response.data.job.applicants);
                console.log(applicants)
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };

        fetchApplicants();
    }, [job_id]);

    useEffect(() => {
        const fetchUserDetails = async (userId) => {
            try {
                const response = await makeRequest.get(`/persons/${userId}`);
                setUserResponses(prevState => ({
                    ...prevState,
                    [userId]: JSON.stringify(response.data)
                        .replace(/["\[\]{}:,]/g, ' '),
                }));
            } catch (error) {
                console.error(`Error fetching details for user ${userId}:`, error);
            }
        };

        applicants.forEach(applicant => {
            fetchUserDetails(applicant.user_id);
        });
    }, [applicants]);


        const sortedApplicants = [...applicants].sort((a, b) => {
        return userRanks[b.user_id] - userRanks[a.user_id];
    });

    return (
        <div className="job-card">
            {job && (
                <CardContent>
                    {job.ProfilePic && (
                        <Avatar src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${job.ProfilePic}`} />
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
                    <Grid container spacing={2} alignItems="center">
                        {job.openings && (
                            <Grid item>
                                <Chip icon={<WorkIcon marginRight={1} />} label={`${job.openings} Openings`} />
                            </Grid>
                        )}
                        {job.country && (
                            <Grid item>
                                <Chip icon={<RoomIcon marginRight={1} />} label={job.country} />
                            </Grid>
                        )}
                        {/* {job.remote_work && (
                            <Grid item>
                                <Chip icon={<Avatar>🏠</Avatar>} label="Remote Work" />
                            </Grid>
                        )} */}
                        {job.job_type && (
                            <Grid item>
                                <Chip icon={<BusinessIcon marginRight={1} />} label={job.job_type} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={2} alignItems="center" marginBottom={2}>
                        {job.post_date && (
                            <Grid item>
                                <Chip icon={<EventIcon marginRight={1} />} label={`Posted on ${new Date(job.post_date).toLocaleDateString()}`} />
                            </Grid>
                        )}
                        {/* {job.expiry_date && (
                            <Grid item>
                                <Chip icon={<EventIcon marginRight={1} />} label={`Expires on ${new Date(job.expiry_date).toLocaleDateString()}`} />
                            </Grid>
                        )} */}
                    </Grid>
                </CardContent>
            )}
            <div>
                <button onClick={handleRankApplicants}>Rank Applicants</button>
            </div>
            <h2>Top Candidates</h2>
            <div className="applicants-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {sortedApplicants.map(applicant => (
                    <div key={applicant.application_id} className="applicant" style={{ marginRight: '10px', marginBottom: '10px' }}>
                        <img 
                            src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${applicant.ProfilePic}`} 
                            alt={`${applicant.first_name} ${applicant.last_name}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <p>{`${applicant.first_name} ${applicant.last_name}`}</p>
                        <p>{`Score: ${(userRanks[applicant.user_id] * 100).toFixed(2)}%`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { makeRequest } from "../../axios";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Chip,
//   Avatar,
//   styled,
// } from '@mui/material';
// import RoomIcon from '@mui/icons-material/Room';
// import WorkIcon from '@mui/icons-material/Work';
// import EventIcon from '@mui/icons-material/Event';
// import BusinessIcon from '@mui/icons-material/Business';

// const StyledCard = styled(Card)({
//     overflowX: 'auto'
// });

// export default function Ranking() {
//     const [job, setJob] = useState({});
//     const [jobString, setJobString] = useState('')
//     const [applicants, setApplicants] = useState([]);
//     const [userResponses, setUserResponses] = useState({});
//     const { job_id } = useParams();
//     const [similarDocuments, setSimilarDocuments] = useState("");

//     const handleRankApplicants = async () => {
//         console.log(userResponses)
//         console.log(jobString)
//         try {
//             const response = await makeRequest.post('http://localhost:5000/similarDocuments', {
//                 jobString: jobString,
//                 userResponses: userResponses
//             });
//             setSimilarDocuments(response.data.similar_documents);
//             console.log(response)
//         } catch (error) {
//             console.error('Error fetching similar documents:', error);
//         }
//     };

//     useEffect(() => {
//         const fetchJob = async () => {
//             try {
//                 const response = await makeRequest.get(`/jobs/${job_id}`);
//                 setJob(response.data.job.job);
//                 setJobString(JSON.stringify(job).replace(/["\[\]{}:,]/g, ' '))
//             } catch (error) {
//                 console.error('Error fetching job details:', error);
//             }
//         };

//         fetchJob();
//     }, [job_id]);

//     useEffect(() => {
//         const fetchApplicants = async () => {
//             try {
//                 const response = await makeRequest.get(`/jobs/${job_id}/applicants`);
//                 setApplicants(response.data.job.applicants);
//                 console.log(applicants)
//             } catch (error) {
//                 console.error('Error fetching applicants:', error);
//             }
//         };

//         fetchApplicants();
//     }, [job_id]);

//     useEffect(() => {
//         const fetchUserDetails = async (userId) => {
//             try {
//                 const response = await makeRequest.get(`/persons/${userId}`);
//                 setUserResponses(prevState => ({
//                     ...prevState,
//                     [userId]: JSON.stringify(response.data)
//                         .replace(/["\[\]{}:,]/g, ' '),
//                 }));
//             } catch (error) {
//                 console.error(`Error fetching details for user ${userId}:`, error);
//             }
//         };

//         applicants.forEach(applicant => {
//             fetchUserDetails(applicant.user_id);
//         });

//     }, [applicants]);


//     return (
//         <div className="job-card">
//             {job && (
//                 <CardContent>
//                     {job.ProfilePic && (
//                         <Avatar src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${job.ProfilePic}`} />
//                     )}
//                     {job.title && (
//                         <Typography className="job-title" variant="h5" fontSize="1.5rem" fontWeight="bold" marginBottom={1}>
//                             {job.title}
//                         </Typography>
//                     )}
//                     {job.name && (
//                         <Typography className="job-name" variant="h6" fontSize="1.8rem" color="primary" marginBottom={1}>
//                             {job.name}
//                         </Typography>
//                     )}
//                     {job.description && (
//                         <Typography className="job-description" variant="body1" color="textSecondary">
//                             {job.description}
//                         </Typography>
//                     )}
//                     <Grid container spacing={2} alignItems="center">
//                         {job.openings && (
//                             <Grid item>
//                                 <Chip icon={<WorkIcon marginRight={1} />} label={`${job.openings} Openings`} />
//                             </Grid>
//                         )}
//                         {job.country && (
//                             <Grid item>
//                                 <Chip icon={<RoomIcon marginRight={1} />} label={job.country} />
//                             </Grid>
//                         )}
//                         {job.remote_work && (
//                             <Grid item>
//                                 <Chip icon={<Avatar>🏠</Avatar>} label="Remote Work" />
//                             </Grid>
//                         )}
//                         {job.job_type && (
//                             <Grid item>
//                                 <Chip icon={<BusinessIcon marginRight={1} />} label={job.job_type} />
//                             </Grid>
//                         )}
//                     </Grid>
//                     <Grid container spacing={2} alignItems="center" marginBottom={2}>
//                         {job.post_date && (
//                             <Grid item>
//                                 <Chip icon={<EventIcon marginRight={1} />} label={`Posted on ${new Date(job.post_date).toLocaleDateString()}`} />
//                             </Grid>
//                         )}
//                         {job.expiry_date && (
//                             <Grid item>
//                                 <Chip icon={<EventIcon marginRight={1} />} label={`Expires on ${new Date(job.expiry_date).toLocaleDateString()}`} />
//                             </Grid>
//                         )}
//                     </Grid>
//                 </CardContent>
//             )}
//             {/* <div>
//                 <h2>User Responses</h2>
//                 <ul>
//                     {Object.entries(userResponses).map(([userId, response]) => (
//                         <li key={userId}>{`User ${userId}: ${response}`}</li>
//                     ))}
//                 </ul>
//             </div> */}
//             <div>
//                 <button onClick={handleRankApplicants}>Rank Applicants</button>
//                 <div>
//                     <h2>Similar Documents</h2>
//                     <p>{similarDocuments}</p>
//                 </div>
//             </div>
//         </div>
//     );
// }


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { makeRequest } from "../../axios";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Chip,
//   Avatar,
//   styled,
// } from '@mui/material';
// import RoomIcon from '@mui/icons-material/Room';
// import WorkIcon from '@mui/icons-material/Work';
// import EventIcon from '@mui/icons-material/Event';
// import BusinessIcon from '@mui/icons-material/Business';

// const StyledCard = styled(Card)({
//     overflowX: 'auto'
// });

// export default function Ranking() {
//     const [job, setJob] = useState({});
//     const [jobString, setJobString] = useState('')
//     const [applicants, setApplicants] = useState([]);
//     const [userResponses, setUserResponses] = useState({});
//     const { job_id } = useParams();
//     const [similarDocuments, setSimilarDocuments] = useState("");
//     const [userRanks, setUserRanks] = useState({})

//     const handleRankApplicants = async () => {
//         console.log(userResponses)
//         try {

//             const response = await makeRequest.post('http://localhost:5000/similarDocuments', {
//                 jobString: jobString,
//                 userResponses: userResponses
//             });
//             setSimilarDocuments(response.data.similar_documents);
//             console.log(similarDocuments)

//             let replacedStr = similarDocuments.replace(/\n/g, ' ');

//             const pairs = replacedStr.split(' ');
//             pairs.pop()
//             console.log(pairs)
//             const obj = {};

//             pairs.forEach(pair => {
//                 const [key, value] = pair.split(':').map(parseFloat);
//                 obj[key] = value;
//             });

//             setUserRanks(obj)
//             console.log(userRanks)
            
//         } catch (error) {
//             console.error('Error fetching similar documents:', error);
//         }
//     };

//     useEffect(() => {
//         const fetchJob = async () => {
//             try {
//                 const response = await makeRequest.get(`/jobs/${job_id}`);
//                 setJob(response.data.job.job);
//                 setJobString(JSON.stringify(job).replace(/["\[\]{}:,]/g, ' '))
//             } catch (error) {
//                 console.error('Error fetching job details:', error);
//             }
//         };

//         fetchJob();
//     }, [job_id]);

//     useEffect(() => {
//         const fetchApplicants = async () => {
//             try {
//                 const response = await makeRequest.get(`/jobs/${job_id}/applicants`);
//                 setApplicants(response.data.job.applicants);
//                 console.log(applicants)
//             } catch (error) {
//                 console.error('Error fetching applicants:', error);
//             }
//         };

//         fetchApplicants();
//     }, [job_id]);

//     useEffect(() => {
//         const fetchUserDetails = async (userId) => {
//             try {
//                 const response = await makeRequest.get(`/persons/${userId}`);
//                 setUserResponses(prevState => ({
//                     ...prevState,
//                     [userId]: JSON.stringify(response.data)
//                         .replace(/["\[\]{}:,]/g, ' '),
//                 }));
//             } catch (error) {
//                 console.error(`Error fetching details for user ${userId}:`, error);
//             }
//         };

//         applicants.forEach(applicant => {
//             fetchUserDetails(applicant.user_id);
//         });
//     }, [applicants]);


//     // Sort applicants by their score in descending order
//     const sortedApplicants = [...applicants].sort((a, b) => {
//         return userRanks[b.user_id] - userRanks[a.user_id];
//     });

//     return (
//         <div className="job-card">
//             {job && (
//                 <CardContent>
//                     {job.ProfilePic && (
//                         <Avatar src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${job.ProfilePic}`} />
//                     )}
//                     {job.title && (
//                         <Typography className="job-title" variant="h5" fontSize="1.5rem" fontWeight="bold" marginBottom={1}>
//                             {job.title}
//                         </Typography>
//                     )}
//                     {job.name && (
//                         <Typography className="job-name" variant="h6" fontSize="1.8rem" color="primary" marginBottom={1}>
//                             {job.name}
//                         </Typography>
//                     )}
//                     {job.description && (
//                         <Typography className="job-description" variant="body1" color="textSecondary">
//                             {job.description}
//                         </Typography>
//                     )}
//                     <Grid container spacing={2} alignItems="center">
//                         {job.openings && (
//                             <Grid item>
//                                 <Chip icon={<WorkIcon marginRight={1} />} label={`${job.openings} Openings`} />
//                             </Grid>
//                         )}
//                         {job.country && (
//                             <Grid item>
//                                 <Chip icon={<RoomIcon marginRight={1} />} label={job.country} />
//                             </Grid>
//                         )}
//                         {job.remote_work && (
//                             <Grid item>
//                                 <Chip icon={<Avatar>🏠</Avatar>} label="Remote Work" />
//                             </Grid>
//                         )}
//                         {job.job_type && (
//                             <Grid item>
//                                 <Chip icon={<BusinessIcon marginRight={1} />} label={job.job_type} />
//                             </Grid>
//                         )}
//                     </Grid>
//                     <Grid container spacing={2} alignItems="center" marginBottom={2}>
//                         {job.post_date && (
//                             <Grid item>
//                                 <Chip icon={<EventIcon marginRight={1} />} label={`Posted on ${new Date(job.post_date).toLocaleDateString()}`} />
//                             </Grid>
//                         )}
//                         {job.expiry_date && (
//                             <Grid item>
//                                 <Chip icon={<EventIcon marginRight={1} />} label={`Expires on ${new Date(job.expiry_date).toLocaleDateString()}`} />
//                             </Grid>
//                         )}
//                     </Grid>
//                 </CardContent>
//             )}
//             {/* <div>
//                 <h2>User Responses</h2>
//                 <ul>
//                     {Object.entries(userResponses).map(([userId, response]) => (
//                         <li key={userId}>{`User ${userId}: ${response}`}</li>
//                     ))}
//                 </ul>
//             </div> */}
//             <div>
//                 <button onClick={handleRankApplicants}>Rank Applicants</button>
//                 <div>
//                     <h2>Similar Documents</h2>
//                     <p>{similarDocuments}</p>
//                 </div>
//             </div>
//             <div className="applicants-list">
//                 {sortedApplicants.map(applicant => (
//                     <div key={applicant.application_id} className="applicant">
//                         {/* <img src={applicant.ProfilePic} alt={`${applicant.first_name} ${applicant.last_name}`} /> */}
//                         <p>{`${applicant.first_name} ${applicant.last_name}`}</p>
//                         <p>{`Score: ${(userRanks[applicant.user_id] * 100).toFixed(2)}%`}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

