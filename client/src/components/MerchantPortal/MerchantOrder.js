import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPoundSign } from '@fortawesome/free-solid-svg-icons';
import timeFormat from '../../utils/timeFormat';

const merchantOrder = (props) =>{
    return(
        <div onClick={()=>props.orderViewOpen(props.orderId, props.id)} className="merchant-order">
             <p>Pick up date: {timeFormat(props.order.pickup_time)}</p>
             <p>Total: <span className="order-total-price"><FontAwesomeIcon icon={faPoundSign}/><span className="order-total">{props.order.total}</span></span></p>
             <p>Ordered {props.order.foods.length} items</p>
        </div>
    );
};

export default merchantOrder;