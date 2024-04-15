import "./Organization.scss";
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
import JobPost from "../../components/JobPost/JobPost"
import Employees from "../../components/Employees/Employees"
import Applicants from "../../components/Applicants/Applicants"
  
const Organization = ()=> { 

  const [auth, setAuth] = useState(false);
  const [openupdate, setopenupdate] = useState(false);
  const user_id = useLocation().pathname.split("/")[2];
  const [selectedOption, setSelectedOption] = useState('Job Post')
  const {currentUser}=useContext(AuthContext) ;
  
  const { isLoading, error, data } = useQuery(['persons',user_id],async () => {
    return  await makeRequest.get(`/organizations/${user_id}`)
      .then((res) => res.data);

  });
  const {  data:friendsdata } = useQuery(['Connection'],async () => {
    return  await makeRequest.get(`/Connection?user_id=${currentUser.data.user.user_id}`)
      .then((res) => res.data);
  });
  const queryClient = useQueryClient();

  useEffect(() => {
  if (data && data.organization) {
    if (currentUser.data.user.user_id === data.organization.user_id) {
      setAuth(true);
    }
  }
}, [currentUser.data.user.user_id, data]);



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


  
    return (
       <div className="profile">
        <div className="images">
  <div className="cover">
    {data && data.organization && data.organization.CoverPic ? (
      <img
        src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${data.organization.CoverPic}`}
        alt=""
        className="coverPic"
      />
    ) : (
      <p>
        {error
          ? "Something went wrong with the cover picture"
          : isLoading
          ? "Loading cover picture..."
          : "No cover picture available"}
      </p>
    )}
  </div>
  {data && data.organization && data.organization.ProfilePic ? (
    <img
      src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${data.organization.ProfilePic}`}
      alt=""
      className="profilePic"
    />
  ) : (
    <p>
      {error
        ? "Something went wrong with the profile picture"
        : isLoading
        ? "Loading profile picture..."
        : "No profile picture available"}
    </p>
  )}
</div>

        <div className="profilecontainer">
       
            <div className="userinfo">
             <div className="center">
                <span>{error?"This is some thing wrong":(isLoading?"Loading":data.organization.name)}</span>
                <div className="info">
                    <div className="item">
                        <PlaceIcon/>
                    {error?"This is some thing wrong":(isLoading?"Loading":data.organization.country)}
                    </div>
                    <div className="item">
                        <LanguageIcon/>
                        <span>{error?"This is some thing wrong":(isLoading?"Loading":data.organization.website_url)}</span>
                    </div>
                    
                    {user_id==currentUser.data.user.user_id ?
                    <button onClick={()=>setopenupdate(true)}>Update </button> : 
                    <button onClick={handlefriends}>{!friendsdata?"Loading":(friendsdata.includes(parseInt(user_id, 10))?"Following":"Follow")}</button>}
                 </div>
             </div>
            </div>
            <div className="navbar">
            {auth && <button onClick={() => setSelectedOption('Job Post')}>Job Post</button>}
            <button onClick={() => setSelectedOption('Employees')}>Employees</button>
            <button onClick={() => setSelectedOption('Job Applicants')}>Jobs</button>
          </div>
          {auth && selectedOption === 'Job Post' && data && data.organization && <JobPost organization={data.organization} user_id={user_id} />}
          {selectedOption === 'Employees' && data && data.organization && <Employees organization={data.organization} user_id={user_id} />}
          {selectedOption === 'Job Applicants' && data && data.organization && <Applicants user_id={user_id} />}
        </div>
         {isLoading?"Loading": (openupdate&& <Update setopenupdate={setopenupdate} user ={data.organization}/>)}
       </div>
    )
}

export default Organization;