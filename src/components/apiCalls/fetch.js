import { SHOPPER_SECRET_API_KEY } from '../constants';

import IMAGE_OBJECT from '../assets/images/images';

class Fetch {
  async fetchData() {
    return new Promise( async (success, failure) => {
      try {
        const url = new URL(
          "https://api.chec.io/v1/products"
        );

        let params = {
          "limit": "100",
        };

        Object.keys(params)
          .forEach(key => url.searchParams.append(key, params[key]))
        ;

        const response = await fetch(
          url,
          {
            method: 'GET',
            headers: {'X-Authorization': SHOPPER_SECRET_API_KEY},
          },
        );

        if (response.ok) {
          const json = await response.json();
          const data = json.data
          .map((item) => ({
            category: item.categories[0].name,
            name: item.name,
            description: item.description,
            price: item.price.raw,
            inventory: item.inventory.available,
            permalink: item.permalink,
            id: item.id,
          }));

          for ( const image in IMAGE_OBJECT ) {
            const imgName = image.toLowerCase();
            for (const item of data) {
              const itemName = item.name.replace(' ', '').toLowerCase();
              if (imgName === itemName) {
                item.image = IMAGE_OBJECT[image].imageOne;
              }
            }
          }

          success({ response, data })
        } else {
          failure({ error: 'Invalid HTTPS Request' })
        }
      } catch {
        failure('Error')
      }
    } )
  }
}

export default Fetch;