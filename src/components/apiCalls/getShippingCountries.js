import { SHOPPER_SECRET_API_KEY } from '../constants';

class GetShippingCountries {
  async fetchData(checkoutTokenId) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/services/locale/${checkoutTokenId}/countries`
        );

        const headers = {
          'X-Authorization': SHOPPER_SECRET_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }

        const response = await fetch(
          url,
          {
            method: 'GET',
            headers: headers,
          },
        );

        if (response.ok) {
          const json = await response.json();
          const countries = json.countries

          success({ response, json, countries })
        } else {
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Dang We Couldn\'t Get Those Countries :(')
      }
    } )
  }
}

export default GetShippingCountries;