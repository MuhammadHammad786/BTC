import React from 'react';

import '../styles/resturantView.scss';

const food = (props)=>{
    let title;
    if(props.title.length > 40){
        title = props.title.substring(1, 38) + "...";
    }else{
        title = props.title
    }
   return(
       <div onClick={()=>props.modalHandler(props.id)} className="food-view">
           <div className="food-image-container">
              <img src={props.imageurl} alt={props.title}/>
           </div>
           <div className="food-details">
               <h4>{title}</h4>
               <p>{props.poundSign} {props.price}</p>
           </div>
       </div>
   );
};

export default food;