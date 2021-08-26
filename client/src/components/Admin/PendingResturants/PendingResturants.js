import React, { useState, useEffect} from 'react';

import axios from 'axios';
import { url } from '../../../utils/utils';

import Resturant from './PendingRestaurant';
import Spinner from '../../Modals/SpinnerModal';
import CancelModal from '../../Modals/DeleteFoodModal';

function PendingResturants(){
    const[resturants, setResturants] = useState([]);
    const[complete, setComplete] = useState(false);
    const[spinner, setSpinner] = useState(false);
    const[delId, setDelId] = useState(null);
    const[delResturant, setDelResturant] = useState(null);
    const[cancelModal, setCancelModal] = useState(false);

    let getAll;
    
    const fetchResturants = async()=>{
        try{
            const resturantsAll = await axios.post(
               url,
               {
                   query:`
                      query{
                          pendingResturants{
                              _id
                              name
                              email
                              contact_number
                              post_code
                          }
                      }
                   `
               }
            );
            setResturants(resturantsAll.data.data.pendingResturants);
            setComplete(true);

        }catch(error){
            throw error;
        }
    }

    const onBoardHandler = async(resturantId,delId)=>{
        try {
            setSpinner(true);
            const onBoard = await axios.post(
                url,
                {
                    query:`
                       mutation{
                          onBoardResturant(resturantId:"${resturantId}"){
                            _id
                            name
                            email
                            contact_number
                            post_code
                          }
                       }
                    `
                }
            );
           const new_resturants = resturants.filter((resturant,id)=>{
               return id !== delId
           });
            setResturants(new_resturants);
            setSpinner(false);
        } catch (error) {
            throw error;
        }
    }
  const cancelModaShowHandler = (delId, delResturant) =>{
        setDelId(delId);
        setDelResturant(delResturant);
        setCancelModal(true);
  }
 const cancelModalHideHandler = ()=>{
      setDelId(null);
      setDelResturant(null);
      setCancelModal(false)
 }
  const requestCancelHandler = async()=>{
       setSpinner(true);
       setCancelModal(false);
       const resturant = await axios.post(
           url,
           {
               query:`
                  mutation{
                     cancelResturantRequest(resturantId:"${delResturant}"){
                         _id
                         name
                     }
                  }
               `
           }
       );
       const new_resturants = resturants.filter((resturant,id)=>{
        return id !== delId
     });
     setResturants(new_resturants);
     setDelId(null);
     setDelResturant(null);
     setSpinner(false);

  }
    if(complete){
        if(resturants.length>0){
            getAll = resturants.map((resturant, id)=>{
                return<Resturant
                         key={resturant._id}
                         id={id}
                         resturantId={resturant._id}
                         resturant={resturant}
                         onBoardHandler={onBoardHandler}
                         cancelModaShowHandler={cancelModaShowHandler}
                      />
            });
        }else{
            getAll = <div>
                <p>No resturants request.</p>
            </div>
        }
       
    }else{
        getAll = <p>Loading...</p>
    }

    useEffect(()=>{
        fetchResturants();
     }, []);
   
   return(
       <div className="pending-resturants">
           <Spinner show={spinner}/>
           <CancelModal show={cancelModal} foodViewHandler={cancelModalHideHandler}>
                 <div className="cancel-request">
                   <p>Are you sure, want to cancel this request ?</p>
                    <button onClick={cancelModalHideHandler}>No</button>
                    <button onClick={requestCancelHandler} className="cancel-request-yes">Yes</button>
                  </div>
           </CancelModal>
           {getAll}
       </div>
   );
};

export default PendingResturants;