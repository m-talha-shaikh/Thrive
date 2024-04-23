import "./home.scss"
import Posts from "../../components/Posts/Posts";
import React from 'react';
import Share from "../../components/Share/Share";
const home= ()=>
{
   return(
   <div className="home">
       <Share/>
       <Posts/>
   </div>
     
   )
}
export default home;