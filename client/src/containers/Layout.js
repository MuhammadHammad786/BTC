import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { connect } from 'react-redux';
import * as actionTypes from '../store/actions/actionTypes';
import { url } from '../utils/utils';

import Spinner from '../components/Modals/SpinnerModal';

import '../styles/Layout.scss';

function Layout(props){
    const [spinner, setSpinner] = useState(true);
    const [userComlete, setUserComplete] = useState(false);
    const [merchnatComplete, setMerchantComplete] = useState(false);
    
    const fetchUser= async() =>{
        if(localStorage.TOKEN){
            const user = await axios.post(
                url,
                {
                    query:`
                       query{
                           user(token:"${localStorage.TOKEN}"){
                               userId
                               success
                           }
                       }
                    `                        
                }
            );
            props.setUser(user.data.data.user.userId);
            setSpinner(false);
        }else{
            setSpinner(false);
        }
        if(localStorage.MERCHANT_TOKEN){
            setSpinner(true);
            const merchant = await axios.post(
                url,
                {
                    query:`
                       query{
                           merchant(token:"${localStorage.MERCHANT_TOKEN}"){
                               resturantId
                               success
                           }
                       }
                    `                        
                }
            );
            localStorage.setItem("merchantId",merchant.data.data.merchant.resturantId);
            props.setUpMerchant(merchant.data.data.merchant.resturantId);
            setSpinner(false);
        }
    };

    useEffect(() => {
            fetchUser();
    }, []);
    
    return(
            <div className="main-layout-content">
                {props.children}
                <Spinner show={spinner}/>
            </div>
    );
};

const mapStateToProps = state =>{
    return{
       userSetup: state.auth.userSetup
    }
 }
 
 const mapDispatchToProps = dispatch => {
    return{
       setUser: (userId) => {
          dispatch ({
             type: actionTypes.AUTH_USER,
             userId
          });
       },
       setUpMerchant: (id) =>{
           dispatch({
               type: actionTypes.AUTH_MERCHANT,
               resturantId: id
           });
       }
    };
 };
 
 export default connect(mapStateToProps, mapDispatchToProps)(Layout);