import { Children, useContext } from 'react';
import Login from './pages/Login/Login';
import Register from './pages/register/register';
import Navbar from './components/navbar/navbar';
import Leftbar from './components/Leftbar/Leftbar';
import Profile from './pages/profile/Profile';
import Home from './pages/home/Home'
import "./style.scss"
import Rightbar from './components/Rightbar/Rightbar';
import {createBrowserRouter,RouterProvider, Outlet, Navigate} from 'react-router-dom'; 
import { DarkmodeContext } from './context/Darkmodecontext';
import { AuthContext } from './context/AuthContext';
function App() {
  const {currentUser} = useContext(AuthContext);
  const {darkMode}= useContext(DarkmodeContext);
  const Layout =()=>
  {
    return(
      <div className={`theme-${darkMode ? "dark" :"light" }`}>
      <Navbar/>
      <div style={{display:'flex'}}>
        <Leftbar/>
        <div style={{flex:6}}>
        <Outlet/>

        </div>
        <Rightbar/>
      </div>
      </div>
    )
  }
  const ProtectedRoute= ({children})=>
  {
    if (!currentUser) {
      return <Navigate to='/login'/>
    }
    return children;
  }
  const router = createBrowserRouter([
    {
      path: '/',
      element:
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute> ,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: '/profile/:id',
          element: <Profile/>
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);
  return (
   <>
   <RouterProvider router={router}/>
   </>

  );
}

export default App;
