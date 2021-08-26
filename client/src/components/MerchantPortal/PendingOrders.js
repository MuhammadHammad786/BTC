import React, {useState, useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faPoundSign} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { url } from '../../utils/utils';

import Skeleton from '../Skeleton/Orders';
import Order from './MerchantOrder';
import OrderView from '../Modals/FoodViewModal';
import OrderedItem from './OrderedItem';
import Spinner from '../Modals/SpinnerModal';

import timeFormat from '../../utils/timeFormat';

function PendingOrders(){
    let pendingOrders, orderedItems, singleOrder;

    const [orders, setOrders] = useState([]);
    const [complete, setComplete] = useState(false);
    const [orderView, setOrderView] = useState(false);
    const [order, setOrder] = useState({});
    const [orderFetch, setOrderFetch] = useState(false);
    const [spinner, setSpinner] = useState(false);


    const orderViewOpen = async(orderId, id)=>{
        setOrderView(true);
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
        setOrderFetch(true);
        setSpinner(false);
    };

    const orderViewClose = ()=>{
        setOrderView(false);
        setOrderFetch(false);
    }
    const accetpOrder = async()=>{
        try {
            setSpinner(true);
            setOrderView(false);
            const acceptOr = await axios.post(
                url,
                {
                    query:`
                      mutation{
                        acceptOrder(orderId:"${order._id}"){
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
            setOrders(acceptOr.data.data.acceptOrder);
            setSpinner(false);
        } catch (error) {
            throw error;
        }
    }
    if(orderFetch){
        orderedItems = order.foods.map(food =>{
            return<OrderedItem 
                   key={food.itemId}
                   food={food}
                  />
        });
        singleOrder =  <OrderView show={orderView} foodViewHandler={orderViewClose}>
                            <div className="order-view-header">
                                <h3>Order</h3>
                                <button onClick={orderViewClose}><FontAwesomeIcon icon={faTimes}/></button>
                            </div>
                            <div className="order-view-body">
                                <p>Pick up date: {timeFormat(order.pickup_time)}</p>
                                <p>Phone: {order.contact_number}</p>
                                <p>Total: <span className="order-total-price"><FontAwesomeIcon icon={faPoundSign}/><span className="order-total">{order.total}</span></span></p>
                                <p>Ordered items : </p>
                                {orderedItems}
                            </div>
                            <div className="order-view-actions">
                                <button>Cancel</button>
                                <button onClick={accetpOrder} className="order-action-accept">Accept</button>
                            </div>
                        </OrderView>
    };
    const fetchOrders = async()=>{
        try {
            const orders = await axios.post(
               url,
               {
                   query:`
                        query{
                            resturantPendingOrders(resturantId:"${localStorage.merchantId}"){
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
            setOrders(orders.data.data.resturantPendingOrders);
            setComplete(true);

        } catch (error) {
            throw error;
        }
    };

   
    useEffect(()=>{
        fetchOrders();
    },[]);
    if(complete){
       if(orders.length > 0){
        pendingOrders = orders.map((order, id)=>{
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
    return(
        <div>
            <Spinner show={spinner}/>
            {singleOrder}
            <div className="merchant-orders-all">
                {pendingOrders}
            </div>
        </div>
    );
};

export default PendingOrders;