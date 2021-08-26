import React from 'react';

import '../../styles/Modals.scss';

const backdrop = (props) => (
    props.show ? <div className="Backdrop2" onClick={props.clicked}>
    </div> : null
);

export default backdrop;