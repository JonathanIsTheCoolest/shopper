import React from 'react';
import styles from './CartProgressListItems.module.css';

import { cart, shipping, payment, confirmation } from '../../constants';

class CartProgressListItems extends React.Component {
  render() {
    const { item, cartProgress } = this.props;
    const { name, icon } = item;

    const buildName = (className) => {
      const build = 
        <div className={className}>
          {name}
        </div>
      ;
      return build;
    }

    const nameStatement = 
    cartProgress === cart && name === cart ?
    buildName(styles.progressColorChange) :
    cartProgress === shipping && (name === cart || name === shipping ) ?
    buildName(styles.progressColorChange) :
    cartProgress === payment && name !== confirmation ?
    buildName(styles.progressColorChange) :
    cartProgress === confirmation ?
    buildName(styles.progressColorChange) :
    buildName(styles.iconNames)
    ;
    return (
      <li>
        {icon}
        {nameStatement}
      </li>
    )
  }
}

export default CartProgressListItems;