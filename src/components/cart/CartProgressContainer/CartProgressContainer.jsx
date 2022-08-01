import React from 'react';
import CartProgressListItems from '../CartProgressListItems/CartProgressListItems';
import styles from './CartProgressContainer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTruckFast, faCreditCard, faCircleCheck, faCheck } from '@fortawesome/free-solid-svg-icons';

import { cart, shipping, payment, confirmation } from '../../constants';

const buildIcon = (icon, className, name) => 
  name === cart ?
  <div className={`${styles.iconContainerCart} ${className}`}>
    <FontAwesomeIcon className={styles.icons} icon={icon}/>
  </div> :
  name === confirmation ?
  <div className={`${styles.iconContainerConfirmation} ${className}`}>
    <FontAwesomeIcon className={styles.icons} icon={icon}/>
  </div> :
  <div className={`${styles.iconContainer} ${className}`}>
    <FontAwesomeIcon className={styles.icons} icon={icon}/>
  </div>
;

const buildObject = (iconOne, iconTwo, iconThree, iconFour) => {
  const objectArray = [
    {icon: iconOne, name: cart},
    {icon: iconTwo, name: shipping},
    {icon: iconThree, name: payment},
    {icon: iconFour, name: confirmation},
  ]
  return objectArray
}

const FIRST_ICONS = buildObject(
  buildIcon(faCartShopping, styles.cartStartCheckout, cart),
  buildIcon(faTruckFast, undefined, shipping),
  buildIcon(faCreditCard, undefined, payment),
  buildIcon(faCircleCheck, undefined, confirmation),
)

const SECOND_ICONS = buildObject(
  buildIcon(faCheck, styles.cartCompleteCart, cart),
  buildIcon(faTruckFast, styles.cartCompleteShipping, shipping),
  buildIcon(faCreditCard, undefined, payment),
  buildIcon(faCircleCheck, undefined, confirmation),
)

const THIRD_ICONS = buildObject(
  buildIcon(faCheck, styles.cartCompleteCart, cart),
  buildIcon(faCheck, styles.shippingCompleteShipping, shipping),
  buildIcon(faCreditCard, styles.shippingCompletePayment, payment),
  buildIcon(faCircleCheck, undefined, confirmation),
)

const FOURTH_ICONS = buildObject(
  buildIcon(faCheck, styles.cartCompleteCart, cart),
  buildIcon(faCheck, styles.shippingCompleteShipping, shipping),
  buildIcon(faCheck, styles.paymentCompletePayment, payment),
  buildIcon(faCircleCheck, styles.paymentCompleteConfirmation, confirmation),
)


class CartProgressContainer extends React.Component {
  render () {
    const { cartProgress } = this.props;

    const loadIcons = 
      cartProgress === cart ? FIRST_ICONS :
      cartProgress === shipping ? SECOND_ICONS :
      cartProgress === payment ? THIRD_ICONS :
      cartProgress === confirmation ? FOURTH_ICONS :
      null
    ;

    return (
      <div className={styles.cartProgressContainer}>
        <ul className={styles.iconList}>
          {
            loadIcons.map((item, index) => (
              <CartProgressListItems
                key={`${item.name}${index}`}
                item={item}
                cartProgress={cartProgress}
              />
            ))
          }
        </ul>
      </div>
    )
  }
}

export default CartProgressContainer;