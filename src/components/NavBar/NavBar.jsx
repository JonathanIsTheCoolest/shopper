import React from 'react';
import styles from './NavBar.module.css'

import { cart, loginSignUp, products } from '../constants';
import {makeNameIntoTitle} from '../functions';

const loginSignUpTitle = 'Login / Sign Up';

class NavBar extends React.Component{

  onClickCart = () => {
    const { onClick, onClickReduceCartObject, name } = this.props;
    onClick(name);
    onClickReduceCartObject();
  }

  onClickAll = () => {
    const { onClick, name } = this.props;
    onClick(name);
  }

  onClickGenerateNewCart = () => {
    const { onClick, onClickGenerateNewCart, name } = this.props;
    onClick(name);
    onClickGenerateNewCart();
  }

  render() {
    const { name, cartItemsTotal, render } = this.props;

    const selectedStatement = 
      name === render ?
      `${styles.cartTotalContainer} ${styles.selected}` :
      styles.cartTotalContainer
    ;

    const cartTotalClass = 
      cartItemsTotal >= 1000 ? styles.totalIsGreaterThan1000 : 
      cartItemsTotal >= 100 ? styles.totalIsGreaterThan100 : 
      styles.cartTotal
    ;

    const onClickStatement = 
      name === cart ? this.onClickCart :
      name === products ? this.onClickGenerateNewCart :
      this.onClickAll
    ;
    return(
      <div className={selectedStatement} onClick={onClickStatement}>
        <li name={name} onClick={onClickStatement}>
          {name === loginSignUp ? loginSignUpTitle : makeNameIntoTitle(name)}
        </li>
        {
          name === cart && render === name ?
          <div onClick={this.onClickCart} className={`${cartTotalClass} ${styles.cartSelected}`}>{cartItemsTotal}</div> :
          name === cart ?
          <div onClick={this.onClickCart} className={cartTotalClass}>{cartItemsTotal}</div> :
          null
        }
      </div>
    )
  }
}

export default NavBar;