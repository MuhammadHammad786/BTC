import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import "../styles/RequestResturant.scss";

import Navigation from "../components/Navigations/HomeNav";
import Footer from "../components/Footer";
import Confirmation from "../components/Modals/OtherModal";
import Spinner from "../components/Modals/SpinnerModal";

import Grow from "../assets/grow.jpg";
import Grow2 from "../assets/grow-2.jpg";
import Grow3 from "../assets/grow-3.jpg";
import Timer from "../assets/pickup.png";
import Settings from "../assets/tell-us.png";
import Group from "../assets/menu.png";

import { url } from "../utils/utils";

function RequestResturant() {
  const [name, setName] = useState("");
  const [postCode, setPostCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [foodType, setFoodType] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const nameChangeHandler = (e) => {
    setName(e.target.value);
  };
  const postChangeHandler = (e) => {
    setPostCode(e.target.value);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };
  const phoneChangeHandler = (e) => {
    setPhone(e.target.value);
  };
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };
  const modalCloseHandler = () => {
    setConfirm(!confirm);
  };
  const foodTypeChangeHandler = (e) => {
    console.log("Foodtype", e.target.value);
    setFoodType(e.target.value);
  };
  // let long = 0;
  // let lat = 0;
  // const showPosition = (position) => {
  //   lat = position.coords.latitude ;
  //   long =  position.coords.longitude;
  let pos = {
    lat:0,  
    long:0 
  }
  // }
  const resturantRequestHandler = async () => {
    
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
              }
        console.log("Latitude is :", pos);
        // console.log("Longitude is :", position.coords.longitude);
      });
    
      // console.log(pos)
    }
    
    if (name && email && phone && postCode && password) {
      setSpinner(true);
      // console.log("lat ->" , pos.lat);
      // console.log('long ->', pos.long)
      await axios.post(url, {
        query: `
                 mutation{
                     resturantRequest(
                         name:"${name}",
                         post_code:"${postCode}",
                         email:"${email}",
                         contact_number:"${phone}",
                         password:"${password}",
                         location:{
                           type:"Point",
                           coordinates: [
                             ${pos.long},
                             ${pos.lat}
                           ]
                         }

                     ){
                         _id
                         name
                     }
                 }
              `,
      });
      setName("");
      setPassword("");
      setEmail("");
      setPostCode("");
      setPhone("");
      setSpinner(false);
      setConfirm(true);
    }
  };
  const clickHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div className="request-resturant">
      <Spinner show={spinner} />
      <Confirmation show={confirm} ModalClose={modalCloseHandler}>
        <div className="request-confirmation-message">
          <p>
            Thank you for submit your request.We will confirm you and onboard
            your restaurant as soon as possible.
          </p>
          <Link to="/merchant-portal">Go to Merchant Portal.</Link>
        </div>
      </Confirmation>
      <div className="main-nav-bar">
        <Navigation />
      </div>
      <div className="resturant-request-content">
        <div className="request-intro">
          <h1>
            BooktheChefs helps fine dining restaurants of any size and scale
            access the office and at home consumer market whilst maintaining the
            high standards and excellence of their cuisine.
          </h1>
        </div>
        <div className="request-form">
          <div className="request-form-new">
            <h3>Get started with Book The Chefs today</h3>
            <input
              type="text"
              onChange={nameChangeHandler}
              value={name}
              placeholder="Restaurant name"
            />
            <input
              type="text"
              onChange={postChangeHandler}
              value={postCode}
              placeholder="Restaurant Post Code"
            />
            <input
              type="email"
              onChange={emailChangeHandler}
              value={email}
              placeholder="Email"
            />
            <input
              type="text"
              onChange={phoneChangeHandler}
              value={phone}
              placeholder="Phone number"
            />
            <input
              type="password"
              onChange={passwordChangeHandler}
              value={password}
              placeholder="Password"
            />
            {/* <select velue={foodType} onChange={foodTypeChangeHandler}>
              <option>Select food types</option>
              <option value="gluten free">Gluten Free</option>
              <option value="halal">Halal</option>
              <option value="vegan">Vegan</option>
              <option value="vegan friendly">Vegan Friendly</option>
              <option value="vegetarian">Vegetarian</option>
            </select> */}
            <button onClick={resturantRequestHandler}>Get Started</button>
            <p style={{ paddingTop: "10px", fontWeight: "500" }}>Or</p>
            <Link to="/merchant-portal">Log in to Merchant Portal</Link>
          </div>
        </div>
      </div>
      <div className="grow-business">
        <div className="grow-business-content">
          <img src={Grow} alt="grow-business" />
          <div className="grow-business-body">
            <h2>Grow Your Business</h2>
            <div className="line-color"></div>
            <p>
              Connecting customers to nearby fine dining establishments and
              great local chefs in a way that saves them time and gives them a
              comprehensive selection of premium restaurants available on
              BooktheChefs within each neighborhood. These two factors unlock
              BooktheChefs's equation for local commerce success.
            </p>
            <button
              className="clickButton"
              onClick={() => {
                clickHandler();
              }}
            >
              See How
            </button>
          </div>
        </div>
      </div>
      <div className="grow-business-2">
        <div className="grow-business-content">
          <img src={Grow2} alt="grow-business" />
          <div className="grow-business-body">
            <h2>Reach new patrons</h2>
            <div className="line-color"></div>
            <p>
              Also in our unified platform it is a key part of our model that
              restaurant partners have enough control, not only over being able
              to speak with their customers, but control for the look and feel
              of their storefront. Thats the sweet spot were looking to find,
              which we think is a win for fine dining patrons and our restaurant
              partners. We do this through our partner portal, our shared
              marketing tools, promotional efforts and many other initiatives.
            </p>
            <button
              className="clickButton"
              onClick={() => {
                clickHandler();
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="grow-business">
        <div className="grow-business-content">
          <img src={Grow3} alt="grow-business" />
          <div className="grow-business-body">
            <h2>Partner with Book the chefs</h2>
            <div className="line-color"></div>
            <p>
              Partner with BooktheChefs and gain a competitive, technological
              edge, that can be driving your business ' profitability and
              providing a more personalized way to connect with your customers
              via App and online.
            </p>
            <button
              className="clickButton"
              onClick={() => {
                clickHandler();
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="how-it-works-2">
        <h1>3 simple steps to get started</h1>
        <div className="work-steps">
          <div className="work-step">
            <img src={Settings} alt="step-1" />
            <h3>Tell us about your restaurant.</h3>
          </div>
          <div className="work-step">
            <img src={Group} alt="step-2" />
            <h3>Upload your menu.</h3>
          </div>
          <div className="work-step">
            <img src={Timer} alt="step-3" />
            <h3>You cook, customer picks up.</h3>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RequestResturant;
