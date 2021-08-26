import React, { useState, useEffect } from 'react';

import { NavLink, Route, Redirect } from 'react-router-dom';
import '../../styles/UserControl.scss';

import Navigation from '../../components/Navigations/HomeNav';
import Profile from '../../components/User/Profile';
import Orders from '../../components/User/Orders/Orders';

function UserProfile(){
    const [redirect, setRedirect] = useState(null);
    useEffect(()=>{
        if(!localStorage.TOKEN){
            setRedirect(<Redirect to="/"/>)
        }
    }, []);
    return(
        <div className="user-profile">
            {redirect}
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="user-profile-container">
                <div className="user-profile-leftnav">
                  <ul>
                    <li>
                        <NavLink exact activeStyle={{color:"rgb(16, 211, 218)"}} to="/user-profile">Profile</NavLink>
                    </li>
                    <li>
                        <NavLink activeStyle={{color:"rgb(16, 211, 218)"}} to="/user-profile/orders">Orders</NavLink>
                    </li>
                 </ul>
                </div>
                <div className="user-profile-content">
                    <Route path="/user-profile" exact component={Profile}/>
                    <Route path="/user-profile/orders" component={Orders}/>
                </div>
                
            </div>
        </div>
    );
};

export default UserProfile;