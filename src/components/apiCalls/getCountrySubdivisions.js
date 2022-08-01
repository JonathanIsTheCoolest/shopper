import { SHOPPER_SECRET_API_KEY } from '../constants';

class GetCountrySubdivisions {
  async fetchData(countryCode) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/services/locale/${countryCode}/subdivisions`
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
          const subdivisions = json.subdivisions

          success({ response, json, subdivisions })
        } else {
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Dang We Couldn\'t Get Those Subdivisions :(')
      }
    } )
  }
}

export default GetCountrySubdivisions;