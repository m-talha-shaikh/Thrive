import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import classes from './Login.module.css'

const Login = ()=>
{
    const {Login} = useContext(AuthContext);
    const [inputs,setInput] = useState({
        email:"",
        password:"",
    });
    
    const [err,SetErr]= useState(null);
    const navigate = useNavigate();
   const handleChange =  (e)=>
   {
     setInput(prev=>(
       {...prev,[e.target.name]:e.target.value}));
   }
    const HandleLogin = async (e)=>
    {
        e.preventDefault();
        try {
            
            await Login(inputs); 
            navigate("/");
        } catch (err) {
           
            SetErr(err.response.data);
        }
    };
    return (
        <div className={classes.login}>
        <div className={classes.card}>
            <div className={classes.left}>
                 <h1 className={classes.fadeIn}>Thrive</h1>
                 <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, neque?
                 </p>
                 <span>Don't you have an acount?</span>
                 <div>
                    <Link to="/register">
                 <button className={classes.bitto}>Register</button>
                    </Link>
                 </div>
            </div>
            <div className={classes.right}>
                <h1>Login</h1>
                <form >
                  <input type="text" placeholder='Email' name="email" onChange={handleChange} />
                  <input type="password" placeholder='Password' name='password' onChange={handleChange} />
                  <button onClick={HandleLogin}>Login</button>
                </form>
            </div>
        </div>
      </div>

  );
};

export default Login;
