import { combineReducers } from 'redux';
import UserAuthReducer from './UserAuthReducer';
import MerchantReducer from './MerchantAuthReducer';

export default combineReducers({
    auth: UserAuthReducer,
    merchant: MerchantReducer
});
