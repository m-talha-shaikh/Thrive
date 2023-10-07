import { Link } from 'react-router-dom';
import classes from './register.module.css'
import axios from "axios"
import { useState } from 'react';

const Register = () => {
    const [inputs, setInput] = useState({
        username: "",
        email: "",
        password: "",
        city: "",
        state: "",
        country: "",
        account_type: "person",
        ProfilePic: "",
        CoverPic: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "male"
    });

    const handleChange = (e) => {
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleclick = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post("http://localhost:3000/api/v1/Auth/signup", inputs, {
            headers: {
                'Content-Type': 'application/json',
            }});
            console.log(response);
        } catch(error){
          console.log(error)
        }
    }

    return (
        <div className={classes.login}>
            <div className={classes.card}>
                <div className={classes.left}>
                    <h1 className={classes.fadeIn}>Thrive</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, neque?
                    </p>
                    <span>Do you have an account?</span>
                    <div>
                        <Link to='/Login'>
                            <button className={classes.bitto}>Login</button>
                        </Link>
                    </div>
                </div>
                <div className={classes.right}>
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder='Username' onChange={handleChange} name="username" />
                        <input type="email" placeholder='Email' onChange={handleChange} name="email" />
                        <input type="password" placeholder='Password' onChange={handleChange} name="password" />
                        <select onChange={handleChange} name="account_type" value={inputs.account_type}>
                            <option value="person">Person</option>
                            <option value="institute">Institute</option>
                            <option value="organization">Organization</option>
                        </select>
                        <input type="text" placeholder='First Name' onChange={handleChange} name="first_name" />
                        <input type="text" placeholder='Last Name' onChange={handleChange} name="last_name" />
                        <input type="text" placeholder='Date of Birth' onChange={handleChange} name="date_of_birth" />                        
                        <input type="text" placeholder='City' onChange={handleChange} name="city" />
                        <input type="text" placeholder='State' onChange={handleChange} name="state" />
                        <input type="text" placeholder='Country' onChange={handleChange} name="country" />

                        <input type="url" placeholder='Profile Picture URL' onChange={handleChange} name="ProfilePic" />
                        <input type="url" placeholder='Cover Picture URL' onChange={handleChange} name="CoverPic" />

                        <select onChange={handleChange} name="gender" value={inputs.account_type}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <button onClick={handleclick}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;
