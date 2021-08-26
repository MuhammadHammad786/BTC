import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';

import { cartItems } from '../cartData';

import CartItem from './CartItem';
import { Link } from 'react-router-dom';
import EmptyBasket from '../assets/empty-basket.svg';

const cart = (props) =>{
    let subTotal = 0, serviceFee = 2,carts, cartLength = 0;
    if(props.cartItems.length > 0){
        carts = props.cartItems.map((item, id )=>{
            cartLength++;
            subTotal += item.price * item.quantity;
            return <CartItem 
                      key={id}
                      id={id}
                      title={item.title}
                      price={item.price}
                      imageurl={item.image}
                      quantity={item.quantity}
                      cartItemRemove={props.cartItemRemove}
                      incQuantity={props.incQuantity}
                      decQuantity={props.decQuantity}
                      poundSign={props.poundSign}
                   />     
        });
       localStorage.setItem('total', subTotal);
    }else{
        carts = <div className="empty-basket">
            {/* <img src={EmptyBasket} alt="empty-basket"/> */}
        </div>
    }

    
    return(
        <div style={{width:"100%", height:"100%"}}>
                <div className="cart-header">
                    <div className="cart-title">
                       <h3>Your Basket</h3>
                       <p>You added {cartLength} items</p>
                    </div>
                    <button onClick={props.cartClose}><FontAwesomeIcon icon={faTimes}/></button>
                </div>
                <div className="cart-added-foods">
                   {carts}
                </div>
               {/* <div className="calculation-container">
                    <p className="calculation-title">Subtotal</p>
                    <p className="calculation-value">{props.poundSign} {subTotal}</p>
                </div>
                <div className="calculation-container">
                    <p className="calculation-title">Service fee</p>
                    <p className="calculation-value">{props.poundSign} {serviceFee}</p>
                </div> */}
                <div className="calculation-container">
                    <p className="calculation-title">Total</p>
                    <p className="calculation-value">{props.poundSign} {subTotal}</p>
                </div>
                <div className="checkout-button-container">
                   <button onClick={props.checkoutHandler} className="checkout-button">Continue to payment</button>
                </div>
        </div>
    );
};

export default cart;