import React from 'react';
import styles from './NavBar.module.css'

const cart = 'cart'

class NavBar extends React.Component{
  render() {
    const { onClick, name, cartItemsTotal} = this.props;

    const cartTotalClass = 
      cartItemsTotal >= 1000 ? styles.totalIsGreaterThan1000 : 
      cartItemsTotal >= 100 ? styles.totalIsGreaterThan100 : 
      styles.cartTotal
    ;
    return(
      <div className={styles.cartTotalContainer}>
        <li name={name} onClick={onClick}>
          {name}
        </li>
        {
          name === cart ?
          <div className={cartTotalClass}>{cartItemsTotal}</div> :
          null
        }
      </div>
    )
  }
}

export default NavBar;