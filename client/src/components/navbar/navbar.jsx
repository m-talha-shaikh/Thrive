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
const Navbar = ()=>
{
  const {toggel,darkMode}= useContext(DarkmodeContext);
  
    return(
        <div className='navbar'>
          <div className='left'>
           <Link to ='/' style={{textDecoration:"none"}}>
            <span style={{fontSize:"30px"}}>Thrive</span>
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
            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""  />
            <span>Hamza Tufail</span>
           </div>
          </div>
        </div>
    )
}
export default Navbar;