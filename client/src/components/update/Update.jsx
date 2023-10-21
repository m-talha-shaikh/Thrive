import { useContext, useState } from "react";
import "./Update.scss"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const Update = ({setopenupdate,user})=>
{
    const {currentUser,setCurrentUser}=useContext(AuthContext) ;
     const [cover,setCover] = useState(null);
     const [Profile,setProfile] = useState(null);
     const [inputs, setInputs] = useState({ ...user });
      const upload = async (file) => {
        try {
            console.log("try maar hai");
          const formData = new FormData();
          formData.append("file", file);
          const res = await makeRequest.post("/upload", formData);
          return res.data;
        } catch (err) {
        
          console.log(err);
        }
      };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
      };
      const queryClient = useQueryClient();
      
  const mutation = useMutation(
    async (user) => {
      try {
     
        const response = await makeRequest.put("/persons",user);
        return response.data; // Assuming your response contains the new post data
      } catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["persons"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const handleclick = async (e) => {
    e.preventDefault();
    let Cover_url = user.CoverPic;
    let Profile_url = user.ProfilePic;
    console.log("yeh kia");
    Cover_url=cover&& await upload(cover);
    Profile_url=Profile&&await upload(Profile) ;
    console.log(Cover_url);
    console.log(Profile_url);
    mutation.mutate({ ...inputs,CoverPic:Cover_url || inputs.CoverPic,ProfilePic:Profile_url || inputs.ProfilePic,user_id:currentUser.data.user.user_id });
    setopenupdate(false);
  };
    return(
        <div className="update">
             <div className="wrapper">
             <h1>Update Your Profile</h1>
            <form >
                <div className="files">
                <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.CoverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input type="file"
              id="cover"
              onChange={(e) => setCover(e.target.files[0])} 
              name="cover"
              style={{ display: "none" }}
              />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                      Profile
                      ? URL.createObjectURL(Profile)
                      : "/upload/" + user.ProfilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
            </div>
            <label>Username</label>
            <input type="text" placeholder="Username" onChange={handleChange} name="username" value={inputs.username}/>
            <label>First Name</label>
            <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" value={inputs.first_name}/>
            <label>Last Name</label>
            <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" value={inputs.last_name}/>
            <label>City</label>
            <input type="text" placeholder="City" onChange={handleChange} name="city" value={inputs.city}/>
            <label>State</label>
            <input type="text" placeholder="State" onChange={handleChange} name="state" value={inputs.state}/>
            <label>Country</label>
            <input type="text" placeholder="Country" onChange={handleChange} name="country" value={inputs.country}/>
             <button onClick={handleclick}>Update</button>
            </form>
            <button className="close" onClick={()=>setopenupdate(false)}>X</button>
            </div>
        </div>
    )
}

export default Update;