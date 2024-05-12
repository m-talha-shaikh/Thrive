import React, { useContext } from "react";
import "./Rightbar.scss";
import { useQuery } from "react-query";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { ProfileTypeContext } from '../../context/ProfileTypeContext';

const Rightbar = () => {
  const { fetchAccountType } = useContext(ProfileTypeContext);
  const { currentUser } = useContext(AuthContext);

  // Fetch online friends
  const { isLoading, error, data } = useQuery('getfriends', async () => {
    const response = await makeRequest.get(`/Connection/messagingfriends`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    });
    return response.data;
  });

  // Fetch users who are not friends
  const { isLoading: isLoading2, error: error2, data: data2 } = useQuery('getusers', async () => {
    const response = await makeRequest.get(`/Connection/UsersNotfriends`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    });
    return response.data;
  });

  // Function to render user components or a fallback message
  const renderUsers = (userData, type) => {
    if (userData === undefined) {
      return <p>Loading...</p>; // or any fallback message
    }

    if (userData.length === 0) {
      return (
        <p style={{ textDecoration: "none", color: "inherit" }}>
          No {type} available.
        </p>
      ); // Fallback message for no users
    }

    // Slice the userData to display only five contacts
    const limitedData = userData.slice(0, 5);

    return limitedData.map((contact) => (
      <div className="user" key={contact.user_id}>
        <div onClick={() => fetchAccountType(contact.user_id)} className="userInfo">
          <img
            src={
              contact.ProfilePic
                ? "https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/" + contact.ProfilePic
                : "https://res.cloudinary.com/dzhkmbnbn/image/upload/v1715465014/user100_oo6mqk.png" // Replace with your default image URL
            }
            alt=""
          />
          <div className="online"></div>
          <div style={{ textDecoration: "none", color: "inherit" }}>
            <span>{contact.username}</span>
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
