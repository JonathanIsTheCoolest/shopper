import {SHOPPER_SECRET_API_KEY} from '../constants'

class GenerateCheckoutToken {
  async generateToken(cartId) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/checkouts/${cartId}?type=cart`
        );

        let headers = {
          "X-Authorization": SHOPPER_SECRET_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
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
          const checkoutTokenId = json.id
          
          success({ response, checkoutTokenId, json })
        } else {
          console.log(response);
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Could Not Generate Checkout Token :(')
      }
    } )
  }
}

export default GenerateCheckoutToken;