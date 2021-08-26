import React, { useState, useEffect } from 'react';

import { Link , Redirect} from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import Logo from '../../assets/logofinal.png';
import { url } from '../../utils/utils';
import '../../styles/UserControl.scss';
import Spinner from '../../components/Modals/SpinnerModal';
import Navigation from '../../components/Navigations/HomeNav';

function SignIn(props){

     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error_message, setErrorMessage] = useState('');
     const [redirect, setRedirect] = useState(null);
     const [spinner, setSpinner] = useState(false);

     const emailChangehandler = (e) =>{
         setEmail(e.target.value);
     }
     const passwordChangeHandler = (e) =>{
         setPassword(e.target.value);
     }

    const signInHandler = async()=>{
          try {
              if(email && password){
                 setSpinner(true);
                const user = await axios.post(
                    url,
                    {
                        query:`
                           query{
                               signIn(email:"${email}", password:"${password}"){
                                   token
                                   userId
                                   error_message
                                   success
                               }
                           }
                        `
                    }
  
                );
                setSpinner(false);
                if(user.data.data.signIn.success){
                    localStorage.setItem('TOKEN', user.data.data.signIn.token);
                    props.signIn(user.data.data.signIn.userId);
                    if(props.redirect_url){
                        setRedirect(<Redirect to={props.redirect_url}/>)
                    }else{
                      setRedirect(<Redirect to="/"/>);
                    }  
                }else{
                    setErrorMessage(user.data.data.signIn.error_message);
                }
              }
              
             

          } catch (error) {
              throw error;
          }
    };

    useEffect(()=>{
        if(localStorage.TOKEN){
            setRedirect(<Redirect to="/"/>)
        }
    },[])
    return(
        <div className="user-control">
             {redirect}
            <Spinner show={spinner}/>
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="user-control-section" >
            <div className="user-control-container">
                <img src={Logo} alt="bookthechefs"/>
                <h3>Sign in</h3>
                <input onChange={emailChangehandler} value={email} type="email" placeholder="Email"/>
                <input onChange={passwordChangeHandler} value={password} type="password" placeholder="Password"/>
                <p>{error_message}</p>
                <button onClick={signInHandler}>Sign in</button>
                <p><Link  to="/user/forgot-password">Forgotten password ?</Link></p>
                <p>Haven’t got an account?  <span><Link  to="/user/signup">Sign up</Link></span></p>
            </div>
            </div>
        </div>
    );
};
const mapStateToProps = state =>{
    return{
        redirect_url: state.auth.redirect_url
    }
 }
 
 const mapDispatchToProps = dispatch => {
    return{
       signIn: (userId) => {
          dispatch ({
             type: actionTypes.AUTH_USER,
             userId
          });
       }
    };
 };
 
 export default connect(mapStateToProps, mapDispatchToProps)(SignIn);