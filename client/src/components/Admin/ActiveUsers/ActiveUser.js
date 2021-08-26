import React from 'react';

const user = (props)=>{
    return(
        <div className="admin-user-view" onClick={()=>{props.blockShow(props.id)}}>
            <p>Email: {props.user.email}</p>
            <p>Orders activity : {props.user.orders.length}</p>
            <button>Block</button>
        </div>
    );
};
export default user;