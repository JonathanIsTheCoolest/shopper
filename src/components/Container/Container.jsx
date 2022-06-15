import React from 'react';
import Fetch from '../fetch';
import styles from './Container.module.css'
import NavBar from '../NavBar/NavBar';
import Home from '../Home/Home';
import ProductContainer from '../products/ProductContainer/ProductContainer';

const data = new Fetch();

const INIT_STATE = {
  data: [],
  loading: false,
  error: false,
  render: 'home',
  cartItemsTotal: 0,
}

const home = 'home';
const products = 'products';
const cart = 'cart';
const loginSignUp = 'login/signUp';

const HOME_MESSAGE = 'Welcome to my store! I hope you find what you\'re looking for 🤓';
const PRODUCTS_MESSAGE = 'Check out all these sweet products! 🔥🔥🔥';
const EMPTY_CART_MESSAGE = 'Hey your carts empty! What the heck? buy something! 😠 😖 😤';
const FULL_CART_MESSAGE = 'Heck yah! Your getting some sweet products!!! 🔥🔥🔥';
const LOGIN_SIGN_UP_MESSAGE = 'Let\'s make this personal! 😜';

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

  renderNavOption = (e) => {
    const name = e.target.textContent;
    this.setState({ render: name })
  }

  render() {
    const { render, cartItemsTotal } = this.state;
    
    const messageLoadStatement = 
      render === home ? HOME_MESSAGE :
      render === products ? PRODUCTS_MESSAGE :
      render === cart && cartItemsTotal <= 0 ? EMPTY_CART_MESSAGE :
      render === cart && cartItemsTotal > 0 ? FULL_CART_MESSAGE :
      render === loginSignUp ? LOGIN_SIGN_UP_MESSAGE : null
    ;

    const navBar = [ 'home', 'products', 'cart', 'login/signUp' ];
    return (
      <div>
        <h1>Super Duper E-Commerce Store</h1>
        <h2>{messageLoadStatement}</h2>
        <ul className={styles.navBar}>
          {
            navBar.map((item, index) => (
              <NavBar onClick={this.renderNavOption} cartItemsTotal={cartItemsTotal} name={item} key={`${item}${index}`}/>
            ))
          }
        </ul>
        { render === home ? <Home props={this.state.render}/> : null }
        { render === products ? <ProductContainer props={this.state}/> : null }
      </div>
    )
  }
}

export default Container; 