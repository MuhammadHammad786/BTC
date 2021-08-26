import React, { useState, useEffect} from 'react';
import { useMutation, gql} from '@apollo/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import { url } from '../../utils/utils';

import Food from './PortalFood';

import AddFood from '../Modals/FoodViewModal';
import UpdateFood from '../Modals/UpdateFoodModal';
import DeleteFood from '../Modals/DeleteFoodModal';
import Skeleton from '../Skeleton/Foods';
import Spinner from '../Modals/SpinnerModal';

const UPLOAD_FILE = gql`
mutation uploadToAws($file: Upload!){
    uploadToAws(file: $file){
    url
  },
  
}
`;

function Foods(props){
    const [addFoodModal, setAddFoodModal] = useState(false);
    const [updateFoodModal, setUpdateFoodModal] = useState(false);
    const [deleteFoodModal ,setDeleteFoodModal] = useState(false);
    const [resturantAll, setResturant] = useState([]);
    const [foods, setFoods] = useState([]);
    const [complete, setComplete] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [imageUpload, setImageUpload] = useState(false);

    //Add food 
    const [image, setImage] = useState('');
    const[images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [offer, setOffer] = useState(0);

    //delete food
    const [delIndex, setDelIndex] = useState(null);
    const [delId, setDelId] = useState(null);

    //update food
    const [upIndex, setUpIndex] = useState(null);
    const [upId, setUpId] = useState(null);

    const addFoodModalHandler = ()=> {
        if(addFoodModal){
            setAddFoodModal(!addFoodModal);
            
        }else{
            setAddFoodModal(!addFoodModal);
        }
       
    }
    const updateFoodModalHandler = (id, foodId)=>{
        setUpIndex(id);
        setUpId(foodId);
        setImage(foods[id].images[0]);
        setName(foods[id].name);
        setDescription(foods[id].description);
        setPrice(foods[id].price);
        setOffer(foods[id].offer);
        setUpdateFoodModal(!updateFoodModal);
    }
    const updateFoodHandler = async()=>{
        setUpdateFoodModal(!updateFoodModal);
        setSpinner(true);
        const updateFood = await axios.post(
            url,
            {
                query:`
                   mutation{
                       updateFood(foodInput:{
                        foodId:"${upId}",
                        name:"${name}",
                        description:"${description}",
                        price:${price},
                        offer:${offer}
                        images:["${image}"],
                           }){
                        _id
                        name
                        price
                        images
                        description
                        offer
                        sale
                       }
                   }
                `
            }
        );
        setName('');
        setDescription('');
        setPrice('');
        setOffer(0);
        setImage('');

        setFoods(updateFood.data.data.updateFood);
        setSpinner(false);
        
    } 
    const updateModalClose= ()=>{
        setName('');
        setDescription('');
        setPrice('');
        setOffer(0);
        setImage('');
        setUpdateFoodModal(false);
    }
    const deleteFoodModalHandler = (id, foodId)=>{
        setDelIndex(id);
        setDelId(foodId);
        setDeleteFoodModal(!deleteFoodModal);
    }
    const deleteFoodModalClose= ()=>{
        setDeleteFoodModal(false);
    }
   
    let foodsAll;
    if(complete){
        if(foods.length > 0){
            foodsAll = foods.map((food, id)=>{
                return<Food
                         id={id}
                         foodId={food._id}
                         key={food._id}
                         updateFoodModalHandler={updateFoodModalHandler}
                         deleteFoodModalHandler={deleteFoodModalHandler}
                         title={food.name}
                         description={food.description}
                         price={food.price}
                         imageurl={food.images}
                         offer={food.offer}
                         sale={food.sale}
                      />
            });
        }else{
            foodsAll = <div className="no-foods-yet">
                <p>You have no food. Add foods and reach more orders.</p>
            </div>
        }
    }else{
        foodsAll = <Skeleton />
    }
    

    const handleFileChange = e => {
        setImage('');
        setImageUpload(true);
        const file = e.target.files[0];
        uploadToAws({ variables: { file}})
    }
    const [uploadToAws] = useMutation(UPLOAD_FILE, {
        onCompleted: (data) =>{
            console.log(data);
            setImage(data.uploadToAws.url);
            setImageUpload(false);
            const allImages=[];
            allImages.push(data.uploadToAws.url);
            setImages(allImages);
        } 
    });
    const nameHandler = (e) =>{
        setName(e.target.value);
    }
    const priceHandler = (e) =>{
        setPrice(e.target.value);
    }
    const descriptionHandler = (e)=>{
        setDescription(e.target.value);
    }
    const offerHandler = (e) =>{
        setOffer(e.target.value);
    }
    
    const addFoodHandler = async()=>{
        setAddFoodModal(false);
        setSpinner(true);
        const food = await axios.post(
            url,
            {
                query:`
                   mutation{
                       addFood(foodInput:{
                        name:"${name}",
                        description:"${description}",
                        price:${price},
                        images:["${image}"],
                        offer:${offer},
                        resturant:"${localStorage.merchantId}"
                           }){
                        _id
                        name
                        price
                        images
                        description
                        offer
                        sale
                       }
                   }
                `
            }
        );

        setName('');
        setDescription('');
        setPrice('');
        setOffer('');
        setImage('');
        setFoods(food.data.data.addFood);
        setSpinner(false);
       
    };
    const deleteFoodHandler = async()=>{
        setSpinner(true);
        setDeleteFoodModal(!deleteFoodModal);
        const newFoods = foods.filter((food, id)=>{
            return id !== delIndex
        });
        setFoods(newFoods);
        setSpinner(false);
        const deleteFood = await axios.post(
            url, 
            {
              query:`
                 mutation{
                     deleteFood(foodId:"${delId}"){
                         _id
                         name
                     }
                 }
              `
            }
            
        );
        setDelIndex(null);
        setDelId(null);
        console.log(deleteFood);
   }
    const resturant = async() =>{
          const fetch = await axios.post(
              url,
             { 
                 query:`
                    query{
                        resturant(resturantId:"${localStorage.merchantId}"){
                            name
                            fetchFoods{
                                _id
                                name
                                price
                                images
                                description
                                offer
                                sale
                            }
                        }
                    }
                `
            }
          );
          console.log(fetch);
          setFoods(fetch.data.data.resturant.fetchFoods);
          setComplete(true);
    }
        let imageContainer;
        if(!image){
            if(!image && imageUpload){
                imageContainer = <div className="default-image-upload"></div>
            }else{
                imageContainer = <div className="image-box"> 
                <h3>Upload food image</h3>
                <input type="file" accept=".png,.jpg" onChange={handleFileChange}/>
             </div>;
            }
            
        }else{
            imageContainer = <div className="image-box">
                                <img src={image} alt="img"/>
                                <div>
                                    <input type="file" accept=".png,.jpg" onChange={handleFileChange}/>
                                </div>
                            </div>;
        }

    useEffect(()=> {resturant()}, []);

    return(
        <div className="foods-section">
            <Spinner show={spinner}/>
            <AddFood show={addFoodModal} foodViewHandler={addFoodModalHandler}>
                <div className="add-food-header">
                    <h3>Add new food</h3>
                    <button  className="modal-cancel-button" onClick={addFoodModalHandler}><FontAwesomeIcon icon={faTimes}/></button>
                </div>
                <div className="food-info-box">
                    <div className="addfood-image-container">
                    {imageContainer}
                    </div>
                    <div className="addfood-otherinfo">
                        <p>Food name</p>
                        <input onChange={nameHandler} value={name} type="text" placeholder="name"/>
                        <p>Food description</p>
                        <textarea onChange={descriptionHandler} value={description} type="text" placeholder="Write a short description about food within 250 words"/>
                        <p>Price</p>
                        <input onChange={priceHandler} type="number" value={price} placeholder="Price"/>
                        <p>Offer as percentage</p>
                        <input onChange={offerHandler} type="number" value={offer} placeholder="0"/>
                        <button onClick={addFoodHandler} className="addfood-button">Add food</button> 
                    </div>
                </div>
                
            </AddFood>
            <UpdateFood show={updateFoodModal} foodViewHandler={updateModalClose}>
                 <div className="add-food-header">
                    <h3>Update food</h3>
                    <button onClick={updateModalClose} className="modal-cancel-button"><FontAwesomeIcon icon={faTimes}/></button>
                 </div>
                <div className="food-info-box">
                <div className="addfood-image-container">
                      <div className="image-box">
                           {
                               image ? 
                               <img src={image} alt="img"/>:
                               <div className="default-image-upload"></div>
                           }
                           <div>
                              <input type="file" accept=".png,.jpg" onChange={handleFileChange}/>
                           </div>
                     </div>
                </div>
                <div className="addfood-otherinfo">
                        <p>Food name</p>
                        <input onChange={nameHandler} value={name} type="text" placeholder="name"/>
                        <p>Food description</p>
                        <textarea onChange={descriptionHandler} value={description} type="text" placeholder="Write a short description about food within 250 words"/>
                        <p>Price</p>
                        <input onChange={priceHandler} type="number" value={price} placeholder="Price"/>
                        <p>Offer as percentage</p>
                        <input onChange={offerHandler} type="number" value={offer} placeholder="0"/>
                        <button onClick={updateFoodHandler} className="addfood-button">Update food</button> 
                    </div>

                </div>
            </UpdateFood>
            <DeleteFood show={deleteFoodModal} foodViewHandler={deleteFoodModalClose} >
                <p style={{fontWeight:"500", margin:"5px"}}>Are you sure delete this item permanently ?</p>
                <button onClick={deleteFoodModalClose} className="modal-food-cancelbutton">Cancel</button>
                <button onClick={deleteFoodHandler} className="delete-food-button">Delete</button>
            </DeleteFood>
            <div className="foods-section-header">
                <h3>All Foods</h3>
                <button onClick={addFoodModalHandler}>Add new food</button>
            </div>
             <div className="all-available-foods">
               {foodsAll}
             </div>
        
        </div>
    );
};

export default Foods;