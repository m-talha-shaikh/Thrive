import { Link } from 'react-router-dom';
import classes from './register.module.css'
const Register= ()=>{
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
                  <input type="text" placeholder='Username' />
                  <input type="password" placeholder='Password' />
                  <input type="email" placeholder='Email' />
                  <input type="text" placeholder='Name' />

                  <button>Register</button>
                </form>
            </div>
        </div>
    </div>
      )
}
export default Register;