import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Link, NavLink, Redirect } from 'react-router-dom';
import Logo from '../../assets/logofinal.png';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import NavModal from '../Modals/MobileNavModal';
import MenuModal from '../Modals/MenuModal';
import '../../styles/Navigations.scss';

function NavWithBanner(props) {
    const [navModal, setNavModal] = useState(false);
    const [menuModal, setMenuModal] = useState(false);
    const [redirect, setRedirect] = useState(null);

    let userOptions;
    const menuModalHandler = () => {
        setMenuModal(!menuModal);
    };
    const menuHideHandler = () => {
        setMenuModal(false);
        setNavModal(false);
    }
    const logOutHandler = () => {
        localStorage.removeItem('TOKEN');
        setMenuModal(false);
        setNavModal(false);
        setRedirect(<Redirect to="/" />)
    }
    if (!localStorage.TOKEN) {
        userOptions = <div>
            <Link to="/user/signup" className="signup-link">Sign up</Link>
            <Link to="/user/signin" className="signin-link">Sign in</Link>
        </div>
    } else {
        userOptions = <div>
            <button onClick={menuModalHandler}><FontAwesomeIcon icon={faUser} /></button>
        </div>
    }
    const navModalHandler = () => {
        if (navModal) {
            setNavModal(!navModal);

        } else {
            setNavModal(!navModal);
        }

    };


    return (
        <div className="home-nav">
            {redirect}
            <NavModal show={navModal} navShowHandler={navModalHandler}>
                {
                    localStorage.TOKEN ?
                        <ul className="mobile-nav-options">
                            <li>
                                <Link onClick={menuHideHandler} to="/user-profile">Your Account</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/user-profile/orders">Your Orders</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/user-profile">Privacy and Settings</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/restaurants">Restaurants</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/business">Businesses</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/about">About</Link>
                            </li>
                            <li>
                                <button onClick={logOutHandler}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button>
                            </li>
                        </ul> :
                        <ul className="mobile-nav-options">
                            <li>
                                <Link onClick={menuHideHandler} to="/user/signin">Sign in</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/user/signin">Sign up</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/">Home</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/business">Business</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/restaurants">Restaurants</Link>
                            </li>
                            <li>
                                <Link onClick={menuHideHandler} to="/about">About</Link>
                            </li>
                        </ul>
                }
            </NavModal>
            <MenuModal show={menuModal} closeHandler={menuHideHandler}>
                <ul className="menu-user-options">
                    <li>
                        <Link onClick={menuHideHandler} to="/user-profile">Your Account</Link>
                    </li>
                    <li>
                        <Link onClick={menuHideHandler} to="/user-profile/orders">Your Orders</Link>
                    </li>
                    <li>
                        <Link onClick={menuHideHandler} to="/user-profile">Privacy and Settings</Link>
                    </li>
                    <li>
                        <button onClick={logOutHandler}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button>
                    </li>
                </ul>
            </MenuModal>
            <div className="dekstop-nav">
                <div className="home-nav-left">
                    <div className="logo-container">
                        <Link to="/">
                            <img src={Logo} alt="BookTheChefs" />
                            <h3 style={{ color: "#fff" }}>BookTheChefs</h3>
                        </Link>
                    </div>
                </div>
                <div className="home-nav-right">
                    {userOptions}
                </div>
            </div>
            <div className="mobile-nav">
                <button onClick={navModalHandler}><FontAwesomeIcon icon={faBars} /></button>
                <div className="mobile-logo">
                    <Link to="/">
                        <img src={Logo} alt="BookTheChefs" />
                        <h3>BookTheChefs</h3>
                    </Link>
                </div>
            </div>
        </div>

    );
};

const mapStateToProps = state => {
    return {
        auth: state.auth.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signIn: (userId) => {
            dispatch({
                type: actionTypes.AUTH_USER,
                userId
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavWithBanner);