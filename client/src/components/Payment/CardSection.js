import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

import axios from 'axios';
import { url } from '../../utils/utils';

export default class TakeMoney extends React.Component {
    onToken = async(token) => {
    console.log(token);
    await axios.post(
        url,
        {
          query:`
           mutation{
             payment(
               source:"${token.id}", 
               orderId:"${localStorage.orderId}", 
               amount:${localStorage.total},
               email:"${token.email}"
               ){
               _id
             }
           }
          `
        }
    )
  }
  render() {
    return (
      // ...
      <StripeCheckout
        token={this.onToken}
        stripeKey="pk_test_51I5VEyKIeRwnUDgWxbRUOAEmSLj8CcQ8MDV7jqlgm5gw80tRqJSV8AtMi597e0OgMVsFKoF5HgRKnh0cj22Nys7W00YbQLc2Cw"
      />
    )
  }
}