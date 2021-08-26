import React, {useState} from 'react';

import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { url } from '../../utils/utils';

import Spinner from '../../components/Modals/SpinnerModal';
import '../../styles/UserControl.scss';

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
                const merchant = await axios.post(
                    url,
                    {
                      query:`
                         mutation{
                            merchantForgotPassword(email:"${email}"){
                                  success
                                  email
                                  error_message
                             }
                         }
                      `
                    }
                );
                if(merchant.data.data.merchantForgotPassword.success){
                    localStorage.setItem('resetMerchantEmail',merchant.data.data.merchantForgotPassword.email);
                }else{
                    setMessage(merchant.data.data.merchantForgotPassword.error_message);
                }
                setSpinner(false);
            }
        } catch (error) {
            throw error;
        }
    };
    const processCancelHandler = ()=>{
        localStorage.removeItem('resetMerchantEmail');
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
                            authorizeMerchantResetPassword(email:"${localStorage.resetMerchantEmail}", resetCode:${number}){
                                success
                                error_message
                            }
                           }
                        `
                    }
                );
                if(check.data.data.authorizeMerchantResetPassword.success){
                    setRedirect(<Redirect to="/merchant/reset-password"/>)
                }else{
                    setAuthMessage(check.data.data.authorizeMerchantResetPassword.error_message)
                }
                setSpinner(false);
                console.log(check);
            }
        }catch(error){
            throw error;
        }
    }
    if(localStorage.resetMerchantEmail){
        content =  <div className="forgot-password-container">
                    <h3>Enter code</h3>
                    <p>6 digit code send to your email address. </p>
                    <input type="number" placeholder="Enter code" value={number} onChange={numberChangeHandler} />
                    <p>{authMessage}</p>
                    <button onClick={resetCodeCheckHandler}>Authorize</button>
                    <Link onClick={processCancelHandler} to="/merchant-portal">Cancel</Link>
                </div>
    }else{
      content = <div className="forgot-password-container">
                    <h3>Find Your Account</h3>
                    <p>Please enter your email address to search for your account</p>
                    <input type="email" placeholder="Email" value={email} onChange={emailChangeHandler} />
                    <p>{message}</p>
                    <button onClick={authHandler}>Send</button>
                    <Link to="/merchant-portal">Cancel</Link>
                </div>
    }
    return(
        <div className="forgot-password">
            {redirect}
            <Spinner show={spinner}/>
            <div className="user-control-section">
              {content}
            </div>
        </div>
    );
};

export default ForgotPassword;