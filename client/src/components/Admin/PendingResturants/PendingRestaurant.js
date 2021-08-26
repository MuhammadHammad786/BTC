import React from 'react';

const pendingResturant = (props) =>{
   return(
       <div className="pending-resturant">
           <h4>Name: {props.resturant.name}</h4>
           <p>Email: {props.resturant.email}</p>
           <p>Contact number: {props.resturant.contact_number}</p>
           <p>Post code: {props.resturant.post_code}</p>
           <button className="pending-cancel-button" onClick={() => {props.cancelModaShowHandler(props.id, props.resturantId)}}>Cancel</button>
           <button className="pending-onboard-button" onClick={()=>{props.onBoardHandler(props.resturantId, props.id)}}>On board</button>
       </div>
   );
};

export default pendingResturant;