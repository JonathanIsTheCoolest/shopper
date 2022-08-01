import { SHOPPER_SECRET_API_KEY } from '../constants';

class EmptyCart {
  async deleteData(cartId) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/carts/${cartId}/items`
        );

        let headers = {
          "X-Authorization": SHOPPER_SECRET_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        };

        const response = await fetch(
          url, 
          {
            method: 'DELETE',
            headers: headers,
          },
        );

        if (response.ok) {
          const json = await response.json();
          const isTrue = json.success
          
          success({ response, isTrue })
        } else {
          console.log(response);
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Delete Request was Unsuccessful :(')
      }
    } )
  }
}

export default EmptyCart;