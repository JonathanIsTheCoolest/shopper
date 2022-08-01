import { SHOPPER_SECRET_API_KEY } from '../constants';

class GenerateNewCart {
  async fetchData() {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          "https://api.chec.io/v1/carts"
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
          const data = json.id

          success({ response, data })
        } else {
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Cart Was Not Created :(')
      }
    } )
  }
}

export default GenerateNewCart;