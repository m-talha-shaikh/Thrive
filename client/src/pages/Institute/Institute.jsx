

import { Button, TextField, Typography, Paper, Container} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import Update from "../../components/update/Update";
import { useForm, Controller } from "react-hook-form";

  
const Institute = ()=>
{ 

  const [openupdate, setopenupdate] = useState(false);
  const user_id = useLocation().pathname.split("/")[2];
  const {currentUser}=useContext(AuthContext) ;
  const { isLoading, error, data } = useQuery(['institutes',user_id],async () => {
    return  await makeRequest.get(`/institutes/${user_id}`)
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






  console.log(data);


    return (
       <div className="profile">
        <div className="images">
        {/* <img src={error?"This is some thing wrong":(isLoading?"Loading":"../../../public/uploads/"+data.person.CoverPic)} alt="" className="cover"/>
        <img src={error?"This is some thing wrong":(isLoading?"Loading":"../../../public/uploads/"+data.person.ProfilePic)} alt=""  className="profilePic"/> */}
        </div>
        <div className="profilecontainer">
       
            <div className="userinfo">
             <div className="center">
                <span>{error?"This is some thing wrong":(isLoading?"Loading":data.institute.name+" ")}</span>
                <div className="info">
                    <div className="item">
                        <PlaceIcon/>
                    {error?"This is some thing wrong":(isLoading?"Loading":data.institute.country)}
                    </div>
                    {/* <div className="item">
                        <LanguageIcon/>
                        <span>{error?"This is some thing wrong":(isLoading?"Loading":data.person.username)}</span>
                    </div> */}
                    
                    {user_id==currentUser.data.user.user_id ?
                    <button onClick={()=>setopenupdate(true)}>Update </button> : 
                    <button onClick={handlefriends}>{!friendsdata?"Loading":(friendsdata.includes(parseInt(user_id, 10))?"Following":"Follow")}</button>}
                 </div>
             </div>
            </div>
        </div>
      
         {isLoading?"Loading": (openupdate&& <Update setopenupdate={setopenupdate} user ={data.institute}/>)}
       </div>
       
    )
}

export default Institute;
