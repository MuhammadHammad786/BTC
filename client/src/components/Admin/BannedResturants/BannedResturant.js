import React from 'react';

const bannedResturant = (props) =>{
   return(
       <div className="banned-resturant">
           <h4>Name: {props.resturant.name}</h4>
           <p>Email: {props.resturant.email}</p>
           <p>Contact number: {props.resturant.contact_number}</p>
           <p>Post code: {props.resturant.post_code}</p>
           <button className="pending-onboard-button" onClick={()=>{props.onBoardHandler(props.resturantId, props.id)}}>Activate</button>
       </div>
   );
};

export default bannedResturant;