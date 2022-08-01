import { SHOPPER_SECRET_API_KEY } from '../constants';

class RetrieveCart {
  async retrieveCart(cartId) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/carts/${cartId}`
        );

        let headers = {
          "X-Authorization": SHOPPER_SECRET_API_KEY,
          "Accept": "application/json",
          "Content-Type": "application/json",
        };

        const response = await fetch(
          url,
          {
            method: 'GET',
            headers: headers,
          },
        );

        if (response.ok) {
          const json = await response.json();

          success({ response, json })
        } else {
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Post Request was Unsuccessful :(')
      }
    } )
  }
}

export default RetrieveCart;