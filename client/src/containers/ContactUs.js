import React, {useEffect} from 'react';

import Navigation from '../components/Navigations/HomeNav';
import Footer from '../components/Footer';

import '../styles/Policy.scss';

function ContactUs(){
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);
    return(
        <div className="privacy-policy">
            <div className="main-nav-bar">
                 <Navigation />
            </div>
            <div className="policy-content">
                <h2>Contact us</h2>
                <p>Should you have any questions or concerns regarding this Privacy Policy, please contact us through Customer Support or: contact@bookthechefs.com</p>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;