import React from "react";
import "./Rightbar.scss"
const Rightbar = ()=>
{
    return(
        <div className="rightbar">
            <div className="container">
                <div className="item">
                    <span>Suggestions For you</span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                            <span>Hamza Tufail</span>
                        </div>
                        <button>Follow</button>
                        <button>dissmiss</button>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                            <span>Johnny bhai</span>
                        </div>
                        <button>Follow</button>
                        <button>dissmiss</button>
                    </div>
                </div>
                <div className="item">
                    <span>Activities</span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                           <p>Changed their cover phote</p>
                        </div>
                        <span>1 min ago</span>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                           <p>Changed their cover phote</p>
                        </div>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="item">
                    <span>Online Friends</span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                          <div className="online" />
                        <span>Dummy</span>
 
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                          <div className="online" />
                        <span>Dummy</span>
 
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                          <div className="online" />
                        <span>Dummy</span>
 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Rightbar;