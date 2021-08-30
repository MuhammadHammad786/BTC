import React, { useEffect } from 'react';

import Navigation from '../components/Navigations/HomeNav';
import Footer from '../components/Footer';
import Abou from '../assets/about.jpg';
import Abou2 from '../assets/about-2.jpg';

import '../styles/About.scss';

function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    return (
        <div>
            <div className="main-nav-bar">
                <Navigation />
            </div>
            <div className="about-content">
                <div style={{textAlign:'center'}}>
                    <h1>Who we are</h1>
                </div>
                <img className="about-1-img" src={Abou} alt="about" />
                <div className="aboutText">
                    <p>
                        BooktheChefs, the fine dining ordering ahead App,gives you the highest quality dishes from some of the world's best 
                        chefs direct to your company desk, boardroom or home dining room table.
                    </p>
                </div>
                <div className="about-2">
                    <div className="about-2-content">
                        <p>Order ahead for Michelin star rated cuisine, the finest steak, the freshest seafood and more with BooktheChefs.<br/> Advance ordering allows you to get your food when it’s most convenient for you. We set our standards very high so you can enjoy only the best with the greatest convenience.</p>
                    </div>
                    <img src={Abou2} alt="about" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;