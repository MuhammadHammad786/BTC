import React, { useState, Component } from "react";

import axios from "axios";
import { Redirect , withRouter } from "react-router-dom";
import { url } from "../utils/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/resturantView.scss";
import "../styles/restaurantList.scss";
import Skeleton from "../components/Skeleton/Resturant";
import Footer from '../components/Footer';
import resturant from "../components/Skeleton/Resturant";
import HomeNav from "../components/Navigations/HomeNav";


class RestaurantList extends Component {
  constructor(props){
    super(props)
  }
  state = {
    resturant: [],
    spinner: false,
    redirect : null,
  };

  
  componentDidMount = async () => {
    let pos = {
      lat:0,  
      long:0 
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }

        console.log('pos' , pos)
     
      });
    }
    window.scrollTo(0, 0);
    this.setState({
      spinner:true
    })
  if(this.state.resturant == '')
  {
    setTimeout(()=>{
      const fetch =  axios.post(url, {
        query: `
              query{
                  nearbyResturant(location:{
                  type:"Point"
                  coordinates:[
                    ${pos.long},
                    ${pos.lat}]
                  }){
                    _id
                    name
                    intro
                    business_hour {
                      open
                      close
                    }
                    location {
                      coordinates
                      type
                    }
                    fetchFoods {
                      name
                    }
                  }
              }
                `,
      }).then(data => {
        this.setState({
          resturant:data.data.data.nearbyResturant
        })
        console.log('state', this.state.resturant)
      });
    }, 1000)
  }
    this.setState({
      spinner:false
    })
    
    
    
  };
  RedirectHandler(id){
    console.log('id ->' , id)
    // this.setState({
    //   redirect: <Redirect to={"/restaurant/"+id}/>
    // })
    this.props.history.push(`/restaurant/${id}`)
    
  }
  render() {
    let {resturant} = this.state  
    console.log(this.state.resturant)
    return(
      <>
      <div className="main-nav-bar">
        <HomeNav />
      </div>
        <div className="resturant-content">
            <div className="resturant-container">
          {
            resturant.map((e , i) => {
              return (
                
                <div className="resturant-profile">
                    {e.cover_image ? (
                    <img src={e.cover_image} alt="cover-image" />
                    ) : (
                    <img
                        src="https://images.unsplash.com/photo-1428515613728-6b4607e44363?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80"
                        alt="name"
                    />
                    )}
                    <div className="restu-details">
                    <h2>{e.name}</h2>
                    <p>{e.intro}</p>
                    <p>
                        <span>
                        <FontAwesomeIcon icon={faDotCircle} /> OPEN{" "}
                        </span>
                            {e.business_hour.open} {""} - {""}{e.business_hour.close} 
                    </p>
                        <button
                        className="chefProfile-link"
                        onClick={(event) =>{this.RedirectHandler(e._id)}}
                        >
                        Details
                        </button>
                    </div>
                </div>
              ) 
            })
          } 
            </div>
            <div style={{"display": "inline-block","width": "100%"}}>
                <Footer/>
            </div>
        </div>
    
    </>
    )

    } 

   
  }


export default withRouter(RestaurantList);
