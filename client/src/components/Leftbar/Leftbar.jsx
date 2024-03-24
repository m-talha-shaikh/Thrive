import React, { useContext, useState, useEffect } from "react";
import "./Leftbar.scss";
import Home from "../../assets/Home.png";
import Explore from "../../assets/5.png";
import Notification from "../../assets/11.png";
import Messages from "../../assets/messages.png";
import settings from "../../assets/settings.png";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Leftbar = () => {
  const [userType, setUserType] = useState("person");
  const [selectedItem, setSelectedItem] = useState(""); // State to track selected item
  const { currentUser, Logout } = useContext(AuthContext);

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
          <div className="item" onClick={() => handleItemClick("home")}>
            <img src={Home} alt="" />
            <Link
              to={`/profile/${currentUser.data.user.user_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Home</span>
            </Link>
          </div>

          <Link to={`/jobs`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "explore" ? "selected" : ""}`} onClick={() => handleItemClick("explore")}>
              <img src={Explore} alt="" />
              <span>Explore Jobs</span>
            </div>
          </Link>

          <Link to={`/jobs`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "notifications" ? "selected" : ""}`} onClick={() => handleItemClick("notifications")}>
              <img src={Notification} alt="" />
              <span>Notifications</span>
            </div>
          </Link>

          <Link to={`/Chat`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={`item ${selectedItem === "messages" ? "selected" : ""}`} onClick={() => handleItemClick("messages")}>
              <img src={Messages} alt="" />
              <span>Messages</span>
            </div>
          </Link>

          <Link to={`/jobs`} style={{ textDecoration: "none", color: "inherit" }}>
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
