import {SHOPPER_SECRET_API_KEY} from '../constants'

class CreateCustomer {
  async createCustomer(email, phoneNumber, firstName, lastName, password) {
    return new Promise(async (success, failure) => {
      try {
        const url = new URL(
          `https://api.chec.io/v1/customers`
        );

        let headers = {
          "X-Authorization": SHOPPER_SECRET_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        }

        let body = JSON.stringify({
          "email": email,
          "phone": phoneNumber,
          "firstname": firstName,
          "lastname": lastName,
          "meta": {
            "password": password
          }
        })

        const response = await fetch(
          url, 
          {
            method: 'POST',
            headers: headers,
            body: body,
          }
        )

        if (response.ok) {
          const json = await response.json();
          console.log(json);

          success({ response, json })
        } else {
          console.log(response);

          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Unable To Create User, Please Try Again.')
      }
    })
  }
}

export default CreateCustomer;