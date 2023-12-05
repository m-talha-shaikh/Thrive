
import "./Person.scss";
import { Button, TextField, Typography, Paper, Container} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import Update from "../../components/update/Update";
import { useForm, Controller } from "react-hook-form";

  
const Person = ()=>
{ 

  const [authorized, setAuthorized] = useState(false);
  

  //Education Form
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showEmploymentForm, setShowEmploymentForm] = useState(false);
  const [showCertificationsForm, setShowCertificationsForm] = useState(false);

  const [openupdate, setopenupdate] = useState(false);
  const user_id = useLocation().pathname.split("/")[2];
  const {currentUser}=useContext(AuthContext) ;
  //  if(user_id == currentUser.data.user.user_id){
  //   setAuthorized(true);
  // }

    useEffect(() => {
    // Check if user_id is equal to the currentUser's user_id
    if (user_id == currentUser.data.user.user_id) {
      // Set authorized to true
      setAuthorized(true);
    } else {
      // Set authorized to false if the condition is not met
      setAuthorized(false);
    }
  }, [currentUser, user_id]);

  const { isLoading, error, data } = useQuery(['persons',user_id],async () => {
    return  await makeRequest.get(`/persons/${user_id}`)
      .then((res) => res.data);
  });
  const {  data:friendsdata } = useQuery(['Connection'],async () => {
    return  await makeRequest.get(`/Connection?user_id=${currentUser.data.user.user_id}`)
      .then((res) => res.data);
  });
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (following) => {
      try {
        if (following) {
          const response = await makeRequest.delete(`/Connection`, {
            params: {
              friend_id: user_id,
              user_id:currentUser.data.user.user_id
            }
          });
          return response.data; 
        }
        else{
          const response = await makeRequest.post("/Connection",{user_id: currentUser.data.user.user_id,friend_id:user_id} );
          return response.data; 
        }
        
      } catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["Connection"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  
  const handlefriends= ()=>
  {
     mutation.mutate(friendsdata.includes(parseInt(user_id,10)))
  }


    const { handleSubmit, control, reset } = useForm();

  const onSubmitEducation = async (formData) => {
    try {
      await makeRequest.post(`/persons/${user_id}/education`, formData);

      queryClient.invalidateQueries(['persons', user_id]);

      // Close the form and reset it
      setShowEducationForm(false);
      reset();
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDeleteEducation = async (educationId) => {
  try {

    await makeRequest.delete(`/persons/${user_id}/education/${educationId}`);

    // Invalidate and refetch education data
    queryClient.invalidateQueries(['persons', user_id]);
  } catch (err) {
    console.error(err);
  }
};

const onSubmitEmployment = async (formData) => {
  try {

    await makeRequest.post(`/persons/${user_id}/employment`, formData);

    // Invalidate and refetch employment data
    queryClient.invalidateQueries(['persons', user_id]);

    // Close the form and reset it
    setShowEmploymentForm(false);
    reset();
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteEmployment = async (employmentId) => {
  try {

    await makeRequest.delete(`/persons/${user_id}/employment/${employmentId}`);

    // Invalidate and refetch employment data
    queryClient.invalidateQueries(['persons', user_id]);
  } catch (err) {
    console.error(err);
  }
};



const onSubmitCertifications = async (formData) => {
  console.log("Hi");
  console.log(formData);
  try {

    await makeRequest.post(`/persons/${user_id}/certification`, formData);

    // Invalidate and refetch certification data
    queryClient.invalidateQueries(['persons', user_id]);

    // Close the form and reset it
    setShowCertificationsForm(false);
    reset();
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteCertifications = async (certificationId) => {
  try {

    await makeRequest.delete(`/persons/${user_id}/certification/${certificationId}`);

    // Invalidate and refetch certification data
    queryClient.invalidateQueries(['persons', user_id]);
  } catch (err) {
    console.error(err);
  }
};





 

    return (
       <div className="profile">
        <div className="images">
        {data && data.person && data.person.CoverPic ? ( <img src={`../../../public/uploads/${data.person.CoverPic}`} alt="" className="Cover" /> ) : ( <p> {error ? "Something went wrong with the cover picture" : isLoading ? "Loading cover picture..." : "No cover picture available"} </p> )}
        {data && data.person && data.person.ProfilePic ? ( <img src={`../../../public/uploads/${data.person.ProfilePic}`} alt="" className="profilePic" /> ) : ( <p> {error ? "Something went wrong with the profile picture" : isLoading ? "Loading profile picture..." : "No profile picture available"} </p> )}
        </div>
        <div className="profilecontainer">
       
            <div className="userinfo">
             <div className="center">
                <span>{error?"This is some thing wrong":(isLoading?"Loading":data.person.first_name+" "+data.person.last_name)}</span>
                <div className="info">
                    <div className="item">
                        <PlaceIcon/>
                    {error?"This is some thing wrong":(isLoading?"Loading":data.person.country)}
                    </div>
                    <div className="item">
                        <LanguageIcon/>
                        <span>{error?"This is some thing wrong":(isLoading?"Loading":data.person.username)}</span>
                    </div>
                    
                    {user_id==currentUser.data.user.user_id ?
                    <button onClick={()=>setopenupdate(true)}>Update </button> : 
                    <button onClick={handlefriends}>{!friendsdata?"Loading":(friendsdata.includes(parseInt(user_id, 10))?"Following":"Follow")}</button>}
                 </div>
             </div>
            </div>
        </div>

    <div className="education">
      <div className="heading">
    <h2 style={{ display: 'inline-block'}}>Education</h2>
    {showEducationForm && <Button style={{ display: 'inline-block', marginLeft: '50px' }} variant="contained" onClick={() => setShowEducationForm(false)}>X</Button>}
    {authorized && !showEducationForm && ( <Button style={{ display: 'inline-block', marginLeft: '50px' }} variant="contained" onClick={() => setShowEducationForm(true)} > Add </Button> )}

      </div>
      {data && data.education && data.education.map((item, index) => (
        <div key={index} className="education-item">
          <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
            <Typography variant="h3" style={{ display: 'inline-block', marginRight: '10px'  }}>{item.major}</Typography>
            {authorized && ( <Button variant="contained" color="error" onClick={() => handleDeleteEducation(item.education_id)} style={{ display: 'inline-block', marginLeft: '10px' }} > Delete </Button> )}
          </div>
          <Typography variant="body1">{item.name}</Typography>
          {item.year_graduated ? (
            <Typography variant="body1">{`${item.year_enrolled} - ${item.year_graduated}`}</Typography>
          ) : (
            <Typography variant="body1">{item.currently_studying ? 'Present' : item.year_enrolled}</Typography>
          )}
          <Typography variant="body1">{item.text_description}</Typography>
        </div>
      ))}
      {showEducationForm && (
        <form onSubmit={handleSubmit(onSubmitEducation)}>
          <div>
            <Typography variant="body1">Name:</Typography>
            <Controller
              name="institute_name"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field} />}
            />
          </div>
          <div>
            <Typography variant="body1">Major</Typography>
            <Controller
              name="major"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field} />}
            />
          </div>
          <div>
            <Typography variant="body1">Year Enrolled:</Typography>
            <Controller
              name="year_enrolled"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field} />}
            />
          </div>
          <div>
            <Typography variant="body1">Year Graduated:</Typography>
            <Controller
              name="year_graduated"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field} />}
            />
          </div>
          <div>
            <Typography variant="body1">Description</Typography>
            <Controller
              name="text_description"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field} />}
            />
          </div>
          <div>
            <Button type="submit" variant="contained">Submit</Button>
          </div>
          <div></div>
        </form>
      )}
    </div>


    

