import React from 'react';
import drawing from '../../../assets/images/miscellaneous/drawing.png';
import styles from '../ConfirmationContainer/ConfirmationContainer.module.css';

import { formatXsAndLastFourCardNumbers } from '../../../functions';

class ConfirmationContainer extends React.Component {
  render () {
    const { cartTotal, shippingInfo, paymentInfo } = this.props;
    const { cardNumber } = paymentInfo;
    const { address, city, state, zipCode } = shippingInfo;

    const hiddenCard = formatXsAndLastFourCardNumbers(cardNumber);
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;

    const confirmationMessage = (hiddenCard, fullAddress, cartTotal) => {
      return (
        <div>
          To the person who just used card number <strong>{hiddenCard}</strong>, who
           may or may not live at <strong>{fullAddress}</strong>: I now own <strong>${cartTotal.toFixed(2)}</strong> of 
           what was probably your money!! There will be <strong>NO REFUNDS</strong>. Your products will be shipped 
           soon, and you will love every single one!
           You can see the order summary below or to the right 
           depending on the size of your device. Thank you for supporting my store!
        </div>
      )
    }
    return (
      <div className={styles.confirmationContainer}>
        <div className={styles.congratulations}>CONGRATULATIONS!</div>
        {confirmationMessage(hiddenCard, fullAddress, cartTotal)}
        <div><strong>P.S.</strong> For legal purposes, this is a joke.  </div>
        <div className={styles.imageContainer}>
          <img src={drawing} alt="It's a devil guy" />
        </div>
        <div className={styles.gotchya}>GOTCHYA!</div>
      </div>
    )
  }
}

export default ConfirmationContainer;