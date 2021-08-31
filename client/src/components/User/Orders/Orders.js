import React from 'react';

import { NavLink, Route } from 'react-router-dom';

import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';
import PickupOrders from './PickupOrders';

function Orders(){
    return(
        <div className="user-orders-section">
             <ul className="user-orders-nav">
               <li>
                   <NavLink activeStyle={{borderBottom:"3px solid #990328"}} exact to="/user-profile/orders">Pending orders</NavLink>
               </li>
               <li>
                   <NavLink activeStyle={{borderBottom:"3px solid #990328"}} exact to="/user-profile/orders/confirmed">Confirmed orders</NavLink>
               </li>
               <li>
                   <NavLink activeStyle={{borderBottom:"3px solid #990328"}} exact to="/user-profile/orders/picked">Pickup orders</NavLink>
               </li>
           </ul>
           <div className="user-orders-body">
                <Route  exact path="/user-profile/orders" component={PendingOrders}/>
                <Route  exact path="/user-profile/orders/confirmed" component={ConfirmedOrders}/>
                <Route  exact path="/user-profile/orders/picked" component={PickupOrders}/>
           </div>
        </div>
    );
};

export default Orders;