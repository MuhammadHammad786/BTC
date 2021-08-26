import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {  url } from '../../../utils/utils';

import Skeleton from '../../Skeleton/Orders';
import Order from '../../MerchantPortal/MerchantOrder';
import ViewOrderModal from '../../Modals/FoodViewModal';
import ViewOrder from './ViewOrder';
import Spinner from '../../Modals/SpinnerModal';

function PendingOrders(){
    let pendingOrders, singleOrder;

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
    const modalCloseHandler = () =>{
        setOrderView(false);
    }
    if(orderView){
        singleOrder = <ViewOrder
              modalClose={modalCloseHandler}
              order={order}
             />
    }
    const fetchOrders = async()=>{
        try {
            const allorders = await axios.post(
                 url,
                 {
                     query:`
                        query{
                            userPendingOrders(token:"${localStorage.TOKEN}"){
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
            setOrders(allorders.data.data.userPendingOrders);
            setComplete(true);

        } catch (error) {
            throw error;
        }
    };
    if(complete){
     if(orders.length > 0){
        pendingOrders =  orders.map((order, id) =>{
            return<Order
                 id={id}
                 key={order._id}
                 orderId={order._id}
                 order={order}
                 orderViewOpen={orderViewOpen}
                />
        });
     }else{
         pendingOrders = <p>No pending orders.</p>
     }

    }else{
        pendingOrders = <Skeleton />
    }
    useEffect(()=>{
        window.scrollTo(0,0);
        fetchOrders()
    },[])

    return(
        <div style={{width:"100%"}}>
         <Spinner show={spinner} />
         <ViewOrderModal show={orderView} foodViewHandler={modalCloseHandler}>
           {singleOrder}
         </ViewOrderModal>
          <div className="user-orders-all">
            {pendingOrders}
          </div>
        </div>
    );
};

export default PendingOrders;

