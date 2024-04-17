import React, { useContext } from "react";
import "./Rightbar.scss";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

import { ProfileTypeContext } from '../../context/ProfileTypeContext';


const Rightbar = () => {

  const { fetchAccountType } = useContext(ProfileTypeContext);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery('getfriends', async () => {
    return await makeRequest.get(`/Connection/messagingfriends`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    })
    .then((res) => res.data);
  });

  const { isLoading: isLoading2, error: error2, data: data2 } = useQuery('getusers', async () => {
    return await makeRequest.get(`/Connection/UsersNotfriends`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    })
    .then((res) => res.data);
  });

  // Function to render user components or a fallback message
  const renderUsers = (userData, type) => {
    if (userData === undefined) {
      return <p>Loading...</p>; // or any fallback message
    }

    if (userData.length === 0) {
      return <p  style={{ textDecoration: "none", color: "inherit" }}>No {type} available.</p>; // Fallback message for no users
    }

    return userData.map((contact) => (
      <div   className="user" key={contact.user_id}>
        <div onClick={() => fetchAccountType(contact.user_id)} className="userInfo">
          <img src={"https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/" + contact.ProfilePic } alt="" />
          <div className="online">

          </div>
          {/* <Link to={`/profile/${contact.user_id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <span>{contact.username}</span>
          </Link> */}
          <div style={{ textDecoration: "none", color: "inherit" }}>
            <span >{contact.username}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="rightbar">
      <div className="container">
        <div className="item">
          <span>People you may know! </span>
          {renderUsers(data2, 'people')}
        </div>

        <div className="item">
          <span>Online Friends</span>
          {renderUsers(data, 'friends')}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
