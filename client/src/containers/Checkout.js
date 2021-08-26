import React, { useState, useEffect} from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';
import * as actionTypes from '../store/actions/actionTypes';

import StripeCheckout from 'react-stripe-checkout';

import '../styles/Checkout.scss';
import Footer from '../components/Footer';

import { url } from '../utils/utils';
import Navigation from '../components/Navigations/HomeNav';
import Spinner from '../components/Modals/SpinnerModal';
import SuccessModal from '../components/Modals/OtherModal';

function Checkout(props){
    const [cartItems, setCart] = useState([]);
    const [date, setDate] = useState(new Date().toISOString());
    const [time, setTime] =useState('');
    const [phone, setPhone] = useState('');
    const [nextStep, setNextStep] = useState(false);
    const[spinner, setSpinner] = useState(false);
    const [success, setSuccess] = useState(false);
    const [redirect, setRedirect] = useState(null);

    const phoneChangeHandler = (e)=>{
        setPhone(e.target.value);
    }

    const dateChangeHandler = (e)=>{
       setDate(e.target.value);
    }
    const timeChangeHandler = (e) =>{
        setTime(e.target.value);
    }
    const onToken = async(token) => {
      console.log(token);
      setSpinner(true);
      await axios.post(
          url,
          {
            query:`
             mutation{
               payment(
                 source:"${token.id}", 
                 orderId:"${localStorage.orderId}", 
                 amount:${localStorage.total},
                 email:"${token.email}"
                 ){
                 _id
               }
             }
            `
          }
      );
      setSpinner(false);
      setSuccess(true);
      localStorage.removeItem('orderId');
      localStorage.removeItem('total');
    }
    useEffect(()=>{
        window.scrollTo(0,0);
        const cart =  JSON.parse(localStorage.getItem('cart') || "[]");
        setCart(cart);
        if(cart.length <= 0){
          setRedirect(<Redirect to="/"/>)
        }
        if(localStorage.orderId){
           setNextStep(true);
        }
    
    }, []);

    const orderHandler = async() =>{
      if(date && phone){
        const carts =  JSON.parse(localStorage.getItem('cart') || "[]");
        setSpinner(true);
        let formattedCarts = '';
        await carts.map(cart => {
          formattedCarts += `{ image: "${cart.image}", itemId: "${cart.itemId}", price: ${cart.price}, quantity:${cart.quantity}, title:"${cart.title}" },`;
          });
          const order = await axios.post(
            url,
            {
                query:`
                  mutation{
                    createOrder(orderInput:{
                      resturant:"${localStorage.resturant}",
                      user:"${props.userId}",
                      foods:${JSON.stringify(carts).replace(/"([^(")"]+)":/g,"$1:")},
                      sub_total: ${localStorage.total},
                      total: ${localStorage.total},
                      pickup_time:"${date}",
                      contact_number:"${phone}"
                    }){
                      _id
                    }
                  }
                `
            }

        );
        localStorage.setItem("orderId", order.data.data.createOrder._id);
        setSpinner(false);
        setNextStep(true);
        localStorage.removeItem('cart');
        localStorage.removeItem('resturant');
      }
        
    }
    function formatAMPM(date) {
        var dat = date.getDay();
        var hours = date.getHours();
        console.log(hours);
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = dat + hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
    function formatAm(time) {
        console.log(time);
        var ampm = time.substring(0,1) >= 12 ? 'pm' : 'am';
        console.log(ampm);
        return ampm;
    }
   let step;
   if(nextStep){
       step = <div className="take-payment-section">
                  <p>You order placing successfully. Complete payment via card and proceed with your order</p>
                  <StripeCheckout
                    token={onToken}
                    stripeKey="pk_test_SjCcZhk1GdnbJ8IExmYdYVeq00nXnwyHom"
                    currency="GBP"
                  />
             </div>
   }else{
       step =   <div className="checkout-body">
       <div className="order-credentials">
       <div className="ordr-date-time">
           <h3>Pickup date and time</h3>
           <input
           onChange={dateChangeHandler} 
           type="datetime-local" value={date}
           />
           <h3>Contact number</h3>
           <input
               onChange={phoneChangeHandler} 
               type="number" value={phone} placeholder="Mobile or phone"
           />
           <button onClick={orderHandler}>Place order</button>
       </div>
        {/* <p>{date.substring(0,10)} {formatAMPM(new Date(date))}</p>
        <p>{formatAMPM(new Date(date))}</p>
        <p>Date{new Date(date).toUTCString()}</p>
        <p>Only time</p> */}
            {/* <input type="time" id="appt" name="appt"
               min="08:00" max="10:00" onChange={timeChangeHandler} value={time}/>
            <StripePayment /> 
           <p>Time: {time}</p>
           <p>Format Time: {formatAm(time)}</p> */}
       
      
       
       {/* <div className="stripe-payment">
         <StripePayment />
       </div> */}
       </div>
       {/* <div className="checkout-basket"></div> */}
   </div>
   }
    return(
        <div className="checkout-main">
          {redirect}
          <SuccessModal show={success}>
           <div className="checkout-success">
            <p>You order placed sucessfully</p>
              <Link to="/help">Help</Link>
              <Link to="/user-profile/orders">Pending Orders</Link>
           </div>
          </SuccessModal>
            <Spinner show={spinner}/>
            <div className="main-nav-bar">
                <Navigation />
            </div>
           <div className="place-order-section">
              {step}
           </div>
           <Footer />
        </div>
    );
};

const mapStateToProps = state =>{
    return{
       userId: state.auth.userId
    }
 }
 
 const mapDispatchToProps = dispatch => {
    return{
       redirectUri: () => {
          dispatch ({
             type: actionTypes.SET_REDIRECT_URI
          });
       }
    };
 };
 
 export default connect(mapStateToProps, mapDispatchToProps)(Checkout);