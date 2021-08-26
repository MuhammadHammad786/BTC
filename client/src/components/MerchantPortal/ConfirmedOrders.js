import React, { useState, useEffect} from 'react';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faPoundSign} from '@fortawesome/free-solid-svg-icons';

import { url } from '../../utils/utils';
import timeFormat from '../../utils/timeFormat';

import Skeleton from '../Skeleton/Orders';
import Order from './MerchantOrder';
import OrderView from '../Modals/FoodViewModal';
import OrderedItem from './OrderedItem';
import Spinner from '../Modals/SpinnerModal';

function ConfirmedOrders(){
    let confirmedOrders, orderedItems, singleOrder;

    const [orders, setOrders] = useState([]);
    const [complete, setComplete] = useState(false);
    const [orderFetch, setOrderFetch] = useState(false);
    const [orderView, setOrderView] = useState(false);
    const [order, setOrder] = useState({});
    const [spinner, setSpinner] = useState(false);

    const orderViewOpen = async(orderId, id)=> {
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
        setSpinner(false);
        setOrderFetch(true);
        
    }
    const orderViewClose = () =>{
        setOrderView(false);
        setOrderFetch(false);
    }
    const pickedOrder = async()=>{
        try {
            setSpinner(true);
            setOrderView(false);
            await axios.post(
                url,
                {
                    query:`
                      mutation{
                        pickedOrder(orderId:"${order._id}"){
                            _id
                            }
                      }
                    `
                }
            );
            const new_orders = orders.filter((or)=>{
                return order._id !== or._id
            });
            setOrders(new_orders);
            setOrderFetch(false);
            setOrder({});
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
                                <button onClick={pickedOrder} className="order-action-accept">Picked up</button>
                            </div>
                        </OrderView>
    };
    if(complete){
        if(orders.length > 0){
            confirmedOrders = orders.map((order, id) =>{
                return<Order
                     id={id}
                     key={order._id}
                     orderId={order._id}
                     order={order}
                     orderViewOpen={orderViewOpen}
                    />
            });
        }else{
            confirmedOrders = <p>No confirmed orders.</p>
        }
    }else{
            confirmedOrders = <Skeleton />
     };


    const fetchOrders = async()=>{
        try {
            const orders = await axios.post(
               url,
               {
                   query:`
                        query{
                            resturantConfirmedOrders(resturantId:"${localStorage.merchantId}"){
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
            setOrders(orders.data.data.resturantConfirmedOrders);
            setComplete(true);
        } catch (error) {
            throw error;
        }
    };
    useEffect(()=>{
        fetchOrders();
    },[]);
    return(
        <div>
             <Spinner show={spinner}/>
             {singleOrder}
            <div className="merchant-orders-all">
             {confirmedOrders}
        </div>
        </div>
    );
};

export default ConfirmedOrders;