import React from 'react';

import { Link } from 'react-router-dom';

const resturant = (props)=>{
    console.log(props.cover);
    let coverUrl;
    if(props.cover){
        coverUrl = <img src={props.cover} alt="cover"/>
    }else{
        coverUrl = <img src="https://images.unsplash.com/photo-1610479615569-c3c16085eb00?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZCUyMGltYWdlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="name"/>
    }
    return(
        <Link to={"/restaurant/"+props.id} className="search-found-resurant">
            {coverUrl}
            <h4>{props.name}</h4>
        </Link>
    );
};

export default resturant;