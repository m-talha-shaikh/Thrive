import axios from "axios";
import { useState, useEffect } from 'react';
import classes from './profile.module.css'
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { user_id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
      const fetchPost = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/institutes/${user_id}`);
            setData(response.data.institute);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      };
      fetchPost();
    }, [user_id]);

    
    return (
        <div className={classes.profile}>
            {Object.keys(data).length > 0 ? (
                <>
                    <h1>{data.institute.name}</h1>
                    <h2>{data.institute.institute_type}</h2>
                    {data.institute.description && <p>{data.institute.description}</p>}
                    {data.institute.website_url && <p>{data.institute.website_url}</p>}
                    {data.institute.contact && <p>{data.institute.contact}</p>}
                    <p>{data.institute.city} {data.institute.state} {data.institute.country}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
