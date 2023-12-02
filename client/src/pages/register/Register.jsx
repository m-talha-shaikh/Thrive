import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [accType, setAccType] = useState('person');

  const [inputs, setInputs] = useState({
  username: '',
  email: '',
  password: '',
  city: '',
  state: '',
  country: '',
  account_type: 'person',
  ProfilePic: '',
  CoverPic: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: 'male',
  name: '',
  website_url: '',
  text_description: '',
  institute_type: '',
  industry: '',
});


  const handleChange = (e) => {
    const selectedValue = event.target.value;
    setAccType(selectedValue);
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleclick = async (e) => {
    e.preventDefault();
    try {
      console.log(inputs);
      const response = await axios.post('http://localhost:3000/api/v1/Auth/signup', inputs, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response);
      navigate('/login');
    } catch (err) {
      // console.log(err.response.data);
    }
  };

  return (
    <div className={classes.login}>
      <div className={classes.card}>
        <div className={classes.left}>
          <h1 className={classes.fadeIn}>Thrive</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, neque?</p>
          <span>Do you have an account?</span>
          <div>
            <Link to="/login">
              <button className={classes.bitto}>Login</button>
            </Link>
          </div>
        </div>
        <div className={classes.right}>
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" onChange={handleChange} name="username" />
            <input type="email" placeholder="Email" onChange={handleChange} name="email" />
            <input type="password" placeholder="Password" onChange={handleChange} name="password" />
            <select onChange={handleChange} name="account_type" value={inputs.account_type}>
              <option value="person">Person</option>
              <option value="institute">Institute</option>
              <option value="organization">Organization</option>
            </select>
            {accType === 'person' && <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" />}
            {accType === 'person' && <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" />}
            {accType === 'person' && <input type="date" placeholder="Date of Birth" onChange={handleChange} name="date_of_birth" />}
            {(accType === 'institute' || accType === 'organization') 
            && <input type="text" placeholder="Name" onChange={handleChange} name="name" />}
            {(accType === 'institute' || accType === 'organization') 
            && <input type="text" placeholder="Website URL" onChange={handleChange} name="website_url" />}
            {(accType === 'institute' || accType === 'organization') 
            && <input type="text" placeholder="Text Description" onChange={handleChange} name="text_description" />}
            {(accType === 'institute') 
            && <input type="text" placeholder="Institute Type" onChange={handleChange} name="institute_type" />}
            {(accType === 'organization') 
            && <input type="text" placeholder="Industry" onChange={handleChange} name="industry" />}
            <input type="text" placeholder="City" onChange={handleChange} name="city" />
            <input type="text" placeholder="State" onChange={handleChange} name="state" />
            <input type="text" placeholder="Country" onChange={handleChange} name="country" />
            <input type="url" placeholder="Profile Picture URL" onChange={handleChange} name="ProfilePic" />
            <input type="url" placeholder="Cover Picture URL" onChange={handleChange} name="CoverPic" />
            {accType === 'person' && <select onChange={handleChange} name="gender" value={inputs.gender}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>}
            <button onClick={handleclick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
