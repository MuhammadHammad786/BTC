import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';
import PickedOrders from './PickedOrders';

const orders = (props)=>{
   return(
       <div className="merchant-orders">
           <ul className="merchant-orders-nav">
               <li>
                   <NavLink activeStyle={{borderBottom:"2px solid rgb(16, 211, 218)"}} exact to="/merchant-portal/orders">Pending orders</NavLink>
               </li>
               <li>
                   <NavLink activeStyle={{borderBottom:"2px solid rgb(16, 211, 218)"}} exact to="/merchant-portal/orders/confirmed">Confirmed orders</NavLink>
               </li>
               <li>
                   <NavLink activeStyle={{borderBottom:"2px solid rgb(16, 211, 218)"}} exact to="/merchant-portal/orders/picked">Pickup orders</NavLink>
               </li>
           </ul>
           <div className="merchant-orders-body">
               <Route path="/merchant-portal/orders" exact component={PendingOrders}/>
               <Route path="/merchant-portal/orders/confirmed" exact component={ConfirmedOrders}/>
               <Route path="/merchant-portal/orders/picked" exact component={PickedOrders}/>
           </div>
       </div>
   );
};

export default orders;















