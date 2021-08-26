import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { url } from '../../../utils/utils';

import User from './BlockUser';
import Spinner from '../../Modals/SpinnerModal';

function BlockUsers(){
    let allUsers;
    const [users, setUsers] = useState([]);
    const [complete, setComplete] = useState(false);
    const [modal, setModal] = useState(false);
    const [blockId, setBlockId] = useState(null);
    const [spinner, setSpinner] = useState(false);

    const unBlockHandler = async(id) =>{
        try{
            setSpinner(true);
            await axios.post(
                url,
               {
                   query:`
                     mutation{
                        activateBlockUser(userId:"${id}"){
                             _id
                         }
                     }
                   `
               }
            );
            const newUsers = users.filter((user)=>{
                return id !== user._id
            });
            setUsers(newUsers);
            setSpinner(false);
        }catch(error){
            throw error;
        }
    }
    const fetchUsers = async()=>{
        try {
            const users = await axios.post(
                url,
                {
                    query:`
                      query{
                         blockUsers{
                             _id
                             email
                             banned
                             verified
                             orders
                         }
                      }
                    `
                }
            );
            console.log(users);
            setUsers(users.data.data.blockUsers);
            setComplete(true);
        } catch (error) {
            throw error;
        }
    };
    if(complete){
        if(users.length > 0){
            allUsers = users.map(user=>{
                return<User
                         key={user._id}
                         id={user._id}
                         user={user}
                         unBlockHandler={unBlockHandler}
                       />
            })
        }else{
            allUsers = <p>No users found.</p>
        }
    }else{
            allUsers = <p>Loading...</p>
  }
    useEffect(()=>{
        fetchUsers();
    },[])
    return(
        <div className="admin-all-usres">
            <Spinner show={spinner}/>
            {allUsers}
        </div>
    );
};

export default BlockUsers;