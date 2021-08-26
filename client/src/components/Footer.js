import React from 'react';
import { Link } from 'react-router-dom';

import Twitter from '../assets/twitter.png';

import '../styles/Footer.scss';

const footer = ()=>{
    return(
        <div className="footer-container">
            <div className="footer-body">
                <div className="footer-list">
                    <div>
                        <Link to="/terms-conditions">Terms and Conditions</Link>
                    </div>
                    <div>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </div>
                    <div>
                        <Link to="/business">Business Service</Link>
                    </div>
                    <div>
                        <Link to="/restaurants">Be A Partner</Link>
                    </div>
                    <div>
                        <Link to="/privacy-policy">Application End Use Licence Agreement</Link>
                    </div>
                    <div>
                        <Link to="/about">About Us</Link>
                    </div>
                    <div>
                        <Link to="/contact">Contact</Link>
                    </div>
                   
                </div>
                <div className="social-link">
                        <a href="https://twitter.com/BooktheC" target="_blank"><img src={Twitter} alt="twitter"/></a>
                </div>
                <p>© Copyright are reserved to BooktheChefs 2021</p>
            </div>
        </div>
    );
};

export default footer;