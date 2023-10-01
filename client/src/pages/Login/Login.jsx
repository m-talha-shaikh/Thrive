import { useContext } from 'react';
import classes from './Login.module.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
const Login = ()=>
{
    const {Login} = useContext(AuthContext);
    const HandleLogin = ()=>
    {
        Login();
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
                  <input type="text" placeholder='Username' />
                  <input type="password" placeholder='Password' />
                  <button onClick={HandleLogin}>Login</button>
                </form>
            </div>
        </div>
    </div>
    )
}


export default Login;