import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPoundSign } from '@fortawesome/free-solid-svg-icons';

const image= "https://images.unsplash.com/photo-1428515613728-6b4607e44363?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80";

const activeResturant = (props) =>{
    let cover;
    props.cover ? cover=<img src={props.cover} alt={props.name}/> : cover=<img src={image} alt={props.name}/>
    return(
        <div className="active-resturant" onClick={()=>{props.viewHandler(props.id)}}>
            <div className="image-container">
                {cover}
            </div>
            <h4>{props.name}</h4>
            <p>Email: {props.email}</p>
            <p>Contact number: {props.phone}</p>
            <p>Post code: {props.post_code}</p>
            <p>Current balance: <FontAwesomeIcon icon={faPoundSign}/> {props.current_balance}</p>
            <button>View details</button>
        </div>
    );
};

export default activeResturant;