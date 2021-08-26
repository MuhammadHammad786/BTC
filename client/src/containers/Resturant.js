import React, { useState, Component } from "react";

import axios from "axios";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import * as actionTypes from "../store/actions/actionTypes";
import { url } from "../utils/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faPoundSign,
  faTimes,
  faPlus,
  faMinus,
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";

import "../styles/resturantView.scss";

import Skeleton from "../components/Skeleton/Resturant";
import Food from "../components/Food";
import Cart from "../components/Cart";
import FoodViewModal from "../components/Modals/FoodViewModal";
import MobileCartViewModal from "../components/Modals/MobileCartViewModal";
import Navigation from "../components/Navigations/HomeNav";
import ChefModal from "../components/Modals/ChefModal";
import Footer from '../components/Footer';


class Resturant extends Component {
  
  state = {
    modalShow: false,
    mobileCart: false,
    resturant: {},
    fetchChef:{},
    selectedChef:{},
    complete: false,
    viewFood: 0,
    foodQuantity: 1,
    cartItems: [],
    redirect: null,
    chef: false,
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    const fetch = await axios.post(url, {
      query: `
                  query{
                      resturant(resturantId:"${this.props.match.params.resturantId}"){
                          _id
                          name
                          cover_image
                          intro
                          email
                          selectedChefId
                          fetchChefs{
                            _id
                            chefName
                            chefBio
                            chefImage
                          }
                          business_hour{
                              open
                              close
                          }
                          fetchFoods{
                              _id
                              name
                              price
                              images
                              description
                          }
                      }
                  }
              `,
    });
    console.log(fetch);

    if (localStorage.cart) {
      if (localStorage.resturant) {
        if (localStorage.resturant !== fetch.data.data.resturant._id) {
          localStorage.removeItem("cart");
        } else {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          this.setState({
            cartItems: cart,
          });
        }
      }
    }
    localStorage.setItem("resturant", fetch.data.data.resturant._id);
    
    this.setState({
      resturant: fetch.data.data.resturant,
      fetchChef: fetch.data.data.resturant.fetchChefs,
      complete: true,
    });
     let result = this.state.fetchChef.find((e,i) => {
      if(e._id == this.state.resturant.selectedChefId)
        return true
    })
    this.setState({
      selectedChef: result
    })
  };
  timeSetHandler = (time) => {
    const t = parseInt(time.substring(0, 2));
    if (t > 12) {
      return `${t - 12 + time.substring(2, 5)} PM`;
    } else {
      return `${t + time.substring(2, 5)} AM`;
    }
  };
  modalHandler = (id) => {
    this.setState({
      viewFood: id,
      foodQuantity: 1,
      modalShow: !this.state.modalShow,
    });
  };

  chefHandler = () => {
    this.setState({
      chef: !this.state.chef,
    });
  };

  modalCancelHandler = () => {
    this.setState({
      modalShow: false,
    });
  };
  mobileCartViewHandler = () => {
    this.setState({
      mobileCart: !this.state.mobileCart,
    });
  };
  foodQntIncrHandler = () => {
    this.setState({
      foodQuantity: this.state.foodQuantity + 1,
    });
  };
  foodQntDcrHandler = () => {
    if (this.state.foodQuantity > 1) {
      this.setState({
        foodQuantity: this.state.foodQuantity - 1,
      });
    }
  };

