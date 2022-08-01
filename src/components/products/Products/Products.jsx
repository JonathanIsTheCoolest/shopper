import React from 'react';
import ProductImageContainer from '../ProductImageContainer/ProductImageContainer';
import IMAGE_OBJECT from '../../assets/images/images';
import styles from './Products.module.css';
import AddToCart from '../../apiCalls/addToCart';
import UpdateCartItems from '../../apiCalls/updateCartItems';

import { cart, confirmation } from '../../constants'

const products = 'products';
const inStock = 'In Stock';
const outOfStock = 'Out Of Stock';
const inCart = 'In Cart';
const purchased = 'Purchased';
const dont = 'don\'t'
const notEnoughMessage = (quantity) => `Oh shoot! we ${dont} have ${quantity} right now :(`;
const outOfStockMessage = 'Oh shoot! we\'re all out of that right now :(';
const errorAddingMessage = 'Shoot we weren\'t able to add that to your cart. :( Would you mind trying that again';
const errorRemovingMessage = 'Shoot we weren\'t able to remove that from your cart. :( Would you mind trying that again';

const numberOptionArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const mapArrays = (arrayOne, arrayTwo) => arrayOne.map((object, index) => (
  {
    image: object, 
    count: arrayTwo[index],
  }
));

const INIT_STATE = {
  displayMoreImages: false,
  quantity: 1,
  images: [],
  counter: [],
  imageAndCounterArray: [],
  notEnoughMessage: '',
  postingAddToCart: false,
  puttingRemoveFromCart: false,
  error: false,
  errorMessage: '',
}

const addItemsToCart = new AddToCart();
const updateCartItems = new UpdateCartItems();

class Products extends React.Component {
  constructor(props) {
    super(props)
    this.state = INIT_STATE;
  }

  onClickImage = (e) => {
    const productName = e.target.name.replace(' ', '').toLowerCase();

    for (const object in IMAGE_OBJECT) {
      const indexArray = [];
      const imageArray = [];
      const objectName = object.toLowerCase();
      if ( productName === objectName ) {
        for (const images in IMAGE_OBJECT[object]) {
          imageArray.push(IMAGE_OBJECT[object][images])
        }
        for (const [index] of imageArray.entries()) {
          indexArray.push(index)
        }
        this.setState({ 
          displayMoreImages: true,
          images: [...imageArray], 
          counter: [...indexArray],
          imageAndCounterArray: mapArrays(imageArray, indexArray),
        })
      }
    }
  }

  onClickX = () => {
    this.setState({ displayMoreImages: false, images: [], counter: [] });
  }

  onClickLeftArrow = () => {
    const { counter, images } = this.state;

    const length = counter.length - 1;

    const newArray = [];

    for (const value of counter) {
      if ( value === 0 ) {
        newArray.push(length)
      } else if ( value > 0 ) {
        const newValue = value - 1;
        newArray.push(newValue)
      }
    }
    this.setState({ 
      counter: newArray,
      imageAndCounterArray: mapArrays(images, newArray),
    })
  }

  onClickRightArrow = () => {
    const { counter, images } = this.state;

    const length = counter.length - 1;

    const newArray = [];

    for (const value of counter) {
      if ( value === length ) {
        const newValue = 0;
        newArray.push(newValue)
      } else if ( value < length ) {
        const newValue = value + 1;
        newArray.push(newValue)
      }
    }
    this.setState({ 
      counter: newArray,
      imageAndCounterArray: mapArrays(images, newArray),
    })
  }

  // Used For Both Add And Remove From Cart
  newObject = ( newObject, name, objectItem ) => {
    for ( const [index, item] of newObject.entries() ) {
      const itemNames = item.name.replace(' ', '').toLowerCase();
      const itemName = name.replace(' ', '').toLowerCase();
      if (itemNames === itemName) {
        newObject.splice(index, 1, objectItem);
      }
    }
    return newObject;
  }

  // Beginning Add To Cart Function
  addToCartFront = (lineItemId) => {
    const { quantity } = this.state;
    const { data, onClickAddToCart, selectedData, props, searchBarValue, searchDataArray } = this.props;
    const { description, category, image, inventory, name, price, permalink, id } = props;

    const newInventory = (inventory * 1) - (quantity * 1);

    const itemObject = {
      category: category,
      name: name,
      description: description,
      price: price,
      inventory: newInventory,
      permalink: permalink,
      id: id,
      lineItemId: lineItemId,
      image: image,
      quantity: (quantity * 1),
    };

    if ( searchBarValue ) {
      onClickAddToCart(
        itemObject, 
        this.newObject(data, name, itemObject), 
        this.newObject(selectedData, name, itemObject),
        this.newObject(searchDataArray, name, itemObject),
      );
      
    } else {
      onClickAddToCart(
        itemObject, 
        this.newObject(data, name, itemObject), 
        this.newObject(selectedData, name, itemObject),
      );
    }
  }

