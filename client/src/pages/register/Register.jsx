import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [ProfilePic, setProfilePic] = useState('');
  const [CoverPic, setCoverPic] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [name, setName] = useState('');
  const [website_url, setWebsite] = useState('');
  const [text, setText] = useState('');
  const [institute_type, setInstituteType] = useState('');
  const [industry, setIndustry] = useState('');
  const [account_type, setAccType] = useState('person');

const handleAccountTypeChange = (value) => {
    setAccType(value);
    setInputs((prevInputs) => ({ ...prevInputs, account_type: value }));
  };


const [inputs, setInputs] = useState({
  username: username,
  email: email,
  password: password,
  city: city,
  state: state,
  country: country,
  account_type: account_type,
  ProfilePic: ProfilePic,
  CoverPic: CoverPic,
  first_name: first_name,
  last_name: last_name,
  date_of_birth: date_of_birth,
  gender: gender,
  name: name,
  website_url: website_url,
  text_description: text,
  institute_type: institute_type,
  industry: industry,
})


const handleClick = async (e) => {
  e.preventDefault();
  try {
    const userData = {
      username,
      email,
      password,
      city,
      state,
      country,
      ProfilePic,
      CoverPic,
      first_name,
      last_name,
      date_of_birth,
      gender,
      name,
      website_url,
      text,
      institute_type,
      industry,
      account_type,
    };

    console.log(userData);
    const response = await axios.post('http://localhost:3000/api/v1/Auth/signup', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the response as needed
    console.log(response);

    // Navigate to the login page after successful signup
    navigate('/login');
  } catch (err) {
    // Handle errors
    console.error(err.response?.data || err.message);
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
            <input type="text" placeholder="Username" onChange={(e) => {  setUsername(e.target.value);  }} name="username" />
            <input type="email" placeholder="Email" onChange={(e) => {  setEmail(e.target.value);  }} name="email" />
            <input type="password" placeholder="Password" onChange={(e) => {  setPassword(e.target.value);  }} name="password" />
            <select onChange={(e) => handleAccountTypeChange(e.target.value)} name="account_type" value={account_type}>
              <option value="person">Person</option>
              <option value="institute">Institute</option>
              <option value="organization">Organization</option>
            </select>

            {account_type === 'person' && <input type="text" placeholder="First Name" onChange={(e) => {  setFirstName(e.target.value);  }} name="first_name" />}
            {account_type === 'person' && <input type="text" placeholder="Last Name" onChange={(e) => {  setLastName(e.target.value);  }} name="last_name" />}
            {account_type === 'person' && <input type="date" placeholder="Date of Birth" onChange={(e) => {  setDateOfBirth(e.target.value);  }} name="date_of_birth" />}
            {(account_type === 'institute' || account_type === 'organization')
            && <input type="text" placeholder="Name" onChange={(e) => {  setName(e.target.value);  }} name="name" />}
            {(account_type === 'institute' || account_type === 'organization') 
            && <input type="text" placeholder="Website URL" onChange={(e) => {  setWebsite(e.target.value);  }} name="website_url" />}
            {(account_type === 'institute' || account_type === 'organization') 
            && <input type="text" placeholder="Text Description" onChange={(e) => {  setText(e.target.value);  }} name="text_description" />}
            {(account_type === 'institute') 
            && <input type="text" placeholder="Institute Type" onChange={(e) => {  setInstituteType(e.target.value);  }} name="institute_type" />}
            {(account_type === 'organization') 
            && <input type="text" placeholder="Industry" onChange={(e) => {  setIndustry(e.target.value);  }} name="industry" />}
            <input type="text" placeholder="City" onChange={(e) => {  setCity(e.target.value);  }} name="city" />
            <input type="text" placeholder="State" onChange={(e) => {  setState(e.target.value);  }} name="state" />
            <input type="text" placeholder="Country" onChange={(e) => {  setCountry(e.target.value);  }} name="country" />
            <input type="url" placeholder="Profile Picture URL" onChange={(e) => {  setProfilePic(e.target.value);  }} name="ProfilePic" />
            <input type="url" placeholder="Cover Picture URL" onChange={(e) => {  setCoverPic(e.target.value);  }} name="CoverPic" />
            {account_type === 'person' && <select onChange={(e) => {  setGender(e.target.value);  }} name="gender" value={inputs.gender}>

              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
