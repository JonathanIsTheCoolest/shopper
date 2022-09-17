import {SHOPPER_SECRET_API_KEY} from '../constants'

class GetCustomerList {
  async getCustomerList(email, password) {
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

        const response = await fetch(
          url, 
          {
            method: 'GET',
            headers: headers,
          }
        )

        if (response.ok) {
          const emailArray = [];

          const json = await response.json();
          const data = json.data;
          let user;

          if (data && data.length) {
            for (const item of data) {
              emailArray.push(item.email)
              if (email === item.email) {
                if (password === item.meta.password) {
                  user = {
                    id: item.id,
                    firstName: item.firstname,
                    lastName: item.lastname,
                    email: item.email,
                    phoneNumber: item.phone,
                  }
                }
              }
            }
          }

          success({ response, json, data, emailArray, user })
        } else {
          console.log(response);

          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Unable To Get User List, Please Try Again.')
      }
    })
  }
}

export default GetCustomerList;
















































// import {SHOPPER_SECRET_API_KEY} from '../constants'
// import CreateCustomer from './createCustomer';

// const newCustomer = new CreateCustomer();

// class GetCustomerList {
//   async getCustomerList(email, phoneNumber, firstName, lastName, password) {
//     return new Promise(async (success, failure) => {
//       try {
//         const url = new URL(
//           `https://api.chec.io/v1/customers`
//         );

//         let headers = {
//           "X-Authorization": SHOPPER_SECRET_API_KEY,
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         }

//         const response = await fetch(
//           url, 
//           {
//             method: 'GET',
//             headers: headers,
//           }
//         )

//         if (response.ok) {
//           const json = await response.json();
//           const data = json.length;
//           console.log(data);

//           if (data && data.length) {
//             for (const item of data) {
//               if (item.email === email) {
//                 break;
//               } else {
//                 newCustomer.createCustomer(
//                   email, phoneNumber, firstName, lastName, password
//                 )
//               }
//             }
//           }

//           success({ response, json, data })
//         } else {
//           console.log(response);

//           failure({ error: 'Invalid HTTPS Request' })
//         }
//       } catch {
//         failure('Unable To Get User List, Please Try Again.')
//       }
//     })
//   }
// }

// export default GetCustomerList;