import { Children, useContext } from 'react';
import Login from './pages/Login/Login';
import Register from './pages/register/Register';
import Navbar from './components/navbar/navbar';
import Leftbar from './components/Leftbar/Leftbar';
import Profile from './pages/profile/Profile';
import Institute from './pages/Institute/Institute';
import Organization from './pages/Organization/Organization';
import Person from './pages/Person/Person';
import Home from './pages/home/Home'
import Chat from './components/Chat/Chat';
import "./style.scss"
import Rightbar from './components/Rightbar/Rightbar';
import {createBrowserRouter,RouterProvider, Outlet, Navigate} from 'react-router-dom'; 
import { DarkmodeContext } from './context/Darkmodecontext';
import { AuthContext } from './context/AuthContext';
import Jobs from "./pages/Jobs/Jobs"
import Job from "./pages/Job/Job"
import Resume from "./pages/Resume/Resume"
import { QueryClient,QueryClientProvider,useQuery } from 'react-query';
import Setting from "./components/Settings/Settings.jsx"
function App() {
  const {currentUser} = useContext(AuthContext);
  const {darkMode}= useContext(DarkmodeContext);
  const queryClient = new QueryClient();
  const Layout =()=>
  {
    return(
      <QueryClientProvider client={queryClient}>
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

      </QueryClientProvider>
      
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
        },
        {
          path: '/person/:id',
          element: <Person/>
        },
        {
          path: '/organization/:id',
          element: <Organization/>
        },
        {
          path: '/institute/:id',
          element: <Institute/>
        },
        {
          path: '/jobs',
          element: <Jobs/>
        },
        {
          path: 'jobs/:job_id',
          element: <Job/>
        },
        {
          path: '/resume',
          element: <Resume/> 
        },{
          path: '/setting',
          element: <Setting/>,
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
    },
    {
      path: '/Chat',
      element: 
      <QueryClientProvider client={queryClient}>
        <Chat/>
      </QueryClientProvider>
    }
  ]);
  return (
   <>
   <RouterProvider router={router}/>
   </>

  );
}

export default App;
