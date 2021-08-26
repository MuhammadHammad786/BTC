import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPoundSign } from '@fortawesome/free-solid-svg-icons';

const food = (props)=>{
    let title;
    if(props.title.length > 32){
        title = props.title.substring(0, 32) + ".."
    }else{
        title = props.title
    }
    return(
        <div className="admin-food">
            <img src={props.imageurl[0]} alt="name"/>
            <div className="adminfood-details">
               <h4>{title}</h4>
               <p><FontAwesomeIcon icon={faPoundSign}/> {props.price}</p>
               <p>{props.offer}% offer</p>
               <p>{props.sale} sale</p>
               <button onClick={()=>props.updateFoodModalHandler(props.id, props.foodId)} className="food-update-button"><FontAwesomeIcon icon={faEdit}/> Edit</button>
               <button onClick={()=>props.deleteFoodModalHandler(props.id, props.foodId)} className="food-delete-button"><FontAwesomeIcon icon={faTrash}/> Delete</button>
            </div>
        </div>
    );
};

export default food;