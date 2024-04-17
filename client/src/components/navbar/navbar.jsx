import SearchIcon from '@mui/icons-material/Search';
import React, { useContext, useState } from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GridViewIcon from '@mui/icons-material/GridView';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import './navbar.scss';
import { DarkmodeContext } from '../../context/Darkmodecontext';
import { AuthContext } from '../../context/AuthContext';
import { makeRequest } from '../../axios';
import CancelIcon from '@mui/icons-material/Cancel';

import { ProfileTypeContext } from '../../context/ProfileTypeContext';

  


const Navbar = () => {
  const { fetchAccountType } = useContext(ProfileTypeContext);
  const { toggel, darkMode } = useContext(DarkmodeContext);
  const { currentUser, Logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Define a mutation function for fetching search results
  const searchUsers = async (searchQuery) => {
    try {
      const response = await makeRequest.get(`/users/search?query=${searchQuery}`);
      const results = response.data; // Assuming the response is in JSON format
      setSearchResults(results); // Update the state with search results
      setShowResults(true); // Show the search results container
      return results;
    } catch (error) {
      console.error('Search Error:', error);
      throw new Error('Error searching users');
    }
  };

  const userClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Image clicked");
  };

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/Chat');
  };

  const handleSearchChange = async (event) => {
    const searchQuery = event.target.value;

    if (searchQuery.trim() === '') {
      // If search query is empty, hide search results
      setShowResults(false);
      setSearchResults([]);
    } else {
      // Otherwise, fetch search results
      const results = await searchUsers(searchQuery);
      console.log(results);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200); // Delay of 200 milliseconds
  };

  
  const handleCancelSearch = () => {
    // Clear search results and hide the container
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '30px', fontFamily: 'cursive' }}>Thrive</span>
        </Link>
        
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            name="searchInput"
            placeholder="Search..."
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
          />
          {showResults && searchResults.length > 0 && (
            <button className="cancel-button" onClick={handleCancelSearch} style={{background:"transparent"}}>
              <CancelIcon />
            </button>
          )}
{ searchResults.length > 0 && (
  <div className="search-results">
    {searchResults.map((result) => (
      
      
        <div key={result.user_id}  className="user">
          <div className="userInfo">
          <div to={`/profile/${result.user_id}`} key={result.user_id} style={{ textDecoration: "none", color: "inherit" }}>
            <img src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${result.ProfilePic}`} alt="" onClick={() => fetchAccountType(result.user_id)} />
          </div>
            <span>{result.username}</span>
          </div>
        </div>
  
                      

    ))}
  </div>
)}
        </div>
      </div>
      <div className="right">
        <div className="user">
          <img src={`https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/${currentUser.data.user.ProfilePic}`} alt="" />
          <span>{currentUser.data.user.username}</span>
        </div>
        {darkMode ? <LightModeIcon onClick={toggel} /> : <DarkModeIcon onClick={toggel} />}
      </div>
    </div>
  );
};

export default Navbar; 