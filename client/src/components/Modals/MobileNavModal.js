import React from 'react';

import '../../styles/Modals.scss';
import BackDrop from './BackDrop';

const mobileNavModal = (props) => (
    <div>
      <BackDrop show={props.show} clicked={props.navShowHandler} />
      <div
      className="MobileNavModal"
      style={{
         transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
         opacity: props.show ? '1': '0'
 
     }}
      >
         {props.children}
     </div>
    </div>
 );

export default mobileNavModal;