  addToCartHandler = () => {
    if (localStorage.cart) {
      const get = JSON.parse(localStorage.getItem("cart") || "[]");
      const cart = get;

      const cartItem = {
        itemId: this.state.resturant.fetchFoods[this.state.viewFood]._id,
        quantity: this.state.foodQuantity,
        price: this.state.resturant.fetchFoods[this.state.viewFood].price,
        image: this.state.resturant.fetchFoods[this.state.viewFood].images[0],
        title: this.state.resturant.fetchFoods[this.state.viewFood].name,
      };

      const body = document.body;
      const scrollY = body.style.top;
      body.style.position = "";
      body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);

      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.setState({
        cartItems: cart,
        modalShow: false,
      });
      console.log(this.state.cartItems);
    } else {
      const cart = [];
      const cartItem = {
        itemId: this.state.resturant.fetchFoods[this.state.viewFood]._id,
        quantity: this.state.foodQuantity,
        price: this.state.resturant.fetchFoods[this.state.viewFood].price,
        image: this.state.resturant.fetchFoods[this.state.viewFood].images[0],
        title: this.state.resturant.fetchFoods[this.state.viewFood].name,
      };
      const body = document.body;
      const scrollY = body.style.top;
      body.style.position = "";
      body.style.top = "";

      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.setState({
        cartItems: cart,
        modalShow: false,
      });
      console.log(this.state.cartItems);
    }
  };
  removeCartItemHandler = (itemId) => {
    const newCartItems = this.state.cartItems.filter((cart, id) => {
      return id != itemId;
    });
    this.setState({
      cartItems: newCartItems,
    });
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };
  cartItemQntIncrHandler = (itemId, type) => {
    if (type == "INC") {
      const newCartItems = [];
      this.state.cartItems.map((cart, id) => {
        if (itemId == id) {
          let newQuantity = cart.quantity + 1;
          let cartItem = {
            itemId: cart.itemId,
            quantity: newQuantity,
            price: cart.price,
            image: cart.image,
            title: cart.title,
          };
          newCartItems.push(cartItem);
        } else {
          newCartItems.push(cart);
        }
      });
      this.setState({
        cartItems: newCartItems,
      });
      localStorage.setItem("cart", JSON.stringify(newCartItems));
    } else {
    }
  };
  cartItemQntDcrHandler = (itemId) => {
    const newCartItems = [];
    this.state.cartItems.map((cart, id) => {
      if (itemId == id) {
        if (cart.quantity > 1) {
          let newQuantity = cart.quantity - 1;
          let cartItem = {
            itemId: cart.itemId,
            quantity: newQuantity,
            price: cart.price,
            image: cart.image,
            title: cart.title,
          };
          newCartItems.push(cartItem);
        } else {
          newCartItems.push(cart);
        }
      } else {
        newCartItems.push(cart);
      }
    });
    this.setState({
      cartItems: newCartItems,
    });
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };

  checkoutHandler = () => {
    if (this.state.cartItems.length > 0) {
      if (localStorage.TOKEN) {
        this.setState({
          redirect: <Redirect to="/checkout" />,
        });
      } else {
        this.props.redirectUri();
        this.setState({
          redirect: <Redirect to="/user/signin" />,
        });
      }
    }
  };

  render() {
    let foodsAll, foodViewModal, content;
    if (this.state.complete) {
      foodsAll = this.state.resturant.fetchFoods.map((food, id) => {
        return (
          <Food
            key={food._id}
            id={id}
            foodId={food._id}
            modalHandler={this.modalHandler}
            title={food.name}
            description={food.description}
            price={food.price}
            imageurl={food.images[0]}
            poundSign={<FontAwesomeIcon icon={faPoundSign} />}
          />
        );
      });
      if (this.state.resturant.fetchFoods.length > 0) {
        foodViewModal = (
          <FoodViewModal
            show={this.state.modalShow}
            foodViewHandler={this.modalCancelHandler}
          >
            <div className="modal-header">
              <p>{this.state.resturant.fetchFoods[this.state.viewFood].name}</p>
              <button onClick={this.modalCancelHandler}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-details-container">
              <img
                src={
                  this.state.resturant.fetchFoods[this.state.viewFood].images[0]
                }
                alt="name"
              />
              <p>
                {
                  this.state.resturant.fetchFoods[this.state.viewFood]
                    .description
                }
              </p>
            </div>
            <div className="modal-food-details">
              {/* <p>Total: {this.state.resturant.fetchFoods[this.state.viewFood].price} <FontAwesomeIcon icon={faTimes}/> {this.state.foodQuantity} = {this.state.resturant.fetchFoods[this.state.viewFood].price * this.state.foodQuantity}</p> */}
              <p></p>
              <button onClick={this.foodQntDcrHandler}>
                {" "}
                <FontAwesomeIcon icon={faMinus} />{" "}
              </button>{" "}
              <span>{this.state.foodQuantity}</span>{" "}
              <button onClick={this.foodQntIncrHandler}>
                {" "}
                <FontAwesomeIcon icon={faPlus} />{" "}
              </button>
            </div>

            <div className="modal-food-actions">
              <button
                onClick={this.modalCancelHandler}
                className="modal-food-cancelbutton"
              >
                Cancel
              </button>
              <button
                onClick={this.addToCartHandler}
                className="add-to-cart-button"
              >
                Add
              </button>
            </div>
          </FoodViewModal>
        );
      }
      content = (
        <div className="resturant-content">
          <div className="resturant-container">
            <div className="resturant-profile">
              {this.state.resturant.cover_image ? (
                <img src={this.state.resturant.cover_image} alt="cover-image" />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1428515613728-6b4607e44363?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80"
                  alt="name"
                />
              )}
              <div className="restu-details">
                <h2>{this.state.resturant.name}</h2>
                <p>{this.state.resturant.intro}</p>
                <p>
                  <span>
                    <FontAwesomeIcon icon={faDotCircle} /> OPEN{" "}
                  </span>{" "}
                  {this.timeSetHandler(this.state.resturant.business_hour.open)}{" "}
                  -{" "}
                  {this.timeSetHandler(
                    this.state.resturant.business_hour.close
                  )}{" "}
                </p>
                {this.state.fetchChef ? (
                  <button
                    className="chefProfile-link"
                    onClick={this.chefHandler}
                  >
                    See chef profile
                  </button>
                ) : null}
              </div>
            </div>
            <div className="resturant-all-foods">
              <h3>Available Foods</h3>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexFlow: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {foodsAll}
                {foodsAll}
              </div>
            </div>
          </div>
          <div className="cart-view">
            <Cart
              cartItemRemove={this.removeCartItemHandler}
              cartItems={this.state.cartItems}
              incQuantity={this.cartItemQntIncrHandler}
              decQuantity={this.cartItemQntDcrHandler}
              checkoutHandler={this.checkoutHandler}
              poundSign={<FontAwesomeIcon icon={faPoundSign} />}
            />
          </div>
          <div className="mobile-cart">
            <button onClick={this.mobileCartViewHandler}>
              <span>
                <FontAwesomeIcon icon={faCartArrowDown}></FontAwesomeIcon>
              </span>
              <span className="cart-badge">{this.state.cartItems.length}</span>
            </button>
          </div>
        <div style={{"display": "inline-block","width": "100%"}}>
          <Footer/>
        </div>
        </div>
      );
    } else {
      content = <Skeleton />;
    }

    return (
      <div className="resturant-view">
        {this.state.complete ? (
          <ChefModal show={this.state.chef} closeHandler={this.chefHandler}>
              <div className="modal-header">
                <p>Chef profile</p>
                <button onClick={this.chefHandler}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            <div className="chef-view">
              
              {/* <div className="chef-image">
              <img src={this.state.selectedChef.chefImage} alt="Chef"/>
              </div>
              <h2>{this.state.selectedChef.chefName}</h2>
              <p>{this.state.selectedChef.chefBio}</p> */}
            </div>
          </ChefModal>
        ) : null}
        {this.state.redirect}
        <MobileCartViewModal show={this.state.mobileCart}>
          <Cart
            cartItemRemove={this.removeCartItemHandler}
            incQuantity={this.cartItemQntIncrHandler}
            decQuantity={this.cartItemQntDcrHandler}
            cartItems={this.state.cartItems}
            cartClose={this.mobileCartViewHandler}
            checkoutHandler={this.checkoutHandler}
            poundSign={<FontAwesomeIcon icon={faPoundSign} />}
          />
        </MobileCartViewModal>
        {foodViewModal}
        <div className="main-nav-bar">
          <Navigation />
        </div>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redirectUri: () => {
      dispatch({
        type: actionTypes.SET_REDIRECT_URI,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Resturant);
