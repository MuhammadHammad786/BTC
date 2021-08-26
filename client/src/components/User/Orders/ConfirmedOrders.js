import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {  url } from '../../../utils/utils';

import Skeleton from '../../Skeleton/Orders';
import Order from '../../MerchantPortal/MerchantOrder';
import ViewOrderModal from '../../Modals/FoodViewModal';
import ViewOrder from './ViewOrder';
import Spinner from '../../Modals/SpinnerModal';

function ConfirmedOrders(){
    let confirmedOrders, singleOrder;

    const [orders, setOrders] = useState([]);
    const [complete, setComplete] = useState(false);
    const [orderFetch, setOrderFetch] = useState(false);
    const [orderView, setOrderView] = useState(false);
    const [order, setOrder] = useState({});
    const [spinner, setSpinner] = useState(false);

    const orderViewOpen = async(orderId, id)=> {
        setSpinner(true);
        const fetch_order = await axios.post(
            url,
            {
               query:`
                query{
                    order(orderId:"${orderId}"){
                        _id
                        resturant
                        pickup_time
                        total
                        contact_number
                        foods{
                            image
                            title
                            itemId
                            quantity
                            price
                        }
                     }
                  }
               `
            }
        );
        setOrder(fetch_order.data.data.order);
        setOrderView(true);
        setSpinner(false);
        setOrderFetch(true);
        
    }
    
    const fetchOrders = async()=>{
        try {
            const allorders = await axios.post(
                 url,
                 {
                     query:`
                        query{
                            userConfirmedOrders(token:"${localStorage.TOKEN}"){
                                _id
                                resturant
                                user
                                pickup_time
                                total
                                contact_number
                                foods{
                                    itemId
                                }
                            }
                        }
                     `
                 }
            );
            setOrders(allorders.data.data.userConfirmedOrders);
            setComplete(true);

        } catch (error) {
            throw error;
        }
    };
    if(complete){
       if(orders.length > 0){
        confirmedOrders =  orders.map((order, id) =>{
            return<Order
                 id={id}
                 key={order._id}
                 orderId={order._id}
                 order={order}
                 orderViewOpen={orderViewOpen}
                />
        });
       }else{
           confirmedOrders = <p>No confirmed orders</p>
       }
    }else{
          confirmedOrders = <Skeleton />
    }
    const modalCloseHandler = () =>{
        setOrderView(false);
    }
    if(orderView){
        singleOrder = <ViewOrder
              modalClose={modalCloseHandler}
              order={order}
             />
    }
    useEffect(()=>{
        window.scrollTo(0,0);
        fetchOrders()
    },[])
    return(
        <div  style={{width:"100%"}}>
         <Spinner show={spinner}/>
         <ViewOrderModal show={orderView} foodViewHandler={modalCloseHandler}>
            {singleOrder}
         </ViewOrderModal>
         <div className="user-orders-all">
           {confirmedOrders}
         </div>
        </div>
    );
};

export default ConfirmedOrders;

