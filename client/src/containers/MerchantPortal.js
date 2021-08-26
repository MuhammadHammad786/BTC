import React, { useState, useEffect } from "react";
import { NavLink, Route, Link } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import * as actionTypes from "../store/actions/actionTypes";

import { url } from "../utils/utils";

import "../styles/MerchantPortal.scss";
import LogInModal from "../components/Modals/LogInModal";
import Foods from "../components/MerchantPortal/FoodsSection";
import Home from "../components/MerchantPortal/MerchantHome";
import Orders from "../components/MerchantPortal/Orders";
import Settings from "../components/MerchantPortal/MerchantSettings";
import Logo from "../assets/logofinal.png";
import Spinner from "../components/Modals/SpinnerModal";
import MenuModal from "../components/Modals/MobileNavModal";
import ChefProfile from "../components/MerchantPortal/ChefProfile";

function MerchantPortal(props) {
  let merchantContainer;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const [login, setLogin] = useState(true);
  const [menuModal, setMenuModal] = useState(false);

  const emailChangHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };
  const menuModalHandler = () => {
    setMenuModal(!menuModal);
  };
  const menuHideHandler = () => {
    setMenuModal(false);
  };
  const merchantLoginHandler = async () => {
    try {
      if (email && password) {
        setSpinner(true);
        const merchant = await axios.post(url, {
          query: `
                       query{
                            merchantLogin(email:"${email}", password: "${password}"){
                                token
                                resturantId
                                success
                                error_message
                            }
                       }
                    `,
        });
        if (merchant.data.data.merchantLogin.success) {
          localStorage.setItem(
            "MERCHANT_TOKEN",
            merchant.data.data.merchantLogin.token
          );
          localStorage.setItem(
            "merchantId",
            merchant.data.data.merchantLogin.resturantId
          );
          setLogin(false);
          setErrorMessage(null);
          setSpinner(false);
          props.merchantAuth(merchant.data.data.merchantLogin.resturantId);
        } else {
          setErrorMessage(merchant.data.data.merchantLogin.error_message);
          setSpinner(false);
        }
      }
    } catch (error) {
      throw error;
    }
  };
  if (props.auth) {
    merchantContainer = (
      <div className="merchant-container">
        <div className="merchant-leftnav">
          <ul>
            <li>
              <NavLink
                exact
                activeStyle={{ color: "white", background: "#990328" }}
                to="/merchant-portal"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeStyle={{ color: "white", background: "#990328" }}
                to="/merchant-portal/foods"
              >
                Foods
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ color: "white", background: "#990328" }}
                to="/merchant-portal/orders"
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeStyle={{ color: "white", background: "#990328" }}
                to="/merchant-portal/chef-profile"
              >
                Chef profile
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeStyle={{ color: "white", background: "#990328" }}
                to="/merchant-portal/settings"
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="merchant-content">
          <Route
            path="/merchant-portal"
            exact
            render={(props) => (
              <Home {...props} resturantId={props.resturantId} />
            )}
          />
          <Route
            path="/merchant-portal/foods"
            exact
            render={(props) => (
              <Foods {...props} resturantId={props.resturantId} />
            )}
          />
          <Route
            path="/merchant-portal/orders"
            render={(props) => (
              <Orders {...props} resturantId={props.resturantId} />
            )}
          />
          <Route path="/merchant-portal/settings" exact component={Settings} />
          <Route
            path="/merchant-portal/chef-profile"
            exact
            component={ChefProfile}
          />
        </div>
      </div>
    );
  }
  useEffect(() => {
    console.log("Resturant id", props.resturantId);
  }, []);

  return (
    <div className="merchant-main">
      <Spinner show={spinner} />
      <LogInModal show={props.auth}>
        <div className="merchant-login">
          <img src={Logo} alt="bookthechefs" />
          <h3>Sign in to Merchant Portal</h3>
          <input
            onChange={emailChangHandler}
            type="email"
            value={email}
            placeholder="Email"
            required
          />
          <input
            onChange={passwordChangeHandler}
            type="password"
            value={password}
            placeholder="Password"
            required
          />
          <p>{error_message}</p>
          <button onClick={merchantLoginHandler}>Sign in</button>
          <div className="merchant-login-switch">
            <Link to="/merchant/forgot-password">Forgotten password ?</Link>
            <Link to="/restaurants">Get started</Link>
          </div>
        </div>
      </LogInModal>
      <MenuModal show={menuModal} navShowHandler={menuHideHandler}>
        <ul className="menu-user-options">
          <li>
            <Link onClick={menuHideHandler} to="/merchant-portal">
              Home
            </Link>
          </li>
          <li>
            <Link onClick={menuHideHandler} to="/merchant-portal/foods">
              Foods
            </Link>
          </li>
          <li>
            <Link onClick={menuHideHandler} to="/merchant-portal/orders">
              Orders
            </Link>
          </li>
          <li>
            <Link onClick={menuHideHandler} to="/merchant-portal/settings">
              Settings
            </Link>
          </li>
          <li>
            <button onClick={props.logout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </li>
        </ul>
      </MenuModal>
      <div className="mecrchant-main-nav-bar">
        <div className="merchant-nav-main">
          <div className="logo-container">
            <Link to="/merchant-portal">
              <img src={Logo} alt="Merchant-portal" />
              <h3>Merchant</h3>
            </Link>
          </div>
          <button className="merchant-logout" onClick={props.logout}>
            Log out
          </button>
        </div>
      </div>
      <div className="merchant-mobile-nav">
        <button onClick={menuModalHandler}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h3>Merchant Portal</h3>
      </div>
      {merchantContainer}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.merchant.merchantAuth,
    resturantId: state.merchant.resturantId,
    merchantSetup: state.merchant.merchantSetup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    merchantAuth: (id) => {
      dispatch({
        type: actionTypes.AUTH_MERCHANT,
        returantId: id,
      });
    },
    logout: () => {
      dispatch({
        type: actionTypes.MERCHANT_LOGOUT,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantPortal);
