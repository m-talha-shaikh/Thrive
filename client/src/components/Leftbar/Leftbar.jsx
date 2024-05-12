import React, { useContext, useState, useEffect } from "react";
import "./Leftbar.scss";
import Home from "../../assets/Home.png";
import Explore from "../../assets/5.png";
import Notification from "../../assets/11.png";
import Messages from "../../assets/messages.png";
import Video from "../../assets/video.png";
import resume from "../../assets/resume.png";
import settings from "../../assets/settings.png";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import { ProfileTypeContext } from '../../context/ProfileTypeContext';


const Leftbar = () => {
  const { fetchAccountType } = useContext(ProfileTypeContext);

  const [userType, setUserType] = useState("person");
  const [selectedItem, setSelectedItem] = useState(""); // State to track selected item
  const { currentUser, Logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setUserType(currentUser.data.user.account_type);
  }, [currentUser.data.user.account_type]);

  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="leftbar">
      <div className="container">
        <div className="menu">
          <div className={`item ${selectedItem === "home" ? "selected" : ""}`} style={{cursor:"pointer"}} onClick={() => handleItemClick("home")}>
            <img src={Home} alt="" />
            <div
              onClick={() => fetchAccountType(currentUser.data.user.user_id)}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Home</span>
            </div>
          </div>

          <Link to={`/jobs`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "explore" ? "selected" : ""}`} onClick={() => handleItemClick("explore")}>
              <img src={Explore} alt="" />
              <span>Explore Jobs</span>
            </div>
          </Link>

         

          <Link to={`/Chat`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "messages" ? "selected" : ""}`} onClick={() => handleItemClick("messages")}>
              <img src={Messages} alt="" />
              <span>Messages</span>
            </div>
          </Link>

          <Link to={`/Lobby`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "video" ? "selected" : ""}`} onClick={() => handleItemClick("video")}>
              <img src={Video} alt="" />
              <span>Video Call</span>
            </div>
          </Link>

         {currentUser.data.user.account_type === 'person' && (
          <Link to={`/resume`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "resume" ? "selected" : ""}`} onClick={() => handleItemClick("resume")}>
              <img src={resume} alt="" />
              <span>Resume Builder</span>
            </div>
          </Link>
        )}


          <Link to={`/setting`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "settings" ? "selected" : ""}`} onClick={() => handleItemClick("settings")}>
              <img src={settings} alt="" />
              <span>Settings</span>
            </div>
          </Link>

          <button className="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leftbar;
