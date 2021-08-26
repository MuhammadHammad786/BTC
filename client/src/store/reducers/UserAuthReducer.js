import * as actionTypes from '../actions/actionTypes';

const initialState = {
    auth: false,
    userId: null,
    userSetup: false,
    adminSetUp: false,
    redirect_url:null
}

const userAuthReducer = (state= initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_USER:
            return{
                ...state,
                auth: true,
                userId: action.userId,
                userSetUp: true
            }
        case actionTypes.SET_REDIRECT_URI:
            return{
                ...state,
                redirect_url: "/checkout"
            }
         default:
             return state;
    }
};

export default userAuthReducer;