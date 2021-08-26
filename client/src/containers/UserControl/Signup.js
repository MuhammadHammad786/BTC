import React, { useState, useEffect} from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/utils';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import Logo from '../../assets/logofinal.png';
import Spinner from '../../components/Modals/SpinnerModal';
import Navigation from '../../components/Navigations/HomeNav';

import '../../styles/UserControl.scss';

function SignUp(props){
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [phone, setPhone] = useState('');
     const [error_message, setErrorMessage] = useState('');
     const [redirect, setRedirect] = useState(null);
     const [spinner, setSpinner] = useState(false);


     const emailChangehandler = (e) =>{
         setEmail(e.target.value);
     }
     const passwordChangeHandler = (e) =>{
         setPassword(e.target.value);
     }
     const signUpHandler = async()=>{
        try {
            if(email && password && phone && firstName && lastName){
              setSpinner(true);
              setErrorMessage('');
              const user = await axios.post(
                  url,
                  {
                      query:`
                         mutation{
                             signUp(email:"${email}",password:"${password}", firstName:"${firstName}",lastName:"${lastName}",phone:"${phone}"){
                                 token
                                 userId
                                 error_message
                                 success
                             }
                         }
                      `
                  }

              );

              console.log(user);

              setSpinner(false);
              if(user.data.data.signUp.success){
                  localStorage.setItem('TOKEN', user.data.data.signUp.token);
                  props.signIn(user.data.data.signUp.userId);
                  if(props.redirect_url){
                      setRedirect(<Redirect to={props.redirect_url}/>)
                  }else{
                    setRedirect(<Redirect to="/"/>);
                  }  
              }else{
                  setErrorMessage(user.data.data.signUp.error_message);
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
    },[]);

    return(
        <div className="user-control">
            {redirect}
            <Spinner show={spinner}/>
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="user-control-section">
            <div className="user-control-container">
                <Link to="/">
                  <img src={Logo} alt="bookthechefs"/>
                </Link>
                <h3>Create account</h3>
                <input onChange={(e)=>{setFirstName(e.target.value)}} value={firstName} type="text" placeholder="First Name"/>
                <input onChange={(e)=>{setLastName(e.target.value)}} value={lastName} type="text" placeholder="Last Name"/>
                <input onChange={(e)=>{setPhone(e.target.value)}} value={phone} type="text" placeholder="Phone"/>
                <input onChange={emailChangehandler} value={email} type="email" placeholder="Email"/>
                <input onChange={passwordChangeHandler} value={password} type="password" placeholder="Password"/>
                <p className="error_message">{error_message}</p>
                <button onClick={signUpHandler}>Create account</button>
                <p>Already have an Account ? <span><Link to="/user/signin">Sign in</Link></span></p>
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(SignUp);