  addToCartBack = () => {
    const { quantity } = this.state;
    const { props, cartId } = this.props;
    const { id } = props;

    this.setState({ postingAddToCart: true })
    addItemsToCart.postData( cartId, id, quantity)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ postingAddToCart: false, error: false, errorMessage: '', })
        this.addToCartFront(res.data.lineItemId)
      } else {
        this.setState({ postingAddToCart: false, error: true, errorMessage: errorAddingMessage, })
        console.log('Your item was not added to cart :(');
      }
    }, (error) => {
      this.setState({ postingAddToCart: false, error: true, errorMessage: errorAddingMessage, })
      console.error('There was an error: ', error);
    })
  }

  onClickAddToCart = () => {
    const { quantity, postingAddToCart } = this.state;
    const { props } = this.props;
    const { inventory } = props;

    if (!postingAddToCart) {
      if ( inventory === 0 ) {
        this.setState({ notEnoughMessage: outOfStockMessage })
      } else if ( inventory < quantity ) {
        this.setState({ notEnoughMessage: `${notEnoughMessage(quantity)} You could get ${inventory} though :)` })
      } else {
        this.addToCartBack();
      }
    }
  }
  // End Add To Cart Function

  // Beginning Remove From Cart Function
  removeCartObject = ( newObject, name ) => {
    for ( const [index, item] of newObject.entries() ) {
      const itemNames = item.name.replace(' ', '').toLowerCase();
      const itemName = name.replace(' ', '').toLowerCase();
      if (itemNames === itemName) {
        newObject.splice(index, 1);
      }
    }
    return newObject;
  }

  removeFromCartFront = () => {
    const { quantity: selectedQuantity } = this.state;
    const { data, cartData, props, onClickRemoveFromCart, cartItemsTotal } = this.props;
    const { description, category, image, inventory, name, price, quantity: quantityInCart, permalink, id, lineItemId } = props;

    const newInventory = (inventory * 1) + (selectedQuantity * 1);
    const newQuantity = (quantityInCart * 1) - (selectedQuantity * 1);
    const newCartItemsTotal = (cartItemsTotal * 1) - (selectedQuantity * 1);

    const dataItemObject = {
      category: category,
      name: name,
      description: description,
      price: price,
      inventory: newInventory,
      permalink: permalink,
      id: id,
      image: image,
    };

    const cartDataItemObject = {
      category: category,
      name: name,
      description: description,
      price: price,
      inventory: newInventory,
      permalink: permalink,
      id: id,
      image: image,
      quantity: newQuantity,
      lineItemId: lineItemId,
    };

    if ( quantityInCart === selectedQuantity ) {
      onClickRemoveFromCart(
        this.newObject(data, name, dataItemObject),
        this.removeCartObject(cartData, name),
        newCartItemsTotal,
      );
    } else if ( quantityInCart > selectedQuantity ) {
      onClickRemoveFromCart(
        this.newObject(data, name, dataItemObject),
        this.newObject(cartData, name, cartDataItemObject),
        newCartItemsTotal,
      );
    }
  }

  removeFromCartFrontBack = () => {
    const { quantity: selectedQuantity } = this.state;
    const { props, cartId } = this.props;
    const { lineItemId, quantity: quantityInCart } = props;

    const newQuantity = (quantityInCart * 1) - (selectedQuantity * 1);

    this.setState({ puttingRemoveFromCart: true })
    updateCartItems.postData( cartId, lineItemId, newQuantity)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ puttingRemoveFromCart: false, error: false, errorMessage: '', })
        this.removeFromCartFront();
      } else {
        this.setState({ puttingRemoveFromCart: false, error: true, errorMessage: errorRemovingMessage, })
        console.log('Your item was not removed from cart :(');
      }
    }, (error) => {
      this.setState({ puttingRemoveFromCart: false, error: true, errorMessage: errorRemovingMessage, })
      console.error('There was an error: ', error);
    })
  }

  onClickRemoveFromCart = () => {
    const { quantity: selectedQuantity, puttingRemoveFromCart } = this.state;
    const { props } = this.props;
    const { name, quantity: quantityInCart } = props;

    const newMessage = `Dang you ${dont} even have ${selectedQuantity} ${name} in your cart. You could get rid of ${quantityInCart} though... :(`;
    const newMessagePlural = `Dang you ${dont} even have ${selectedQuantity} ${name}s in your cart. You could get rid of ${quantityInCart} though... :(`;

    const messageStatement = 
      name[name.length - 1] === 's' ?
      newMessage :
      newMessagePlural
    ;

    if (!puttingRemoveFromCart) {
      if ( quantityInCart < selectedQuantity ) {
        this.setState({ notEnoughMessage: messageStatement })
      } else {
        this.removeFromCartFrontBack();
      }
    }
  }
  // End Remove From Cart Function

  onBlurSelectQuantity = (e) => {
    const value = e.target.value;

    this.setState({ quantity: (value * 1) })
  }

  removeMessageOnTransitionEnd = () => {
    this.setState({ notEnoughMessage: '', errorMessage: '', })
  }

  render() {
    const { displayMoreImages, imageAndCounterArray, notEnoughMessage, error, errorMessage } = this.state;

    const { render, props, cartProgress } = this.props;

    const { description: desc, image, inventory, name, price, quantity } = props;

    const description = desc.replaceAll('<p>', '').replaceAll('</p>', '');

    const availabilityAndInCartMessage = 
      render === products && inventory <= 0 ? 
      outOfStock :
      render === products && inventory > 0 ? 
      `${inStock}: ${inventory}` : 
      render === cart && cartProgress !== confirmation ?
      `${inCart}: ${quantity}` :
      render === cart && cartProgress === confirmation ?
      `${purchased}: ${quantity}` :
      null
    ;

    const availabilityAndInCartElements = 
      cartProgress && cartProgress !== cart ?
      <div className={styles.inCart}>{availabilityAndInCartMessage}</div> :
      <div className={styles.inStock}>{availabilityAndInCartMessage}</div>
    ;

    const loadProductImages = 
      displayMoreImages ? 
      <ProductImageContainer 
        imageAndCounterArray={imageAndCounterArray} 
        onClickLeftArrow={this.onClickLeftArrow} 
        onClickRightArrow={this.onClickRightArrow} 
        onClickX={this.onClickX} 
        description={description}
        name={name}/> :
      null
    ;

    const addAndRemoveButtons = 
      render === products ?
      <label onClick={this.onClickAddToCart} htmlFor="addToCart">
        <input name="addToCart" className={styles.addToCartButton} type="button" value="Add To Cart" />
      </label> :
      render === cart ?
      <label onClick={this.onClickRemoveFromCart} htmlFor="removeFromCart">
        <input name="removeFromCart" className={styles.addToCartButton} type="button" value="Remove From Cart" />
      </label> :
      null
    ;

    const notEnoughStatement =
      notEnoughMessage.length && render === products ?
      <div className={styles.notEnoughMessageContainer} onTransitionEnd={this.removeMessageOnTransitionEnd}>
        <div>{notEnoughMessage}</div>
      </div> :
      notEnoughMessage.length && render === cart ?
      <div className={`${styles.notEnoughMessageContainer} ${styles.tooMuchCartMessageContainer}`} onTransitionEnd={this.removeMessageOnTransitionEnd}>
        <div>{notEnoughMessage}</div>
      </div> :
      !notEnoughMessage.length ?
      <div className={styles.notEnoughMessageContainerHidden} >
        <div>{notEnoughMessage}</div>
      </div> :
      null
    ;

    const selectButton = 
      <label htmlFor="itemAmount">
        <select onBlur={this.onBlurSelectQuantity} className={styles.selectAddAmount} name="itemAmount" id="itemAmount">
          {numberOptionArray.map((item, index) => (
            <option key={`${item}${index}`} value={item}>{item}</option>
          ))}
        </select>
      </label>
    ;

    const whileCheckingOut = (element) => 
      cartProgress && cartProgress !== cart ?
      null :
      element
    ;

    const selectStatement = whileCheckingOut(selectButton);
    const addAndRemoveStatement = whileCheckingOut(addAndRemoveButtons);

    const errorAddingToCartStatement = 
      error ?
      <div>
        {errorMessage}
      </div> :
      null
    ;

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
            {availabilityAndInCartElements}
            {selectStatement}
            {addAndRemoveStatement}
            {notEnoughStatement}
          </div>
        </>
        {errorAddingToCartStatement}
        {loadProductImages}
      </div>
    )
  }
}

export default Products;