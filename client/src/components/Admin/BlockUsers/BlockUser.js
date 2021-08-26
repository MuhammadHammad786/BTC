import React from 'react';

const user = (props)=>{
    return(
        <div className="admin-user-view" >
            <p>Email: {props.user.email}</p>
            <p>Orders activity : {props.user.orders.length}</p>
            <button onClick={()=>{props.unBlockHandler(props.id)}}>Unblock</button>
        </div>
    );
};
export default user;