import React, { useState, useEffect} from 'react';
import {  Redirect } from  'react-router-dom';

import Welcome1 from '../assets/welcome-1.jpg';
import Welcome2 from '../assets/welcome-2.jpg';
import Welcome3 from '../assets/welcome-3.jpg';
import Special from '../assets/special.jpg';

import '../styles/Home.scss';
import Footer from '../components/Footer';
import HomeNav from '../components/Navigations/HomeNav';

function Home(){
    const [postCode, setPostCode] = useState('');
    const [postError , setPostError] = useState('');
    const [redirect, setRedirect] = useState(null);
    

    const postCodeChangeHandler = (e)=>{
        setPostCode(e.target.value);
        setPostError('')
    }
    const serachHandler = ()=>{
        if(postCode){
            var result = /^\d{5}$|^\d{5}-\d{4}$/.test(postCode);
            
        if(result == true || postCode == '2100'){ 
        console.log("->" , result);
         setRedirect(<Redirect to={"/search/"+postCode}/>)
        }else{
          setPostError('Invalid Code')
        }
        }
    }
    const orderNowhandler = ()=>{

        if(localStorage.resturant){
        //    setRedirect(<Redirect to={"/restaurant/"+localStorage.resturant}/>);
           setRedirect(<Redirect to={"/list"}/>);
        }else{
            window.scrollTo({top: 0, behavior:'smooth'});
        }
        
    }
    useEffect(()=>{
        window.scrollTo(0,0);
       
          

    },[])
    return(
        <div className="home-main">
            {redirect}
            <div className="main-nav-bar">
                <HomeNav />
            </div>
           <div className="Home-content">
           <div className="home-bg">
           <div className="search-container">
                <div  className="search-box">
                    <div className="search-box-content">
                        <h1>Fine Dining Available For Pickup</h1>
                       <div  className="search-box-content-left">
                          <input onChange={postCodeChangeHandler} value={postCode} type="text" placeholder="Enter postcode"/>
                          
                            {postError && 
                                <p className="bg-white text-danger" style={{color:'red', background:'white'}}>{postError}</p>
                            } 
                          
                        </div>
                       <div  className="search-box-content-right">
                         <button onClick={serachHandler}>Search</button>
                       </div>
                    </div>
                    
                </div>
            </div>
           </div>
            <div className="welcome-section">
                <div className="welcome-body">
                    <div className="welcome-body-content">
                        <h2>Welcome to BookTheChefs</h2>
                        <h1>WHO WE ARE</h1>
                        <div className="line-color"></div>
                        <p>BooktheChefs , the fine dining ordering ahead App, gives you the highest quality dishes from some of the world's best chefs direct to your company desk, boardroom or home dining room table.</p>
                        <button onClick={orderNowhandler}>Order Now</button>
                    </div>
                    <div className="double-image">
                       <img src={Welcome1} alt="Welcome" />
                       <img src={Special} alt="Welcome" />
                    </div>
                </div>
            </div>
            <div className="welcome-section2">
                <div className="welcome-body2">
                    <div className="welcome-body-content2">
                        <h1>Enjoy Your Meals</h1>
                        <div className="line-color"></div>
                        <p>Order ahead for Michelin star rated cuisine, the finest steak, the freshest seafood and more with BooktheChefs. Advance ordering allows you to get your food when it’s most convenient for you. We set our standards very high so you can enjoy only the best with the greatest convenience.</p>
                        <button onClick={orderNowhandler} >Find Restaurants</button>
                    </div>
                    <img src={Welcome2} alt="Welcome" />
                </div>
            </div>
            <div className="welcome-section">
                <div className="welcome-body">
                    <div className="welcome-body-content">
                        <h1>Bon Appetit</h1>
                        <div className="line-color"></div>
                        <p>Choose from a great variety of cuisines, from the best Chinese food in town to the finest Indian meals. Get your favourite meals faster with quick reordering. Plus, group ordering makes company ordering or entertaining a breeze.</p>
                        <button onClick={orderNowhandler}>Order Now</button>
                    </div>
                    <img src={Welcome3} alt="Welcome" />
                </div>
            </div>
           </div>
            <Footer />
        </div>
    );
};

export default Home;