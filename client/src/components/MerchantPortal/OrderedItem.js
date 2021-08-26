import React from 'react';

import '../../styles/MerchantPortal.scss';

const orderedItem = (props)=>{
    return(
        <div className="ordered-item-merchant">
            <img src={props.food.image}/>
            <div className="ordered-item-merchant-others">
                <p>{props.food.title}</p>
                <p>Quantity: {props.food.quantity}</p>
                <p>Total : {props.food.price} * {props.food.quantity} = {props.food.price * props.food.quantity}</p>
            </div>
        </div>
    );
};

export default orderedItem;