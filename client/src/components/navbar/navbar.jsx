import SearchIcon from '@mui/icons-material/Search';
import React, { useContext } from "react";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GridViewIcon from '@mui/icons-material/GridView';
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./navbar.scss";
import { DarkmodeContext } from "../../context/Darkmodecontext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { toggel, darkMode } = useContext(DarkmodeContext);
  const { currentUser, Logout,setCurrentUser } = useContext(AuthContext); // Assuming you have a logout function in your AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform the logout action
    Logout();
    navigate('/login'); // Redirect to the home page or another suitable page after logout
  };

  const handleChatClick = () => {
    navigate('/Chat');
  };

  return (
    <div className='navbar'>
      <div className='left'>
        <Link to ='/' style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "30px", fontFamily: "cursive" }}>Thrive</span>
        </Link>
        <HomeRoundedIcon />
        {darkMode ? <LightModeIcon onClick={toggel} /> : <DarkModeIcon onClick={toggel} />}
        <GridViewIcon />
        <div className='search'>
          <SearchIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className='right'>
        <MessageIcon onClick={handleChatClick} style={{ cursor: "pointer" }} />
        <NotificationsActiveIcon />
        <PersonIcon />
        <div className='user'>
          <img src={currentUser.data.user.ProfilePic} alt="" />
          <span>{currentUser.data.user.username}</span>
        </div>
        <button onClick={handleLogout}>Logout</button> {/* Add a logout button */}
      </div>
    </div>
  );
}

export default Navbar;
