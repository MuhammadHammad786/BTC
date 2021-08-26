import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { url } from '../../../utils/utils';

import Resturant from './BannedResturant';
import Spinner from '../../Modals/SpinnerModal';

function BannedResturants(){
    let getAll;
    const [resturants, setResturants] = useState([]);
    const [complete, setComplete] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const fetchResturants = async()=>{
      try{
          const resturantsAll = await axios.post(
             url,
             {
                 query:`
                    query{
                        bannedResturants{
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
          console.log(resturantsAll);
          setResturants(resturantsAll.data.data.bannedResturants);
          setComplete(true);

      }catch(error){
          throw error;
      }
  };
  const onBoardHandler = async(resturantId, id)=>{
       try {
           setSpinner(true);
           await axios.post(
             url,
             {
               query:`
                  mutation{
                    activateBannedResturant(resturantId:"${resturantId}"){
                      _id
                    }
                  }
               `
             }
           );
           const allResturants = resturants.filter((resturant, id) => {
             return resturant._id !== resturantId
           });
           setResturants(allResturants);
           setSpinner(false);
       } catch (error) {
         
       }
  }
 if(complete){
  if(resturants.length > 0){
    getAll = resturants.map((resturant, id)=>{
      return<Resturant
               key={resturant._id}
               id={id}
               resturantId={resturant._id}
               resturant={resturant}
               onBoardHandler={onBoardHandler}
            />
  });
  }else{
    getAll = <p>No banned resturants found.</p>
  }
}else{
  getAll = <p>Loading...</p>
}

 useEffect(()=>{
   fetchResturants();
 }, [])
  
 
    return(
      <div className="banned-resturants">
        <Spinner show={spinner}/>
        {getAll}
      </div>
    );
};

export default BannedResturants;