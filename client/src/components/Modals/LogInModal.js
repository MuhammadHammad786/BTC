import React from 'react';

import '../../styles/Modals.scss';
import BackDrop from './BackDrop2';

const foodViewModal = (props) => (
    <div>
      <BackDrop show={!props.show} />
      <div
      className="LoginModal"
      style={{
         transform: !props.show ? 'translateY(0)' : 'translateY(-100vh)',
         opacity: !props.show ? '1': '0'
 
     }}
      >
         {props.children}
     </div>
    </div>
 );

export default foodViewModal;