<div className="education">
  <div className="heading">
    <h2 style={{ display: 'inline-block'}}>Employment </h2>
    {showEmploymentForm && <Button style={{ display: 'inline-block', marginLeft: '50px' }} variant="contained" onClick={() => setShowEmploymentForm(false)}>X</Button>}
    {authorized && !showEmploymentForm && ( <Button style={{ display: 'inline-block', marginLeft: '50px' }} variant="contained" onClick={() => setShowEmploymentForm(true)} > Add </Button> )}

  </div>
  {data && data.employment && data.employment.map((item, index) => (
    <div key={index} className="employment-item">
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <h3 style={{ display: 'inline-block', marginRight: '10px' }}>{item.title}</h3>
        {authorized && ( <Button variant="contained" color="error" onClick={() => handleDeleteEmployment(item.employment_id)} style={{ display: 'inline-block', marginLeft: '10px' }} > Delete </Button> )}
      </div>
      <p>{item.orgnaization_name}</p>
      {item.year_left ? (
        <p>{`${item.month_started}/${item.year_started} - ${item.month_left}/${item.year_left}`}</p>
      ) : (
        <p>{`${item.month_started}/${item.year_started} - Present`}</p>
      )}
      <p>{item.text_description}</p>
    </div>
  ))}
  {showEmploymentForm && (
    <form onSubmit={handleSubmit(onSubmitEmployment)}>
      <div>
        <Typography variant="body1">Title:</Typography>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
        <Typography variant="body1">Company Name:</Typography>
        <Controller
          name="organization_name"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
        <Typography variant="body1">Month and Year Started:</Typography>
        <Controller
          name="month_started"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
        <Controller
          name="year_started"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
        <Typography variant="body1">Month and Year Left (if applicable):</Typography>
        <Controller
          name="month_left"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
        <Controller
          name="year_left"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
        <Typography variant="body1">Description:</Typography>
        <Controller
          name="text_description"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
        <Button type="submit" variant="contained">Submit</Button>
      </div>
    </form>
  )}
