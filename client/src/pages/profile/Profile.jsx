import "./Profile.scss";
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";

import Update from "../../components/update/Update";
const certificationItems = [
    {
      name: "Certified Web Developer",
      organization: "WebDev Institute",
      date: "June 2022",
    },
    {
      name: "JavaScript Developer Certification",
      organization: "TechCertify",
      date: "May 2022",
    },
    {
      name: "React.js Fundamentals",
      organization: "React Academy",
      date: "April 2022",
    },
  ];
  const educationItems = [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of XYZ",
      year: "2018-2022",
    },
    {
      degree: "Master of Business Administration",
      school: "Business School ABC",
      year: "2022-2024",
    },
    {
      degree: "Associate Degree in Engineering",
      school: "Community College DEF",
      year: "2016-2018",
    },
  ];
  
const Profile = ()=>
{ 
  const [openupdate, setopenupdate] = useState(false);
  const user_id = useLocation().pathname.split("/")[2];
  console.log(user_id);
  const {currentUser}=useContext(AuthContext) ;
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
          return response.data; // Assuming your response contains the new post data
         
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
    return (
       <div className="profile">
        <div className="images">
        <img src={error?"This is some thing wrong":(isLoading?"Loading":"../../../public/uploads/"+data.person.CoverPic)} alt="" className="cover"/>
        <img src={error?"This is some thing wrong":(isLoading?"Loading":"../../../public/uploads/"+data.person.ProfilePic)} alt=""  className="profilePic"/>
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

<h2>Eduaction</h2>
</div>
         {educationItems.map((item, index) => (
    <div key={index} className="education-item">
      <h3>{item.degree}</h3>
      <p>{item.school}</p>
      <p>{item.year}</p>
    </div>
  ))}
         </div>

         <div className="education">
            <div className="heading">

            <h2>Certifications</h2>
            </div>
         {certificationItems.map((item, index) => (
    <div key={index} className="certification-item">
      <h3>{item.name}</h3>
      <p>{item.organization}</p>
      <p>{item.date}</p>
    </div>
  ))}

         </div>
      
         {isLoading?"Loading": (openupdate&& <Update setopenupdate={setopenupdate} user ={data.person}/>)}
       </div>
       
    )
}

export default Profile;