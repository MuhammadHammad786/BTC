import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faPoundSign} from '@fortawesome/free-solid-svg-icons';

import OrderedItem from '../../MerchantPortal/OrderedItem';
import timeFormat from '../../../utils/timeFormat';

const viewOrder = (props)=>{
    const orderedItems = props.order.foods.map(food =>{
        return<OrderedItem 
               key={food.itemId}
               food={food}
              />
    });
    return<div className="user-view-order">
            <div className="user-view-order-header">
                <h3>Order</h3>
                <button onClick={props.modalClose}><FontAwesomeIcon icon={faTimes}/> </button>
            </div>
            <div className="user-view-order-details">
                    <p>Pick up date: {timeFormat(props.order.pickup_time)}</p>
                    <p>Phone: {props.order.contact_number}</p>
                    <p>Total: <span className="order-total-price"><FontAwesomeIcon icon={faPoundSign}/><span className="order-total">{props.order.total}</span></span></p>
                    <p>Ordered items : </p>
                  {orderedItems}
            </div>

         </div>
};

export default viewOrder;