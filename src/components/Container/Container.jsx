import React from 'react';
import Fetch from '../apiCalls/fetch';
import GenerateNewCart from '../apiCalls/generateNewCart';
import RetrieveCart from '../apiCalls/retrieveCart';
import styles from './Container.module.css'
import NavBar from '../NavBar/NavBar';
import Home from '../Home/Home';
import ProductContainer from '../products/ProductContainer/ProductContainer';
import CartContainer from '../cart/CartContainer/CartContainer';
import LoginSignUpContainer from '../loginSignup/LoginSignUpContainer/LoginSignUpContainer';
import User from '../User/User';

import { home, products, cart, loginSignUp, logout, confirmation, user, USER_INFO } from '../constants';
import { makeButtons, makeNameIntoTitle } from '../functions';

const data = new Fetch();
const generateNewCart = new GenerateNewCart();
const retrieveCart = new RetrieveCart();

const INIT_STATE = {
  data: [],
  cartData: [],
  loading: false,
  generateNewCartLoading: false,
  error: false,
  render: home,
  cartItemsTotal: 0,
  cashTotal: 0,
  cartId: '',
  cartStatus: {},
  userInfo: USER_INFO,
  cartProgress: cart,
}

const E_COMMERCE_MESSAGE = 'Super Duper E-Commerce Store';
const HOME_MESSAGE = 'Welcome to my store! I hope you find what you\'re looking for 🤓';
const PRODUCTS_MESSAGE = 'Check out all these sweet products! 🔥🔥🔥';
const EMPTY_CART_MESSAGE = 'Hey your carts empty! What the heck? buy something! 😠 😖 😤';
const FULL_CART_MESSAGE = 'Heck yah! You\'re getting some sweet products!!! 🔥🔥🔥';
const LOGIN_SIGN_UP_MESSAGE = 'Let\'s make this personal! 😜';
const USER_MESSAGE = name => `Hey ${makeNameIntoTitle(name)}, I am so happy that you are here! 😊`;

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = INIT_STATE;
  }

  componentDidMount = () => {
    this.setState({ loading: true })
    data.fetchData()
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ data: res.data, loading: false, error: false })
      } else {
        this.setState({ loading: false, error: true, data: [], })
        console.log('Something went wrong');
      }
    }, (error) => {
      this.setState({ loading: false, error: true, data: [], })
      console.error('There was an error: ', error);
    })
  }

  onClickGenerateNewCart = () => {
    const { cartId } = this.state;

    if (!cartId.length) {
      this.setState({ generateNewCartLoading: true });
      generateNewCart.fetchData()
      .then((res) => {
        if (res && res.response.ok) {
          this.setState({ cartId: res.data, generateNewCartLoading: false, error: false })
        } else {
          this.setState({ generateNewCartLoading: false, error: true, cartId: '', })
          console.log('Something went wrong');
        }
      }, (error) => {
        this.setState({ generateNewCartLoading: false, error: true, cartId: '', })
        console.error('There was an error: ', error);
      })
    }
  }

  onClickRetrieveCart = () => {
    const { cartId } = this.state;

    if (cartId.length) {
      this.setState({ generateNewCartLoading: true });
      retrieveCart.retrieveCart(cartId)
      .then((res) => {
        if (res && res.response.ok) {
          this.setState({ generateNewCartLoading: false, error: false, cartStatus: res.json, })
        } else {
          this.setState({ generateNewCartLoading: false, error: true, cartStatus: res.response.ok, })
          console.log('Something went wrong');
        }
      }, (error) => {
        this.setState({ generateNewCartLoading: false, error: true, cartStatus: error, })
        console.error('There was an error: ', error);
      })
    }
  }

  getCartItemsTotal = (dataObject) => {
    let number = 0;

    for ( const data of dataObject ) {
      const { quantity } = data;
      number = number + quantity
    }
    return number
  }

  onClickAddToCart = ( newCartData, data ) => {
    const { cartData } = this.state;
     
    const newCartDataObject = cartData;

    newCartDataObject.push(newCartData)

    const totalStatement = newCartDataObject.length ? this.getCartItemsTotal(newCartDataObject) : 0;

    this.setState({ 
      data: data,
      cartData: newCartDataObject,
      cartItemsTotal: totalStatement,
    })
  }

  onClickRemoveFromCart = ( data, cartData, cartItemsTotal ) => {
    const amountDue = this.amountDue(cartData).toFixed(2);

    this.setState({
      data: data,
      cartData: cartData,
      cartItemsTotal: cartItemsTotal,
      cashTotal: amountDue,
    })
  }

  initialReduce = (objectArray, property) => {
    return objectArray.reduce(function (accumulator, object) {
      let key = object[property];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object)
      return accumulator
    }, {})
  }

  secondReduce = (object) => {
    const firstDataArray = [];
    const secondDataArray = [];
    const finalDataArray = [];


    for ( const key in object) {
      const obj = object[key];
      const reducedQuantity = obj.reduce(function (accumulator, currentValue) {
        const quantity = accumulator + currentValue.quantity;
        return quantity
      }, 0)

      const lowestInventoryObject = obj.reduce((accumulator, currentValue) => 
        accumulator.inventory < currentValue.inventory ? accumulator : currentValue
      );

      firstDataArray.push(lowestInventoryObject);
      secondDataArray.push(reducedQuantity);
    }


    const finalArrayMap = (arrayOne, arrayTwo) => arrayOne.map((item, index) => (
      {
        ...item,
        quantity: arrayTwo[index],
      }
    ));

    finalDataArray.push(...finalArrayMap( firstDataArray, secondDataArray ));
    return finalDataArray;
  }

  amountDue = (cartData) => {
    const totalsArray = [];

    for (const data of cartData) {
      const {quantity, price} = data;
      const totalPrices = (quantity * 1) * (price * 1);
      totalsArray.push(totalPrices);
    }

    return totalsArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0 );
  };

  onClickReduceCartObject = () => {
    const { cartData } = this.state;

    const key = 'name';

    if ( cartData.length ) {
     const partiallyReduced = this.initialReduce( cartData, key );
     const fullyReduced = this.secondReduce( partiallyReduced );
     const amountDue = this.amountDue( fullyReduced ).toFixed(2);
     this.setState({ cartData: fullyReduced, cashTotal: amountDue })
    }
  }

  ifConfirmationResetCashTotal = () => {
    const { cartProgress } = this.state;

    if (cartProgress === confirmation) {
      this.setState({
        cartProgress: cart,
        cashTotal: 0,
      })
    }
  }

  onClickRender = (name) => {
    this.setState({ render: name })
    this.ifConfirmationResetCashTotal()
  }


  onClickGetUserInfo = (userInfo) => {
    this.setState({
      userInfo: userInfo,
    })
  }

  onClickLogOutUser = () => {
    this.setState({
      userInfo: USER_INFO,
      render: loginSignUp,
    })
  }

  onClickUserName = () => {
    this.setState({
      render: user,
    })
    this.ifConfirmationResetCashTotal();
  }

  onClickResetConfirmationData = () => {
    this.setState({
      cartData: [],
      cartItemsTotal: 0,
    })
  }

  onClickUpdateCart = (progress) => {
    this.setState({
      cartProgress: progress,
    })
  }

  render() {
    const { render, cartItemsTotal, cartData, data, cashTotal, cartId, userInfo } = this.state;
    const { id, firstName } = userInfo;
    
    const messageLoadStatement = 
      render === home ? HOME_MESSAGE :
      render === products ? PRODUCTS_MESSAGE :
      render === cart && cartItemsTotal <= 0 ? EMPTY_CART_MESSAGE :
      render === cart && cartItemsTotal > 0 ? FULL_CART_MESSAGE :
      render === loginSignUp ? LOGIN_SIGN_UP_MESSAGE : 
      render === user ? USER_MESSAGE(firstName) :
      null
    ;

    const loginSignUpLogoutStatement = 
      id.length ?
      user :
      loginSignUp
    ;

    const fixedContainerClassStatement = 
      id.length ?
      styles.fixedContainerWithUser :
      styles.fixedContainerNoUser
    ;

    const navBar = [ home, products, cart, loginSignUpLogoutStatement ];

    const logoutButton = makeButtons(logout, this.onClickLogOutUser);
    return (
      <div className={styles.mainContainer}>
        <div className={`${styles.fixedContainer} ${fixedContainerClassStatement}`}>
          <div className={styles.eCommerceNameContainer}>
            <h1>{E_COMMERCE_MESSAGE.toUpperCase()}</h1>
          </div>
          {
            id.length ?
            <div onClick={this.onClickUserName} className={styles.userNameContainer}>
              <div onClick={this.onClickUserName} className={styles.userName}>
                {firstName}
              </div>
            </div> :
            null
          }
        </div>
        <div className={styles.messageContainer}>
          <h2>{messageLoadStatement}</h2>
        </div>
        {/* Uncomment Below And Use Button To Get Cart Status */}
        {/* <button style={{padding: 'var(--size-ten)', background: 'var(--nav-font-color)', color: 'var(--nav-option-bk-color)', border: '1px solid var(--nav-option-bk-color)', borderRadius: 'var(--size-five)'}} onClick={this.onClickRetrieveCart}>Check Cart Status</button> */}
        <ul className={styles.navBar}>
          {
            navBar.map((item, index) => (
              <NavBar 
                className={styles.selected} 
                onClick={this.onClickRender} 
                onClickGenerateNewCart={this.onClickGenerateNewCart}
                onClickReduceCartObject={this.onClickReduceCartObject} 
                onClickLogOutUser={this.onClickLogOutUser}
                cartItemsTotal={cartItemsTotal} 
                render={render} 
                name={item} 
                key={`${item}${index}`}
              />
            ))
          }
        </ul>
        { render === home ? <Home props={render}/> : null }
        { render === products ? 
          <ProductContainer 
            props={this.state} 
            onClickAddToCart={this.onClickAddToCart}
          /> : 
          null 
        }
        { render === cart ?
          <CartContainer 
            render={render} 
            cashTotal={cashTotal} 
            cartData={cartData} 
            data={data}
            cartId={cartId}
            cartItemsTotal={cartItemsTotal}
            onClickRemoveFromCart={this.onClickRemoveFromCart}
            onClickAmountDue={this.amountDue}
            onClickUpdateCart={this.onClickUpdateCart}
            onClickResetConfirmationData={this.onClickResetConfirmationData}
          /> : 
          null 
        }
        {
          render === loginSignUp ?
          <LoginSignUpContainer
            onClickGetUserInfo={this.onClickGetUserInfo}
            onClickRender={this.onClickRender}
          /> :
          null
        }
        {
          render === user ?
          <User
            userInfo={userInfo}
            logoutButton={logoutButton}
          /> :
          null
        }
      </div>
    )
  }
}

export default Container; 