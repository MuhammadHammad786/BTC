import * as actionTypes from '../actions/actionTypes';

const initialState = {
    resturantId: null,
    merchantAuth: false,
    merchantSetup: false
};

const MerchantAuthReducer = (state=initialState, action)=>{
     switch(action.type){
          case actionTypes.AUTH_MERCHANT:
             return{
                 ...state,
                 merchantAuth: true,
                 resturantId: action.resturantId,
                 merchantSetup: true

             }
          case actionTypes.MERCHANT_LOGOUT:
              localStorage.removeItem('MERCHANT_TOKEN');
              localStorage.removeItem('merchantId');
              return{
                  ...state,
                  resturantId: null,
                  merchantAuth: false
              }
          default:
              return state;
     }
};

export default MerchantAuthReducer;