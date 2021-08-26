import React from 'react';

import '../../styles/Modals.scss';
import BackDrop from './BackDrop';

const menuModal = (props)=>{
    return(
        <div>
            <BackDrop show={props.show} clicked={props.closeHandler} />
            <div
            className="menu-user-modal"
            style={{
                transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.show ? '1': '0'
        
            }}
            >
                {props.children}
     </div>
    </div>
    );
};

export default menuModal;