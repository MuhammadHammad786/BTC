import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPoundSign, faTimes } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

import Restaurant from './ActiveResturant';
import { url } from '../../../utils/utils';
import ViewModal from '../../Modals/FoodViewModal';
import Spinner from '../../Modals/SpinnerModal';
import BannedModal from '../../Modals/DeleteFoodModal';
import resturant from '../../SearchResturant';

function ActiveResturants(){
    const [resturants, setResturants] = useState([]);
    const [complete, setComplete] = useState(false);
    const [viewResturant, setViewResturant] = useState({});
    const [modal, setModal] = useState(false);
    const [balance, setBalace] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [payAmount, setPayAmount] = useState(0);
    const [invoice, setInvoice] = useState({});
    const [bannedModal, setBannedModal] = useState(false);

    const viewResturantHandler = async(id)=>{
        setSpinner(true);
        const view_resturant = await axios.post(
            url,
            {
                query:`
                   query{
                       resturant(resturantId:"${id}"){
                           _id
                           name
                           post_code
                           email
                           contact_number
                           banned
                           current_balance
                           bank_account
                           last_invoice{
                               date
                               amount
                           }
                       }
                   }
                `
            }
        );

        setViewResturant(view_resturant.data.data.resturant);
        setBalace(view_resturant.data.data.resturant.current_balance);
        setInvoice(view_resturant.data.data.resturant.last_invoice);

        setSpinner(false);
        setModal(true);
      }
      const balanceChangeHandler = (e)=>{
          setPayAmount(e.target.value);
      }
      const bannedCloseModal = () =>{
          setBannedModal(false);
      }
      const bannedOpenModal = () =>{
          setBannedModal(true);
          setModal(false);
      }
      const bannedResturant = async()=>{
          setSpinner(true);
          setBannedModal(false);
          console.log(viewResturant._id);
          await axios.post(
              url,
              {
                  query:`
                     mutation{
                        bannedResturant(resturantId:"${viewResturant._id}"){
                             _id
                         }
                     }
                  `
              }
          );
          const allResturants = resturants.filter((resturant) =>{
              return resturant._id !== viewResturant._id
          });
          setResturants(allResturants);
          setSpinner(false);

      }
      const paymentHandler = async()=>{
         setSpinner(true);
         if(payAmount && payAmount <= balance){
             const paymnet = await axios.post(
                 url,
                 {
                     query:`
                        mutation{
                            payResturant(amount: ${payAmount}, resturantId: "${viewResturant._id}"){
                                  _id
                                   last_invoice{
                                      date
                                      amount
                                  }
                                  current_balance
                            }
                        }
                     `
                 }
             );
             setBalace(paymnet.data.data.payResturant.current_balance);
             setInvoice(paymnet.data.data.payResturant.last_invoice);
             setPayAmount(0);
             setSpinner(false)
         }
         setSpinner(false);
         
      }
    
    const fetchResturants = async()=>{
        try {
            const resturantsAll =await axios.post(
                url,
                {
                    query:`
                       query{
                          activeResturants{
                              _id
                              name
                              post_code
                              email
                              contact_number
                              current_balance
                              cover_image
                          }  
                       }
                    `
                }
            );
            console.log(resturantsAll);
            setResturants(resturantsAll.data.data.activeResturants);
            setComplete(true);
        } catch (error) {
            throw error;
        }
    };
    useEffect(()=>{
        fetchResturants();
    }, []);
    let getAll;
    if(complete){
        if(resturants.length > 0){
            getAll = resturants.map(resturant =>{
                return<Restaurant
                         key={resturant._id}
                         id={resturant._id}
                         name={resturant.name}
                         post_code={resturant.post_code}
                         email={resturant.email}
                         phone={resturant.contact_number}
                         current_balance={resturant.current_balance}
                         cover={resturant.cover_image}
                         viewHandler={viewResturantHandler}
                      />
            });
        }else{
            getAll = <p>No active resturants.</p>
        }
    }else{
        getAll = <p>Loading...</p>
    }
    return(
        <div className="active-resturants">
            <Spinner show={spinner}/>
            <BannedModal show={bannedModal} foodViewHandler={bannedCloseModal}>
                <div className="banned-activity">
                    <p>Are you sure , do you want to banned or block this restaurant permanently ? </p>
                    <button onClick={bannedCloseModal} className="banned-no">No</button>
                    <button onClick={bannedResturant} className="banned-yes">Yes</button>
                </div>
            </BannedModal>
            <ViewModal show={modal}>
                <div className="active-view-header">
                    <h2>{viewResturant.name}</h2>
                    <button onClick={()=>{setModal(false)}}><FontAwesomeIcon icon={faTimes}/></button>
                </div>
                <div className="active-view-details">
                    <p>Email : {viewResturant.email}</p>
                    <p>Post code : {viewResturant.post_code}</p>
                    <p>Phone : {viewResturant.contact_number}</p>

                    <h2>Bank Account</h2>
                    {viewResturant.bank_account ? <p>{viewResturant.bank_account}</p>:<p>Bank account not added.</p>}
                    
                    <h2>Balance</h2>
                    {invoice ? <div className="invoice">
                        <p>Last paid: 2 march 2021</p>
                        <p>Amount: {invoice.amount}</p>
                    </div>: null}
                    <p>Current balance : <FontAwesomeIcon icon={faPoundSign}/> {balance}</p>
                    <input onChange={balanceChangeHandler} value={payAmount} type="number" placeholder="Enter amount" min="0" max={balance}/>
                    <button onClick={paymentHandler}>Pay</button>

                    <h2>Membership</h2>
                    <p>Do you want to block or banned this restaurant membership ? </p>
                    <button onClick={bannedOpenModal}>Banned</button>
                </div>
            </ViewModal>
            {getAll}
        </div>
    );
};

export default ActiveResturants;