import React from 'react';

import '../../styles/Skeleton.scss';

const foodsSkeleton = ()=>{
    return(
        <div className="foods-skeleton">
            <div className="skeleton-food">
              <div className="skeleton-body"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title2"></div>
            </div>
            <div className="skeleton-food">
              <div className="skeleton-body"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title2"></div>
            </div>
            <div className="skeleton-food">
              <div className="skeleton-body"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title2"></div>
            </div>
            <div className="skeleton-food">
              <div className="skeleton-body"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title2"></div>
            </div>
            <div className="skeleton-food">
              <div className="skeleton-body"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title2"></div>
            </div>
            <div className="skeleton-food">
              <div className="skeleton-body"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title2"></div>
            </div>
           
        </div>
    );
};

export default foodsSkeleton;