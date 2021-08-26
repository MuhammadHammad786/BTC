import React from 'react';

import Foods from './Foods';
import '../../styles/Skeleton.scss';

const resturant = () =>{
    return(
        <div className="resturant-skeleton">
            <div className="resturant-skeleton-left">
                <div className="resturant-skeleton-profile"></div>
                <div className="resturant-skeleton-profile-1"></div>
                <div className="resturant-skeleton-profile-2"></div>
                <div className="resturant-skeleton-foods">
                  <Foods />
                </div>
            </div>
            <div className="resturant-skeleton-right"></div>
           
        </div>
    )
};

export default resturant;