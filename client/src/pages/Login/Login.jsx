// Login.js - Modified

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { makeRequest } from "../../axios"

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };
  const { Login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Not set');
  const [state, setState] = useState('Not set');
  const [country, setCountry] = useState('Not set');
  const [ProfilePic, setProfilePic] = useState('../../../public/uploads/user100.png');
  const [CoverPic, setCoverPic] = useState('');
  const [first_name, setFirstName] = useState('None');
  const [last_name, setLastName] = useState('None');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [name, setName] = useState('');
  const [website_url, setWebsite] = useState('');
  const [text, setText] = useState('');
  const [institute_type, setInstituteType] = useState('');
  const [industry, setIndustry] = useState('');
  const [account_type, setAccType] = useState('person');
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
      const response = await makeRequest.post('/Auth/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Handle the response as needed
      console.log(response);
      navigate("/");
      // Navigate to the login page after successful signup
      toggleForm()
 

    } catch (err) {
      // Handle errors
      console.error(err.response?.data || err.message);
    }
  };
  
  const [inputs_login, setInput_login] = useState({
    email: "",
    password: "",
  });
  

  const handleAccountTypeChange = (value) => {
    setAccType(value);
    setInputs((prevInputs) => ({ ...prevInputs, account_type: value }));
  };
  
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput_login((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await Login(inputs_login);
      navigate("/");
    } catch (error) {
      setErr(error.response.data);
    }
  };
  

  return (
    <div className={styles.container}>
    {/* Login Section */}
    <div className={`${styles.loginside} ${showLoginForm ? styles.moveRight : styles.moveLeft}`}>
      <h1>LOGIN</h1>
      <p>How to get started at Thrive?</p>
      <div className={styles.textfield}>
        <img src="../../../public/uploads/email.png" alt="" />
        <input type="text" placeholder="Username" name='email' onChange={handleChange} />
      </div>
      
      <div className={styles.textfield}>
        <img src="../../../public/uploads/pass.png" alt="" />
        <input type="password" placeholder="Password" name='password' onChange={handleChange}/>
      </div>

      <button className={styles.btn} onClick={handleLogin}>Login Now</button>
      <p className={styles.text}>
        <b>Login</b> with others or <button id="signup" onClick={toggleForm} className={styles.signup} ><p className={styles.signuptext}>Signup</p></button>
      </p>

      <button className={styles.loginbtn1}>
        <img src="../../../public/uploads/google.png" alt="" />
        <img src="../../../public/uploads/face.png" alt="" />
        
      </button>

    </div>

    {/* Register Section */}
    <div className={`${styles.registerside} ${!showLoginForm ? styles.moveLeft : styles.moveRight}`}>
      <h1>REGISTER</h1>
      <p>Enter Your Details !</p>
      <div className={styles.textfield}>
        <img src="../../../public/uploads/email.png" alt="" />
        <input type="text" placeholder="Email"  onChange={(e) => {  setEmail(e.target.value);  }} name="email" />
      </div>
      <div className={styles.textfield}>
        <img src="../../../public/uploads/user.png" alt="" />
        <input type="text" placeholder="Username" onChange={(e) => {  setUsername(e.target.value);  }} name="username" />
      </div>
       <div className={styles.selectContainer}>
      <select onChange={(e) => handleAccountTypeChange(e.target.value)} name="account_type" value={account_type}>
              <option value="person">Person</option>
              <option value="institute">Institute</option>
              <option value="organization">Organization</option>
            </select>
            
      </div>
      <div className={styles.selectContainer}>
      {account_type === 'person' && <select onChange={(e) => {  setGender(e.target.value);  }} name="gender" value={inputs.gender}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>}
            
      </div>
      <div className={styles.dateContainer}>
    {/* Updated date input */}
    <input type="date" placeholder="Date of Birth" onChange={(e) => { setDateOfBirth(e.target.value); }} name="date_of_birth" />
  </div>
      <div className={styles.textfield}>
        <img src="../../../public/uploads/pass.png" alt="" />
        <input type="password" placeholder="Password" onChange={(e) => {  setPassword(e.target.value);  }} name="password" />
      </div>

      <button className={styles.btn} onClick={handleClick}>Sign in</button>
      <button className={styles.reg} onClick={toggleForm}><p className={styles.signuptext}>back to login page</p></button>
    </div>
    {/* Image Section */}
   <div className={styles.imgsection}>
  <div className={styles.card}>
    <h1>Come thrive with us!!!</h1>
    <div className={styles.imageContainer}>
      {/* Conditionally render images based on showLoginForm state */}
      <img
        src={showLoginForm ? "../../../public/uploads/women.png" : "../../../public/uploads/man.png"}
        alt="Thrive"
        className={`${styles.image} ${showLoginForm ? '' : styles.hidden}`}
      />
      <img
        src={showLoginForm ? "../../../public/uploads/man.png" : "../../../public/uploads/man.png"}
        alt="Thrive"
        className={`${styles.image} ${!showLoginForm ? '' : styles.hidden}`}
      />
    </div>
  </div>
</div>
  </div>
  );
};

export default Login;
