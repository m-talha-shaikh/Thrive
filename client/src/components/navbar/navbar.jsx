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
const Navbar = () => {
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

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/Chat');
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const searchQuery = event.target.searchInput.value;

    const results = await searchUsers(searchQuery);
    console.log(results);
  };

  const handleSearchBlur = () => {
    // Hide the search results container when the input loses focus
    setShowResults(false);
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
        <HomeRoundedIcon />
        {darkMode ? <LightModeIcon onClick={toggel} /> : <DarkModeIcon onClick={toggel} />}
        <GridViewIcon />
        <div className="search">
          <form onSubmit={handleSearchSubmit}>
            <SearchIcon />
            <input
              type="text"
              name="searchInput"
              placeholder="Search..."
              onBlur={handleSearchBlur}
            />
            <button type="submit"> <SearchIcon /></button>
            {showResults && searchResults.length > 0 && (
              <button className="cancel-button" onClick={handleCancelSearch}>
                <CancelIcon />
              </button>
            )}
          </form>
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
               <div className="user" key={result.user_id}>
               <div className="userInfo">
                 <img src={"../../../public/uploads/" + result.ProfilePic} alt="" />
                
                 <Link to={`/profile/${result.user_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                   <span>{result.username}</span>
                 </Link>
               </div>
             </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <MessageIcon onClick={handleChatClick} style={{ cursor: 'pointer' }} />
        <NotificationsActiveIcon />
        <PersonIcon />
        <div className="user">
          <img src={`../../../public/uploads/${currentUser.data.user.ProfilePic}`} alt="" />
          <span>{currentUser.data.user.username}</span>
        </div>
        <button className="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
