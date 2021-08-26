import React, { useState, useEffect} from 'react';

import axios from 'axios';
import { url } from '../../utils/utils';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoundSign } from '@fortawesome/free-solid-svg-icons';

import Modal from '../Modals/OtherModal';
import '../../styles/MerchantPortal.scss';

function MerchantHome (){
    const [resturant, setResturant] = useState({});
    const [complete, setComplete] = useState(false);
    const[modal, setModal] = useState(false);
    const [message, setMessage] = useState('')

    const fetchResturant = async(args, req) =>{
        try {
            const resturant = await axios.post(
                 url,
                 {
                     query:`
                        query{
                            resturant(resturantId:"${localStorage.merchantId}"){
                                _id
                                name
                                foods
                                current_balance
                                pending_orders
                                on_board
                                admin_issued
                                banned
                            }
                        }
                     `
                 }
            );
            setResturant(resturant.data.data.resturant);
            if(!resturant.data.data.resturant.admin_issued){
                setModal(true);
                setMessage("Keep calm we will onboard your restaurant as soon as possible.")
            }
            if(resturant.data.data.resturant.banned){
                setModal(true);
                setMessage("Your restaurant is banned. Contact us for details.")
            }
            if(resturant.data.data.resturant.on_board){
                setModal(false);
            }
            setComplete(true);
            console.log(resturant);
        } catch (error) {
            throw error;
        }
    };
    useEffect(()=>{
        fetchResturant()
    },[]);
    let home;
    if(complete){
        home = <div className="merchant-home">
        <Modal show={modal}>
            <p style={{fontWeight:"500"}}>{message}</p>
        </Modal>
        <div className="merchant-home-header">
            <h1>{resturant.name}</h1>
            <p>Manage foods, orders, balance and much more.</p>
        </div>
        <div className="merchant-home-contents">
                <div className="merchant-home-content-1">
                    <h1>{resturant.foods.length}</h1>
                    <p>Foods</p>
                </div> 
                <div className="merchant-home-content-2">
                     <h1>{resturant.pending_orders.length}</h1>
                     <p>Pending Orders</p>
                </div> 
                <div className="merchant-home-content-3">
                    <h1><FontAwesomeIcon icon={faPoundSign}/> {resturant.current_balance}</h1>
                    <p>Current Balance</p>
                </div> 
        </div>
    </div>
    }else{
        home=<div>Loading.....</div>
    }
    return home;
};

export default MerchantHome;