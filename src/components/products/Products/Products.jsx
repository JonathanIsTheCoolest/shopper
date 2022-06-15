import React from 'react';
import ProductImageContainer from '../ProductImageContainer/ProductImageContainer';
import IMAGE_OBJECT from '../../assets/images/images';
import styles from './Products.module.css';

const inStock = 'In Stock';
const outOfStock = 'Out Of Stock';

const numberOptionArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const INIT_STATE = {
  displayMoreImages: false,
  quantity: 1,
  images: [],
}

class Products extends React.Component {
  constructor(props) {
    super(props)
    this.state = INIT_STATE;
  }

  onClickImage = (e) => {
    const productName = e.target.name.replace(' ', '').toLowerCase();

    for (const object in IMAGE_OBJECT) {
      const imageArray = [];
      const objectName = object.toLowerCase();
      if ( productName === objectName ) {
        for (const images in IMAGE_OBJECT[object]) {
          imageArray.push(IMAGE_OBJECT[object][images])
        }
        this.setState({ 
          displayMoreImages: true,
          images: [...imageArray], 
        })
      }
    }
  }

  onClickX = () => {
    this.setState({ displayMoreImages: false, images: {} });
  }

  onBlurQuantity = () => {

  }

  render() {
    const { displayMoreImages, images } = this.state;

    const {description: desc, image, inventory, name, price} = this.props.props;

    const availabilityMessage = inventory <= 0 ? outOfStock : `${inStock}: ${inventory}`;

    const loadProductImages = 
      displayMoreImages ? 
      <ProductImageContainer onClickX={this.onClickX} name={name} images={images}/> :
      null
    ;

    const description = desc.replaceAll('<p>', '').replaceAll('</p>', '');
    return(
      <div className={styles.container}>
        <>
          <div onClick={this.onClickImage} className={styles.imageContainer}>
            <img src={image} alt={description} name={name} />
          </div>
          <div className={styles.descriptionContainer}>
            <h3>{name}</h3>
            <h4>USD ${price}</h4>
            <p>{description}</p>
          </div>
          <div className={styles.stockAndAddContainer}>
            <div className={styles.inStock}>{availabilityMessage}</div>
            <label htmlFor="itemAmount">
              <select className={styles.selectAddAmount} name="itemAmount" id="itemAmount">
                {numberOptionArray.map((item, index) => (
                  <option key={`${item}${index}`} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label htmlFor="addToCart">
              <input name="addToCart" className={styles.addToCartButton} type="button" value="Add To Cart" />
            </label>
          </div>
        </>
        {loadProductImages}
      </div>
    )
  }
}

export default Products;