import React, { useState,useEffect } from 'react';

import Navigation from '../components/Navigations/HomeNav';
import Footer from '../components/Footer';

import { url } from '../utils/utils';
import axios from 'axios';

import IntroImage from '../assets/business.jpg';
import Easy from '../assets/food-1.jpg';
import Food2 from '../assets/food-2.jpg';
import Team from '../assets/team.jpg';
import Timer from '../assets/timer.png';
import Settings from '../assets/settings.png';
import Group from '../assets/group.png';

import Spinner from '../components/Modals/SpinnerModal';

import '../styles/Business.scss';

function Business(){
    const [email,setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [spinner, setSpinner] = useState(false);

    const emailChamgeHandler = (e)=>{
      setEmail(e.target.value);
    }

    const subscriptionHandler = async()=>{
       try{
         if(email){
           setSpinner(true);
           setMessage('');
          const subscr = await axios.post(
            url,
            {
              query:`
                mutation{
                 subscribe(email:"${email}"){
                   success
                   error_message
                 }
                }
              `
            }
          );
          if(subscr.data.data.subscribe.success){
            setMessage('Subscribed successfully!');
          }else{
            setMessage(subscr.data.data.subscribe.error_message)
          }
           setSpinner(false);
         }
       }catch(error){
         throw error;
       }
    }
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return(
        <div className="business-main">
            <Spinner show={spinner}/>
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="bus-intro">
             <div className="business-intro-body">
                <img src={ IntroImage } alt="business"/>
                <div className="business-intro-left">
                  <h1>Meal plans to make everyone happy</h1>
                  <div className="line-color"></div>
                  <p>There are times at work or at home where you want to enjoy fine dining but don't have the time to travel to a fine dining restaurant. BooktheChefs is the solution it is ideal for the busy executive or business person.</p>
                  <div className="news-subscription">
                    <h3>Want more info ?</h3>
                    <input onChange={emailChamgeHandler} value={email} type="email" placeholder="Enter your email here’ "/>
                    <p>{message}</p>
                    <button onClick={subscriptionHandler}>Lets's Get Started</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="how-it-works">
              <h1>How it works</h1>
              <div className="work-steps">
                  <div className="work-step">
                      <img src={Settings} alt="step-1"/>
                      <h3>Improve team cohesion and performance</h3>
                      <p>This generates economic benefits, and that employers should encourage shared meals, to increase employee collaboration and company performance</p>
                  </div>
                  <div className="work-step">
                      <img src={Group} alt="step-2"/>
                      <h3>Retention of qualified staff</h3>
                      <p>There is no better place to build a team than around a food-packed table</p>
                  </div>
                  <div className="work-step">
                      <img src={Timer} alt="step-3"/>
                      <h3>Convenience and Time</h3>
                      <p>The average office worker spends 45 minutes a week waiting on coffee and lunch</p>
                  </div>
              </div>
            </div>
           
            <div className="easy-to-use">
              <div  className="easy-to-use-body">
                <img src={Easy} alt="Easy to use"/>
                <div className="easy-to-use-content">
                    <h1>Easy to use</h1>
                    <div className="line-color"></div>
                    <p>Social Eating with shared lunches or dinners are for all types of companies,startups, innovation led companies, co-working spaces and traditional companies. All these types of businesses are increasingly eating together, ordering meals that are eaten in the office and in busy City Centre settings, using BooktheChefs is easier than food-delivery apps, where coordinating dropoffs with drivers can often lead to headaches, and BooktheChefs gives access to fine dining that is less available on other food-delivery apps.</p>
                </div>
               </div>
            </div>

            <div className="easy-to-use-2">
              <div  className="easy-to-use-body">
                <img src={Food2} alt="Easy to use"/>
                <div className="easy-to-use-content">
                    <h1>Save Time whilst retaining quality</h1>
                    <div className="line-color"></div>
                    <p>The average office worker spends 45 minutes a week waiting on coffee and lunch with BooktheChefs this inefficiency is vastly reduced. Dining in a fine dining establishment can take two hours and whilst very enjoyable is often not practical in the middle of a busy work day or if business documents and files are to be worked with electronically or in hard copy format.</p>
                </div>
              </div>
           </div>

            <div className="easy-to-use">
             <div  className="easy-to-use-body">
                  <img src={Team} alt="Easy to use"/>
                <div className="easy-to-use-content">
                    <h1>Enhance Team Performance</h1>
                    <div className="line-color"></div>
                    <p>Sharing meals favours the tendency to collaborate, thereby promoting teamwork. Eating together is a way to get to know others better and strengthen relationships between members of a group.This generates economic benefits, and that employers should encourage shared meals, to increase employee collaboration and company performance. There is no better place to build a team than around a food-packed table.</p>
                </div>
            </div>
            </div>
           <div>
          </div>
          <Footer />
        </div>
    );
};

export default Business;