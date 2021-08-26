import React, { useState } from 'react';

import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { url } from '../../utils/utils';

import Spinner from '../../components/Modals/SpinnerModal';
import '../../styles/UserControl.scss';
import Navigation from '../../components/Navigations/HomeNav';

function ResetPassword(){
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setretypePassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(null);
    const [spinner, setSpinner] = useState(false);

    const newPasswordChangeHandler = (e)=>{
        setNewPassword(e.target.value);
    }

    const retypePasswordChangeHandler = (e)=>{
        setretypePassword(e.target.value)
    }

    const resetPasswordHandler = async() =>{
        try {
            if(newPassword && retypePassword){
                if(newPassword === retypePassword){
                    setSpinner(true);
                    const resetPass = await axios.post(
                        url,
                        {
                            query:`
                              mutation{
                                merchantResetPassword(email:"${localStorage.resetMerchantEmail}", newPassword:"${newPassword}"){
                                    success
                                }
                              }
                            `
                        }
                    );
                    if(resetPass.data.data.merchantResetPassword.success){
                        localStorage.removeItem('resetMerchantEmail');
                        setRedirect(<Redirect to="/merchant-portal"/>)
                    }
                    
                }else{
                    setMessage('Password doesn\'t match');
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
    return(
        <div className="forgot-password">
            <Spinner show={spinner}/>
            {redirect}
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="user-control-section">
                <div className="forgot-password-container">
                    <h3>Reset Password</h3>
                    <input type="password" placeholder="New password" value={newPassword} onChange={newPasswordChangeHandler} />
                    <input type="password" placeholder="Re-type password" value={retypePassword} onChange={retypePasswordChangeHandler} />
                    <p>{message}</p>
                    <button onClick={resetPasswordHandler}>Reset password</button>
                    <Link onClick={processCancelHandler} to="/merchant-portal">Cancel</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;