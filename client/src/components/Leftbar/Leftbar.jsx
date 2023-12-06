import React, { useContext, useState, useEffect } from "react";
import "./Leftbar.scss"
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Jobs from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";

import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
const Leftbar = ()=>
{
  const [ userType, setUserType ] = useState('person');
  const {currentUser}=useContext(AuthContext) ;
   useEffect(() => {
    // Move the setUserType inside the useEffect to avoid re-renders
    setUserType(currentUser.data.user.account_type);
  }, [currentUser.data.user.account_type]);
  console.log(userType);

  console.log(currentUser.data.user)+"leftbar";
    return(
        <div className='leftbar'>
          <div className="container">
           <div className="menu">
            <div className="user">
            <img src={"../../../public/uploads/"+currentUser.data.user.ProfilePic} alt=""  />
            {userType == 'person' ? (
              <Link to={`/profile/${currentUser.data.user.user_id}`} style={{textDecoration:"none",color:"inherit"}}>
            <span>{currentUser.data.user.username}</span> 
            </Link>
            ) : userType == 'institute' ? (
              <Link to={`/institute/${currentUser.data.user.user_id}`} style={{textDecoration:"none",color:"inherit"}}>
            <span>{currentUser.data.user.username}</span> 
            </Link>
            ) : userType == 'organization' ? (
              <Link to={`/organization/${currentUser.data.user.user_id}`} style={{textDecoration:"none",color:"inherit"}}>
            <span>{currentUser.data.user.username}</span> 
            </Link>
            ) : (
              <p>Error</p>
            )}
    
            </div>
            <div className="item">
                <img src={Friends} alt=""  />
                <span>Friends</span>
            </div>
            <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <Link to={`/jobs`} style={{textDecoration:"none",color:"inherit"}}>
          <div className="item">
            <img src={Jobs} alt="" />
            <span>Jobs</span>
          </div>
          </Link>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
           </div>
           <hr/>
           <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div>
          </div>
        </div>
    )
}
export default Leftbar;