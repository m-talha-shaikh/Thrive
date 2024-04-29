// Login.js - Modified

import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { makeRequest } from "../../axios"
import { useEffect } from 'react';
const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  
  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
    setInvalidCredentials(false);
  };
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
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
      alert("Error: " + err.message)
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
      if(await Login(inputs_login)==0)
      {
        throw new Error;
      }
      navigate("/");
    } catch (error) {
      setInvalidCredentials(true);
      setInput_login({ email: "", password: "" });
      setErr(error);
    }
  };
  useEffect(() => {
    setInput_login({ email: "", password: "" });
  }, invalidCredentials);

  const handleCloseInvalidCredentials = () => {
    setInvalidCredentials(false);
    setErr(null);
    emailRef.current.value = '';
    passwordRef.current.value = '';
    setInput_login({ email: "", password: "" });
  };
  return (
    <div className={styles.container}>
    {/* Login Section */}
    <div className={`${styles.loginside} ${showLoginForm ? styles.moveRight : styles.moveLeft}`}>
      <h1>LOGIN</h1>
      {invalidCredentials && (
          <div className={styles.invalidCredentials}>
            <span>Invalid credentials. Please try again.</span>
            <button className={styles.closeButton} onClick={handleCloseInvalidCredentials}>
              &#10005;
            </button>
          </div>
        )}
      <p>How to get started at Thrive?</p>
      <div className={styles.textfield}>
        <img src="../../../public/uploads/email.png" alt="" />
        <input type="Email" placeholder="Email" name='email'  onChange={handleChange}  ref={emailRef}  />
      </div>
      
      <div className={styles.textfield}>
        <img src="../../../public/uploads/pass.png" alt="" />
        <input type="password" placeholder="Password" name='password'  onChange={handleChange} ref={passwordRef}/>
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
      {account_type === 'institute' || account_type === 'organization' ? (
        <div className={styles.textfield}>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            name="name"
          />
        </div>
      ) : (
        <>
          <div className={styles.textfield}>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              name="first_name"
            />
          </div>
          <div className={styles.textfield}>
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              name="last_name"
            />
          </div>
        </>
      )}

      <div className={styles.selectContainer}>
      {account_type === 'person' && <select onChange={(e) => {  setGender(e.target.value);  }} name="gender" value={inputs.gender}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>}
            
      </div>
      {account_type === 'person' && (
        <div className={styles.dateContainer}>
          <input
            type="date"
            placeholder="Date of Birth"
            onChange={(e) => {
              setDateOfBirth(e.target.value);
            }}
            name="date_of_birth"
          />
        </div>
      )}
      <div className={styles.textfield}>
        <img src="../../../public/uploads/pass.png" alt="" />
        <input type="password" placeholder="Password" onChange={(e) => {  setPassword(e.target.value);  }} name="password" />
      </div>

      <button className={styles.btn} onClick={handleClick}>Sign Up</button>
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
