import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';  // Update import
import axios from 'axios';
import { makeRequest } from "../../axios";

const Profile = () => {
  const { id } = useParams();
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();  // Change to useNavigate

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await makeRequest.get(`/Auth/userType/${id}`);
      setUserType(response.data.accountType);
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  fetchData();
}, [id]);

  useEffect(() => {
  // Redirect based on userType only if the current path is the profile path
  const currentPath = window.location.pathname;

  if (currentPath === `/profile/${id}`) {
    if (userType === 'person') {
      navigate(`/person/${id}`);
    } else if (userType === 'institute') {
      navigate(`/institute/${id}`);
    } else if (userType === 'organization') {
      navigate(`/organization/${id}`);
    }
  }
}, [userType, id, navigate]);


  if (!userType) {
    return <div>Loading...</div>;
  }

  // Additional rendering for each userType if needed

  return (
    <div>
      
    </div>
  );
};

export default Profile;
