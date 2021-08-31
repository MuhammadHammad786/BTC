import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

import { url } from '../../utils/utils';

import UpdateModal from '../Modals/FoodViewModal';
import Spinner from '../Modals/SpinnerModal';

const UPLOAD_FILE = gql`
mutation uploadToAws($file: Upload!){
    uploadToAws(file: $file){
    url
  }
}
`;

function MerchantSettings() {
    let merchant;
    const [complete, setComplete] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [update, setUpdate] = useState(false);
    const [resturant, setResturant] = useState({});
    const [name, setName] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [openHour, setOpenHour] = useState('');
    const [closeHour, setCloseHour] = useState('');
    // const [business_hour, setBusinessHour] = useState({});
    const [bank_account, setBankAccount] = useState('');
    const [about, setAbout] = useState('');
    const [email, setEmail] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = e => {
        const file = e.target.files[0];
        uploadToAws({ variables: { file } })
    }
    const [uploadToAws] = useMutation(UPLOAD_FILE, {
        onCompleted: (data) => {
            console.log(data.uploadToAws.url);
            setCoverImage(data.uploadToAws.url);
        }
    });
    const oldPassChangeHandler = (e) => {
        setOldPass(e.target.value);
    }
    const newPassChangeHandler = (e) => {
        setNewPass(e.target.value);
    }
    const passwordChangeHandler = async () => {
        try {
            if (oldPass && newPass) {
                setSpinner(true);
                setMessage('');
                const changePassword = await axios.post(
                    url,
                    {
                        query: `
                        mutation{
                            merchantPasswordChange(
                                merchantId:"${localStorage.merchantId}",
                                oldPassword:"${oldPass}",
                                newPassword:"${newPass}" ){
                                    success
                                    error_message
                                }
                        }
                        `
                    }
                );
                if (changePassword.data.data.merchantPasswordChange.success) {
                    setMessage('Password changed!');
                } else {
                    setMessage(changePassword.data.data.merchantPasswordChange.error_message)
                }
                setOldPass('');
                setNewPass('');
                setSpinner(false);
            }
        } catch (error) {
            throw error;
        }
    }
    const updateShowHandler = () => {
        setUpdate(true);
    }

    const updateCloseHandler = () => {
        setName(resturant.name);
        setAbout(resturant.intro);
        setCoverImage(resturant.cover_image);
        setOpenHour(resturant.business_hour.open);
        setCloseHour(resturant.business_hour.close);
        setBankAccount(resturant.bank_account);
        setUpdate(false);
    }
    const updateHandler = async () => {
        try {
            setSpinner(true);
            setUpdate(false);
            const resturant = await axios.post(
                url,
                {
                    query: `
                    mutation{
                        updateResturant(
                            merchantId:"${localStorage.merchantId}",
                            name:"${name}",
                            openHour:"${openHour}",
                            closeHour:"${closeHour}",
                            intro:"${about}",
                            bank_account:"${bank_account}",
                            coverImage:"${coverImage}"
                        ){
                             _id
                               name
                               intro
                               cover_image
                               business_hour{
                                   open
                                   close
                               }
                               bank_account
                               email
                        }
                    }
                  `
                }
            );
            setName(resturant.data.data.updateResturant.name);
            setEmail(resturant.data.data.updateResturant.email);
            setBankAccount(resturant.data.data.updateResturant.bank_account);
            setOpenHour(resturant.data.data.updateResturant.business_hour.open);
            setCloseHour(resturant.data.data.updateResturant.business_hour.close);
            setAbout(resturant.data.data.updateResturant.intro);
            setCoverImage(resturant.data.data.updateResturant.cover_image);
            setResturant(resturant.data.data.updateResturant);
            setSpinner(false);
        } catch (error) {
            throw error;
        }
    }
    const nameChangeHandler = (e) => {
        setName(e.target.value);
    }
    const bankChangeHandler = (e) => {
        setBankAccount(e.target.value);
    }
    const introChangeHandler = (e) => {
        setAbout(e.target.value);
    }
    const openHourChangeHandler = (e) => {
        setOpenHour(e.target.value);
    }
    const closeHourChangeHandler = (e) => {
        setCloseHour(e.target.value);
    }
    const fetch_resturant = async () => {
        try {
            const resturant = await axios.post(
                url,
                {
                    query: ` 
                       query{
                           resturant(resturantId:"${localStorage.merchantId}"){
                               _id
                               name
                               intro
                               cover_image
                               business_hour{
                                   open
                                   close
                               }
                               bank_account
                               email
                           }
                       }
                    `
                }
            );
            setName(resturant.data.data.resturant.name);
            setEmail(resturant.data.data.resturant.email);
            setBankAccount(resturant.data.data.resturant.bank_account);
            setOpenHour(resturant.data.data.resturant.business_hour.open);
            setCloseHour(resturant.data.data.resturant.business_hour.close);
            setAbout(resturant.data.data.resturant.intro);
            setCoverImage(resturant.data.data.resturant.cover_image);
            setResturant(resturant.data.data.resturant);
            setComplete(true);
            console.log(resturant);
        } catch (error) {
            throw error;
        }
    };
    const timeSetHandler = (time) => {
        const t = parseInt(time.substring(0, 2));
        if (t > 12) {
            return `${(t - 12) + time.substring(2, 5)} pm`;
        } else {
            return `${t + time.substring(2, 5)} am`;
        }
    }
    if (complete) {
        merchant = <div className="merchant-settings">
            <Spinner show={spinner} />
            <UpdateModal show={update} foodViewHandler={updateCloseHandler}>
                <div className="update-resturant-header">
                    <h3>Update</h3>
                    <button onClick={updateCloseHandler}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <div className="update-resturant-body">
                    <div className="update-resturant-content">
                        {coverImage ?
                            <div className="update-resturant-profile">
                                <img src={coverImage} alt="cover image" />
                                <input onChange={handleFileChange} type="file" except=".png, .jpg" />

                            </div> : <div className="update-resturant-profile">
                                <div className="merchant-profile-cover">
                                    <input onChange={handleFileChange} value={coverImage} type="file" except=".png, .jpg" />
                                </div>
                            </div>
                        }
                        <p>Name</p>
                        <input onChange={nameChangeHandler} value={name} type="text" placeholder="Name" />
                        <p>About</p>
                        <textarea onChange={introChangeHandler} value={about} type="text" placeholder="Introduction re Restaurant" />
                        <p>Business hour</p>
                        {/* <span style={{marginBottom:"5px"}}>Open</span>
                                    <input onChange={openHourChangeHandler} value={openHour} type="time" min="09:00" max="18:00"/>
                                    <span style={{marginBottom:"5px"}}>Close</span>
                                    <input onChange={closeHourChangeHandler} value={closeHour} type="time" min="09:00" max="18:00"/> */}
                        <p>Bank account</p>
                        <input onChange={bankChangeHandler} value={bank_account} type="text" placeholder="Bank account" />
                        <button onClick={updateHandler} className="update-resturant-button">Update</button>
                    </div>
                </div>
            </UpdateModal>
            <h2>Profile and settings</h2>
            <div className="merchant-cover">
                {
                    coverImage ?
                        <div className="merchant-cover-show">
                            <img src={coverImage} alt="cover" />
                            <button onClick={updateShowHandler}>Change cover image</button>
                        </div> :
                        <div className="merchant-cover-button">
                            <button onClick={updateShowHandler}><FontAwesomeIcon icon={faPlus} /> Add cover image</button>
                        </div>
                }
            </div>
            <h3>Name</h3>
            <p>{name} <button onClick={updateShowHandler}><FontAwesomeIcon icon={faEdit} /></button></p>
            <h3>Email</h3>
            <p>{email}</p>
            <h3>About</h3>
            <p>{about ? about : <button onClick={updateShowHandler}><FontAwesomeIcon icon={faPlus} /> Add restaurant intro</button>}</p>
            <h3>Business hour</h3>
            <p>Open {timeSetHandler(openHour)} Close {timeSetHandler(closeHour)} <button onClick={updateShowHandler}><FontAwesomeIcon icon={faEdit} /></button></p>
            <h3>Bank Account</h3>
            {bank_account ? <p>{bank_account} <button onClick={updateShowHandler}><FontAwesomeIcon icon={faEdit} /></button></p> : <button>Add bank account</button>}

            <div className="merchant-change-password">
                <h3>Change Password</h3>
                <input onChange={oldPassChangeHandler} value={oldPass} type="password" placeholder="Old password" />
                <input onChange={newPassChangeHandler} value={newPass} type="password" placeholder="New password" />
                <p>{message}</p>
                <button onClick={passwordChangeHandler}>Change Password</button>
            </div>
        </div>
    } else {
        merchant = <p>Loading....</p>
    }

    useEffect(() => {
        fetch_resturant();
    }, []);

    return merchant;
};
export default MerchantSettings;
