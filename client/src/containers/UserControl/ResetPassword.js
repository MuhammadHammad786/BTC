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
                                resetPassword(email:"${localStorage.resetEmail}", newPassword:"${newPassword}"){
                                    success
                                }
                              }
                            `
                        }
                    );
                    if(resetPass.data.data.resetPassword.success){
                        localStorage.removeItem('resetEmail');
                        setRedirect(<Redirect to="/user/signin"/>)
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
        localStorage.removeItem('resetEmail');
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
                    <Link onClick={processCancelHandler} to="/user/signin">Cancel</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;