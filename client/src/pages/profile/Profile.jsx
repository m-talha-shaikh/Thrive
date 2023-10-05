import "./Profile.scss";
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const certificationItems = [
    {
      name: "Certified Web Developer",
      organization: "WebDev Institute",
      date: "June 2022",
    },
    {
      name: "JavaScript Developer Certification",
      organization: "TechCertify",
      date: "May 2022",
    },
    {
      name: "React.js Fundamentals",
      organization: "React Academy",
      date: "April 2022",
    },
  ];
  const educationItems = [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of XYZ",
      year: "2018-2022",
    },
    {
      degree: "Master of Business Administration",
      school: "Business School ABC",
      year: "2022-2024",
    },
    {
      degree: "Associate Degree in Engineering",
      school: "Community College DEF",
      year: "2016-2018",
    },
  ];
  
const Profile = ()=>
{ const {currentUser}=useContext(AuthContext) ;
    return (
       <div className="profile">
        <div className="images">
        <img src="https://res.cloudinary.com/dzhkmbnbn/image/upload/v1696183975/yousuf_mosgs4.jpg" alt="" className="cover"/>
        <img src="https://res.cloudinary.com/dzhkmbnbn/image/upload/v1696183974/arham_c4mnx8.jpg" alt=""  className="profilePic"/>
        </div>
        <div className="profilecontainer">
       
            <div className="userinfo">
             <div className="center">
                <span>{currentUser.name}</span>
                <div className="info">
                    <div className="item">
                        <PlaceIcon/>
                        <span>Pakistan</span>
                    </div>
                    <div className="item">
                        <LanguageIcon/>
                        <span>Urdu</span>
                    </div>
                    <button>Add Friend</button>
                </div>
             </div>
            </div>
        </div>
         <div className="education">
         <div className="heading">

<h2>Eduaction</h2>
</div>
         {educationItems.map((item, index) => (
    <div key={index} className="education-item">
      <h3>{item.degree}</h3>
      <p>{item.school}</p>
      <p>{item.year}</p>
    </div>
  ))}
         </div>
         <div className="education">
            <div className="heading">

            <h2>Certifications</h2>
            </div>
         {certificationItems.map((item, index) => (
    <div key={index} className="certification-item">
      <h3>{item.name}</h3>
      <p>{item.organization}</p>
      <p>{item.date}</p>
    </div>
  ))}

         </div>
       </div>
       
    )
}

export default Profile;
