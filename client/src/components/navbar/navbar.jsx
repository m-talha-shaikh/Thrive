import React, { useContext } from "react";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GridViewIcon from '@mui/icons-material/GridView';
import { Link } from "react-router-dom";
import "./navbar.scss"
import { DarkmodeContext } from "../../context/Darkmodecontext";
import { AuthContext } from "../../context/AuthContext";
const Navbar = ()=>
{
  const {toggel,darkMode}= useContext(DarkmodeContext);
  const {currentUser}= useContext(AuthContext);
    return(
        <div className='navbar'>
          <div className='left'>
           <Link to ='/' style={{textDecoration:"none"}}>
            <span style={{fontSize:"30px",fontFamily:"cursive"}}>Thrive</span>
           </Link>
           <HomeRoundedIcon/>
           {darkMode?<LightModeIcon onClick={toggel}/>:<DarkModeIcon onClick={toggel}/>}
           <GridViewIcon/>
          

           <div className='search'>
           
            <SearchIcon/>    
            
            <input type="text" placeholder="Search..."  />
           </div>
          
          </div>
          <div className='right'>
           <MessageIcon/>
           <NotificationsActiveIcon/>
           <PersonIcon/>
           <div className='user'>
            <img src={currentUser.Profile} alt=""  />
            <span>{currentUser.name}</span>
           </div>
          </div>
        </div>
    )
}
export default Navbar;