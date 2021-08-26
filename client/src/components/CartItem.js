import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import '../styles/resturantView.scss';

function CartItem (props){
    let title;
    if(props.title.length > 20){
        title = props.title.substring(0, 15) + "..";
    }else{
        title = props.title;
    }
    return(
        <div className="cart-item">
            <img src={props.imageurl} alt={props.title}/>
            <div className="cart-item-details">
                <div className="cart-item-info">
                    <p>{title}</p>
                    <p style={{color:"rgb(16, 211, 218)"}}>{props.poundSign} {props.price * props.quantity}</p>
                    <button onClick={()=>props.decQuantity(props.id)}><FontAwesomeIcon icon={faMinus}/></button> {props.quantity} <button onClick={()=>props.incQuantity(props.id, "INC")}> <FontAwesomeIcon icon={faPlus}/> </button>
                </div>
                <div className="cart-item-remove">
                    <button onClick={()=>props.cartItemRemove(props.id)}><FontAwesomeIcon icon={faTimes}/></button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;