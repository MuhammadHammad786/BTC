import React, { useState } from 'react';
import { NavLink, Route, Link } from 'react-router-dom';

import { url } from '../../utils/utils';
import axios from 'axios';

import '../../styles/Admin.scss';
import PendingResturants from '../../components/Admin/PendingResturants/PendingResturants';
import ActiveResturants from '../../components/Admin/ActiveResturants/ActiveResturants';
import BannedResturants from '../../components/Admin/BannedResturants/BannedResturants';
import ActiveUsers from '../../components/Admin/ActiveUsers/ActiveUsers';
import BlockUsers from '../../components/Admin/BlockUsers/BlockUsers';
import LogInModal from '../../components/Modals/LogInModal';

import Logo from '../../assets/logofinal.png';


function Admin(){
    const [login, setLogIn] = useState(false);
    const [secretKey, setSecretkey] = useState('');
    const [message, setMessage] = useState('');

    const secretChangeHandler = (e)=>{
        setSecretkey(e.target.value);
    }

    const adminLoginHandler = async()=>{
       try {
        if(secretKey){
            setMessage('');
            const admin = await axios.post(
                url,
                {
                   query:`
                     query{
                         adminLogin(secretKey:"${secretKey}"){
                             success
                             error_message
                         }
                     }
                   ` 
                }
            );
            if(admin.data.data.adminLogin.success){
                setLogIn(true);
            }else{
                setMessage(admin.data.data.adminLogin.error_message);
            }
        }
       } catch (error) {
           throw error;
       }
    };

    const logOutHandler = ()=>{
        setLogIn(false);
    }
    return(
        <div className="admin-main">
            <LogInModal show={login}>
               <div className="admin-login">
                <h3>Enter secret key</h3>
                <input value={secretKey} onChange={secretChangeHandler} type="password" placeholder="Secret key"/>
                <p style={{color:"red"}}>{message}</p>
                <button onClick={adminLoginHandler}>GO</button>
               </div>
            </LogInModal>
             <div className="admin-nav-bar">
              <div className="admin-nav-main">
                <div className="admin-logo-container">
                    <Link to="/">
                        <img src={Logo} alt="BookTheChefs"/>
                        <h3>BookTheChefs</h3>
                    </Link>
                </div>
                <button onClick={logOutHandler}>Log out</button>
             </div>
             </div>
            <div className="admin-canvas">
                <div className="admin-leftnav">
                    <ul>
                        <li>
                            <NavLink activeStyle={{color:"rgb(16, 211, 218)"}} exact to="/admin">Restaurant Request</NavLink>
                        </li>
                        <li>
                            <NavLink activeStyle={{color:"rgb(16, 211, 218)"}} exact to="/admin/active-restaurants">Active Restaurants</NavLink>
                        </li>
                        <li>
                            <NavLink activeStyle={{color:"rgb(16, 211, 218)"}} exact to="/admin/banned-restaurants">Banned Restaurants</NavLink>
                        </li>
                        <li>
                            <NavLink activeStyle={{color:"rgb(16, 211, 218)"}} exact to="/admin/users">Users</NavLink>
                        </li>
                        <li>
                            <NavLink activeStyle={{color:"rgb(16, 211, 218)"}} exact to="/admin/banned-users">Blocked Users</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="admin-maincontent">
                    <Route path="/admin" exact component={PendingResturants}/>
                    <Route path="/admin/active-restaurants" exact component={ActiveResturants}/>
                    <Route path="/admin/banned-restaurants" exact component={BannedResturants}/>
                    <Route path="/admin/users" exact component={ActiveUsers}/>
                    <Route path="/admin/banned-users" exact component={BlockUsers}/>
                </div>
            </div>
        </div>
    );
};

export default Admin;