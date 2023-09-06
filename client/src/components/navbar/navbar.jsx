import React from "react";
import classes from './navbar.module.css'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GridViewIcon from '@mui/icons-material/GridView';
import { Link } from "react-router-dom";
const Navbar = ()=>
{
    return(
        <div className={classes.navbar}>
          <div className={classes.left}>
           <Link to ='/' style={{textDecoration:"none"}}>
            <span>Thrive</span>
           </Link>
           <HomeRoundedIcon/>
           <DarkModeIcon/>
           <GridViewIcon/>
           <div className={classes.centercontainer}>

           <div className={classes.search}>
            <span className={classes.searchicon}>
            <SearchIcon/>    
            </span>
            <input type="text" placeholder="Search..."  />
           </div>
          </div>
          </div>
          <div className={classes.right}>
           <MessageIcon/>
           <NotificationsActiveIcon/>
           <PersonIcon/>
           <div className={classes.user}>
            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""  />
            <span>Hamza Tufail</span>
           </div>
          </div>
        </div>
    )
}
export default Navbar;