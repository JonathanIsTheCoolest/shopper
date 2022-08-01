import {SHOPPER_SECRET_API_KEY} from '../constants'

class SetTaxZone {
  async setTaxZone(checkoutTokenId) {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/checkouts/${checkoutTokenId}/helper/set_tax_zone?country=US&region=CA&postal_zip_code=94703`
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
          const totalTax = json.tax.amount.raw;
          const breakdown = json.tax.breakdown;
          
          success({ response, totalTax, breakdown })
        } else {
          console.log(response);
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Could Not Set Tax Zone :(')
      }
    } )
  }
}

export default SetTaxZone;