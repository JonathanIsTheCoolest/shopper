import { SHOPPER_SECRET_API_KEY } from '../constants';

class UpdateCartItems {
  async postData(cartId, lineItemId, quantity) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/carts/${cartId}/items/${lineItemId}`
        );

        let headers = {
          "X-Authorization": SHOPPER_SECRET_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        };

        let body = JSON.stringify({
          "quantity": quantity,
        });

        const response = await fetch(
          url, 
          {
            method: 'PUT',
            headers: headers,
            body: body,
          },
        );

        if (response.ok) {
          const json = await response.json();
          
          success({ response, json })
        } else {
          console.log(response);
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Post Request was Unsuccessful :(')
      }
    } )
  }
}

export default UpdateCartItems;