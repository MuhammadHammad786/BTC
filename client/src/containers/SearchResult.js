import React, { useState, useEffect } from "react";

import axios from "axios";
import { url } from "../utils/utils";

import "../styles/SearchResult.scss";
import HomeNav from "../components/Navigations/HomeNav";
import Resturant from "../components/SearchResturant";
import Footer from '../components/Footer';

import { Link } from "react-router-dom";

function SearchResult(props) {
  const [resturants, setResturants] = useState([]);
  const [complete, setComplete] = useState(false);
  const [activeButton, setButton] = useState(null);
  const [type, setType] = useState("");

  let result;
  if (complete) {
    if (resturants.length > 0) {
      result = resturants.map((resturant) => {
        return (
          <Resturant
            key={resturant._id}
            id={resturant._id}
            name={resturant.name}
            cover={resturant.cover_image}
          />
        );
      });
    } else {
      result = <p>No resturants found</p>;
    }
  } else {
    result = <p>Loading.....</p>;
  }

  const fetchResult = async () => {
    try {
      const resturants = await axios.post(url, {
        query: `
                       query{
                           search(postCode:"${props.match.params.postCode}", type:"${type}"){
                               _id
                               name
                               cover_image
                           }
                       }
                    `,
      });
      setResturants(resturants.data.data.search);
      setComplete(true);
    } catch (error) {
      throw error;
    }
  };
  const buttonSwitchHandler = async(value, type) => {
    setButton(value);
    setType(type);
    const resturants = await axios.post(url, {
      query: `
                     query{
                         search(postCode:"${props.match.params.postCode}", type:"${type}"){
                             _id
                             name
                             cover_image
                         }
                     }
                  `,
    });
    setResturants(resturants.data.data.search);
    setComplete(true);
  };
  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <>
    <div className="search-result">
      <div className="main-nav-bar">
        <HomeNav />
      </div>
      <div className="result-main">
        <div className="searchLeft">
          <button
            onClick={() => {
              buttonSwitchHandler(null, "");
            }}
            className={activeButton ? "DeactivateButton" : "ActiveButton"}
          >
            Recommended
          </button>
          {/* <button className="ActiveButton">All</button> */}
          <button
            onClick={() => {
              buttonSwitchHandler(1, "Dietary");
            }}
            className={activeButton === 1 ? "ActiveButton" : "DeactivateButton"}
          >
            Dietary
          </button>
          <button
            onClick={() => {
              buttonSwitchHandler(2, "gluten free");
            }}
            className={activeButton === 2 ? "ActiveButton" : "DeactivateButton"}
          >
            Gluten Free
          </button>
          <button
            onClick={() => {
              buttonSwitchHandler(3, "halal");
            }}
            className={activeButton === 3 ? "ActiveButton" : "DeactivateButton"}
          >
            Halal
          </button>
          <button
            onClick={() => {
              buttonSwitchHandler(4, "vegan");
            }}
            className={activeButton === 4 ? "ActiveButton" : "DeactivateButton"}
          >
            Vegan
          </button>
          <button
            onClick={() => {
              buttonSwitchHandler(5, "vegan friendly");
            }}
            className={activeButton === 5 ? "ActiveButton" : "DeactivateButton"}
          >
            Vegan Friendly
          </button>
          <button
            onClick={() => {
              buttonSwitchHandler(6, "vegetarian");
            }}
            className={activeButton === 6 ? "ActiveButton" : "DeactivateButton"}
          >
            Vegetarian
          </button>
        </div>
        <div className="searchRight">
          <p>
            Search result for address{" "}
            <span style={{ color: "orangered" }}>
              {props.match.params.postCode}
            </span>
            <Link className="change-location" to="/">
              Change location
            </Link>
          </p>
          <div className="found-resurant-all">{result}</div>
        </div>
      </div>
      <div style={{"display": "inline-block","width": "100%"}}>
          <Footer/>
      </div>
    </div>
    
    
    </>
  );
}

export default SearchResult;
