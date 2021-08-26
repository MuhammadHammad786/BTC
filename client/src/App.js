import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';

import './styles/App.scss';

import Layout from './containers/Layout';
import Home from './containers/Home';
import SearchResult from './containers/SearchResult';
import Resturant from './containers/Resturant';
import Admin from './containers/AdminControl/Admin';
import MerchantPortal from './containers/MerchantPortal';
import SignIn from './containers/UserControl/Signin';
import SignUp from './containers/UserControl/Signup';
import CheckOut from './containers/Checkout';
import Business from './containers/Business';
import RequestResturant from './containers/RequestResturant';
import UserProfile from './containers/UserControl/UserProfile';
import ForgotPassword from './containers/UserControl/ForgotPassword';
import ResetPassword from './containers/UserControl/ResetPassword';
import MerchantForgotPassword from './components/MerchantPortal/ForgotPassword';
import MerchantResetPassword from './components/MerchantPortal/ResetPassword';
import About from './containers/About';
import PrivacyPolicy from './containers/PrivacyPolicy';
import Terms from './containers/TermsConditions';
import Contact from './containers/ContactUs';
import ResturantList from './containers/RestaurantList';

function App() {
  return (
    <BrowserRouter>
     <div className="App">
        <Layout>
           <Route path="/" exact component={Home}/>
           <Route path="/search/:postCode" exact component={SearchResult}/>
           <Route path="/restaurant/:resturantId" exact component={Resturant}/>
           <Route path="/admin" component={Admin}/>
           <Route path="/merchant-portal" component={MerchantPortal}/>
           <Route path="/user/signin" exact component={SignIn}/>
           <Route path="/user/signup" exact component={SignUp}/>
           <Route path="/user/forgot-password" exact component={ForgotPassword} />
           <Route path="/checkout" exact component={CheckOut}/>
           <Route path="/business" exact component={Business}/>
           <Route path="/restaurants" exact component={RequestResturant}/>
           <Route path="/user-profile" component={UserProfile}/>
           <Route path="/user/reset-password" exact component={ResetPassword}/>
           <Route path="/merchant/forgot-password" exact component={MerchantForgotPassword}/>
           <Route path="/merchant/reset-password" exact component={MerchantResetPassword}/>
           <Route path="/about" exact component={About}/>
           <Route path="/privacy-policy" exact component={PrivacyPolicy}/>
           <Route path="/terms-conditions" exact component={Terms}/>
           <Route path="/contact" exact component={Contact}/>
           <Route path="/list" exact component={ResturantList}/>
        </Layout>
     </div>
    </BrowserRouter>
  );
}

export default App;
