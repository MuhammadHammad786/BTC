import React from 'react';

import '../../styles/resturantView.scss';

const backdrop = (props) => (
    props.show ? <div className="Backdrop" onClick={props.clicked}>
    </div> : null
);

export default backdrop;