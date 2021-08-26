import React, {useState} from 'react';

import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { url } from '../../utils/utils';

import Spinner from '../../components/Modals/SpinnerModal';
import '../../styles/UserControl.scss';
import Navigation from '../../components/Navigations/HomeNav';

function ForgotPassword(){
    let content;
    const [email,setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [number, setNumber] = useState(null);
    const [redirect, setRedirect] = useState(null);

    const  emailChangeHandler = (e)=>{
        setEmail(e.target.value);
    }
    const  numberChangeHandler = (e)=>{
        setNumber(e.target.value);
    }
    const authHandler = async()=>{
        try {
            if(email){
                setMessage('');
                setSpinner(true);
                const user = await axios.post(
                    url,
                    {
                      query:`
                         mutation{
                             forgotPassword(email:"${email}"){
                                  success
                                  email
                                  error_message
                             }
                         }
                      `
                    }
                );
                if(user.data.data.forgotPassword.success){
                    localStorage.setItem('resetEmail',user.data.data.forgotPassword.email);
                }else{
                    setMessage(user.data.data.forgotPassword.error_message);
                }
                setSpinner(false);
            }
        } catch (error) {
            throw error;
        }
    };
    const processCancelHandler = ()=>{
        localStorage.removeItem('resetEmail');
    }
    const resetCodeCheckHandler = async()=>{
        try{
            if(number){
                setSpinner(true);
                setAuthMessage('');
                const check = await axios.post(
                    url,
                    {
                        query:`
                           mutation{
                            authorizeResetPassword(email:"${localStorage.resetEmail}", resetCode:${number}){
                                success
                                error_message
                            }
                           }
                        `
                    }
                );
                if(check.data.data.authorizeResetPassword.success){
                    setRedirect(<Redirect to="/user/reset-password"/>)
                }else{
                    setAuthMessage(check.data.data.authorizeResetPassword.error_message)
                }
                setSpinner(false);
                console.log(check);
            }
        }catch(error){
            throw error;
        }
    }
    if(localStorage.resetEmail){
        content =  <div className="forgot-password-container">
                    <h3>Enter code</h3>
                    <p>6 digit code send to your email address. </p>
                    <input type="number" placeholder="Enter code" value={number} onChange={numberChangeHandler} />
                    <p>{authMessage}</p>
                    <button onClick={resetCodeCheckHandler}>Authorize</button>
                    <Link onClick={processCancelHandler} to="/user/signin">Cancel</Link>
                </div>
    }else{
      content = <div className="forgot-password-container">
                    <h3>Find Your Account</h3>
                    <p>Please enter your email address to search for your account</p>
                    <input type="email" placeholder="Email" value={email} onChange={emailChangeHandler} />
                    <p>{message}</p>
                    <button onClick={authHandler}>Send</button>
                    <Link to="/user/signin">Cancel</Link>
                </div>
    }
    return(
        <div className="forgot-password">
            {redirect}
            <Spinner show={spinner}/>
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="user-control-section">
              {content}
            </div>
        </div>
    );
};

export default ForgotPassword;