</div>


<div className="education">
  <div className="heading">
    <h2 style={{ display: 'inline-block'}}>Certifications </h2>
    {showCertificationsForm && <Button style={{ display: 'inline-block', marginLeft: '50px' }} variant="contained" onClick={() => setShowCertificationsForm(false)}>X</Button>}
{authorized && !showCertificationsForm && ( <Button style={{ display: 'inline-block', marginLeft: '50px' }} variant="contained" onClick={() => setShowCertificationsForm(true)} > Add </Button> )}


  </div>
  {data && data.certifications && data.certifications.map((item, index) => (
    <div key={index} className="certification-item">
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <h3 style={{ display: 'inline-block', marginRight: '10px' }}>{item.name}</h3>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteCertifications(item.certification_id)}
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          Delete
        </Button>
      </div>
      <p>{item.issuing_organization}</p>
      <p>{new Date(item.issue_date).toLocaleDateString()}</p>
      <p>{item.expiration_date && new Date(item.expiration_date).toLocaleDateString()}</p>
    </div>
  ))}
  {showCertificationsForm && (
    <form onSubmit={handleSubmit(onSubmitCertifications)}>
      <div>
        <Typography variant="body1">Name:</Typography>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
        <Typography variant="body1">Issuing Organization:</Typography>
        <Controller
          name="issuing_organization"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} />}
        />
      </div>
      <div>
  <Typography variant="body1">Issue Date:</Typography>
  <Controller
    name="issue_date"
    control={control}
    defaultValue=""
    render={({ field }) => <TextField type="date" {...field} />}
  />
</div>
<div>
  <Typography variant="body1">Expiry Date:</Typography>
  <Controller
    name="expiration_date"
    control={control}
    defaultValue=""
    render={({ field }) => <TextField type="date" {...field} />}
  />
</div>
      <div>
        <Button type="submit" variant="contained">Submit</Button>
      </div>
    </form>
  )}
</div>
         {isLoading?"Loading": (openupdate&& <Update setopenupdate={setopenupdate} user ={data.person}/>)}
       </div>
       
    )
}

export default Person;