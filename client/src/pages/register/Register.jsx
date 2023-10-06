import { Link } from 'react-router-dom';
import classes from './register.module.css'
import axios from "axios"
import { useState } from 'react';
const Register= ()=>{
     const [inputs,setInput] = useState({
         username:"",
         email:"",
         password:"",
         name:""
     });
     
     const [err,SetErr]= useState(null);
    const handleChange =  (e)=>
    {
      setInput(prev=>(
        {...prev,[e.target.name]:e.target.value}));
    }
    const handleclick = async (e)=>{
        e.preventDefault();
        try {
          console.log(inputs);
          await axios.post("http://localhost:3000/api/v1/Auth/signup",inputs);
        
        } catch (err ){
        }
          SetErr(err.response.data);
        } 
      
      return(
        <div className={classes.login}>
        <div className={classes.card}>
            <div className={classes.left}>
                 <h1 className={classes.fadeIn}>Thrive</h1>
                 <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, neque?
                 </p>
                 <span>Do you have an acount?</span>
                 <div>
                  <Link to='/Login'>
                 <button className={classes.bitto}>Login</button>
                  </Link>
                 </div>
            </div>
            <div className={classes.right}>
                <h1>Register</h1>
                <form >
                  <input type="text" placeholder='Username' onChange={handleChange} name="username" />
                  <input type="password" placeholder='Password' onChange={handleChange} name="password" />
                  <input type="email" placeholder='Email' onChange={handleChange} name="email"/>
                  <input type="text" placeholder='Name'  onChange={handleChange} name="name"/>
                  {err && <p>{err.response.data}</p>}

                  <button onClick={handleclick}>Register</button>
                </form>
            </div>
        </div>
    </div>
      )
}
export default Register;