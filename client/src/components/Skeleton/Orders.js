import React from 'react';

import '../../styles/Skeleton.scss';

const orders = () =>{
    return(
        <div className="orders-skeleton">
            <div className="order-skeleton"></div>
            <div className="order-skeleton"></div>
            <div className="order-skeleton"></div>
            <div className="order-skeleton"></div>
        </div>
    );
};

export default orders;