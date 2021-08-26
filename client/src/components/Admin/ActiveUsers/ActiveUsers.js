import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { url } from '../../../utils/utils';

import User from './ActiveUser';
import BlockModal from '../../Modals/OtherModal';
import Spinner from '../../Modals/SpinnerModal';

function ActiveUsers(){
    let allUsers;
    const [users, setUsers] = useState([]);
    const [complete, setComplete] = useState(false);
    const [modal, setModal] = useState(false);
    const [blockId, setBlockId] = useState(null);
    const [spinner, setSpinner] = useState(false);

    const blockModalShowHandler = (id)=>{
       setModal(true);
       setBlockId(id);
    }

    const blockModalHideHandler = ()=>{
        setModal(false);
        setBlockId(null);
    }
    const blockHandler = async() =>{
        try{
            setSpinner(true);
            setModal(false);
            await axios.post(
                url,
               {
                   query:`
                     mutation{
                         blockUser(userId:"${blockId}"){
                             _id
                         }
                     }
                   `
               }
            );
            const newUsers = users.filter((user)=>{
                return blockId !== user._id
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
                         allUsers{
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
            setUsers(users.data.data.allUsers);
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
                         blockShow={blockModalShowHandler}
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
            <BlockModal show={modal}>
                <p>Are your sure , want to block this user ?</p>
                <button onClick={blockModalHideHandler} className="user-block-cancel">No</button>
                <button onClick={blockHandler} className="user-block-yes">Yes</button>
            </BlockModal>
            {allUsers}
        </div>
    );
};

export default ActiveUsers;