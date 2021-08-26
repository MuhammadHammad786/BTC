import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { url } from "../../utils/utils";

import AddFood from "../Modals/FoodViewModal";

const UPLOAD_FILE = gql`
  mutation uploadToAws($file: Upload!) {
    uploadToAws(file: $file) {
      url
    }
  }
`;

function ChefProfile() {
  const [addFoodModal, setAddFoodModal] = useState(false);
  const [image, setImage] = useState("");
  const [imageUpload, setImageUpload] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [resturant, setResturant] = useState([]);
  const [complete, setComplete] = useState(false);
  const [selectedChefId , setselectedChefId] = useState(0);
  // const []

  const addFoodModalHandler = () => {
    if (addFoodModal) {
      setAddFoodModal(!addFoodModal);
    } else {
      setAddFoodModal(!addFoodModal);
    }
  };
  const nameHandler = (e) => {
    setName(e.target.value);
  };

  const descriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setImage("");
    setImageUpload(true);
    const file = e.target.files[0];
    uploadToAws({ variables: { file } });
  };
  const [uploadToAws] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => {
      console.log(data);
      setImage(data.uploadToAws.url);
      setImageUpload(false);
      // const allImages=[];
      // allImages.push(data.uploadToAws.url);
      // setImages(allImages);
    },
  });
  let imageContainer;
  if (!image) {
    if (!image && imageUpload) {
      imageContainer = <div className="default-image-upload"></div>;
    } else {
      imageContainer = (
        <div className="image-box">
          <h3>Upload chef image</h3>
          <input type="file" accept=".png,.jpg" onChange={handleFileChange} />
        </div>
      );
    }
  } else {
    imageContainer = (
      <div className="image-box">
        <img src={image} alt="img" />
        <div>
          <input type="file" accept=".png,.jpg" onChange={handleFileChange} />
        </div>
      </div>
    );
  }
  
  const HandleSelected = async (id) => {
    console.log('id' , id)
    const setselect = await axios.post(url, {
        query:`
          mutation{
            setSelectedChef(resturantId:"${localStorage.merchantId}", chefId:"${id}"){
              _id
            }
          }
        
        `,
    });
    fetchResturant()
  }


  const chefAddHandler = async () => {
    try {
        console.log(image, name, description);
      if(name && description){
        // if(image && name && description){
        const chef = await axios.post(url, {
            query: `
                       mutation{
                           addChef(id:"${localStorage.merchantId}",chefName:"${name}", chefBio:"${description}", chefImage:"${image}"){
                            _id
                           chefName
                           chefBio
                           chefImage
                           }
                       }
                    `,
          });
          fetchResturant();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResturant = async(args, req) =>{
    try {
        const resturant1 = await axios.post(
             url,
             {
                 query:`
                    query{
                        resturant(resturantId:"${localStorage.merchantId}"){
                          selectedChefId
                           fetchChefs{
                             _id
                             chefName
                             chefBio
                             chefImage
                           }
                        }
                    }
                 `
             }
        );
        setResturant(resturant1.data.data.resturant.fetchChefs);
        setselectedChefId(resturant1.data.data.resturant.selectedChefId);
        setComplete(true);
        console.log("list chef ->",selectedChefId);
    } catch (error) {
        throw error;
    }
};
useEffect(()=>{
    fetchResturant()
},[]);

  

  return complete ? (
    <div className="chef-container">
      <AddFood show={addFoodModal} foodViewHandler={addFoodModalHandler}>
        <div className="add-food-header">
          <h3>Add chef profile</h3>
          <button className="modal-cancel-button" onClick={addFoodModalHandler}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="food-info-box">
          <div className="addfood-image-container">{imageContainer}</div>
          <div className="addfood-otherinfo">
            <p>Chef Name</p>
            <input
              onChange={nameHandler}
              value={name}
              type="text"
              placeholder="Enter chef name"
            />
            <p>Bio</p>
            <textarea
              onChange={descriptionHandler}
              value={description}
              type="text"
              placeholder="Write a short bio within 250 words"
            />

            <button onClick={chefAddHandler} className="addfood-button">
              Add chef profile
            </button>
          </div>
        </div>
      </AddFood>
      <div className="header-chef">
         <h3>Chef profile</h3>
         <button>Update</button>
      </div>
      <div className="add-chef-view">
        <button onClick={addFoodModalHandler}>Add chef profile</button>
      </div>
      <div className="row">
      {resturant.map((e) => {

      return(
        <div className="col-md-4 m-2">
          <div className="card" style={{width: '18rem'}}>
            {e.chefImage == null ? (
              <img src="https://images.unsplash.com/photo-1428515613728-6b4607e44363?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80"
              className="card-img-top" alt="..." />)
              : (<img src={e.chefImage} className="card-img-top"/>)
            }
            <div className="card-body">
              <h5 className="card-title">{e.chefName}</h5>
              <p className="card-text">{e.chefBio}</p>
              {
                e._id == selectedChefId ? (
                  <a href="javascript:void(0)" onClick={(event) => {HandleSelected(e._id)}} className="btn btn-success">Selected</a>
                ):(
                  <a href="javascript:void(0)" onClick={(event) => {HandleSelected(e._id)}} className="btn" style={{background:'rgb(153, 3, 40)' ,color:'white' ,borderColor:'1px solid rgb(153, 3, 40)'}}>Select to show</a>
                )
              }
            </div>
          </div>

        </div>
        )
        })
      }
      </div>
    </div>
  ): <p>Loading</p>;
}

export default ChefProfile;
