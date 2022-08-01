import { SHOPPER_SECRET_API_KEY } from '../constants';

class AddToCart {
  async postData(cartId, productId, quantity) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/carts/${cartId}`
        );

        let headers = {
          "X-Authorization": SHOPPER_SECRET_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        };

        let body = JSON.stringify({
          "id": productId,
          "quantity": quantity,
        });

        const response = await fetch(
          url, 
          {
            method: 'POST',
            headers: headers,
            body: body,
          },
        );

        if (response.ok) {
          const json = await response.json();
          const data = {
            lineItemId: json.line_item_id
          };
          
          success({ response, data })
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

export default AddToCart;