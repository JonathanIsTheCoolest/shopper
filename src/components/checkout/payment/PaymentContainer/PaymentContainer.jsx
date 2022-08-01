import React from 'react';
import PaymentContainerInput from '../PaymentContainerInput/PaymentContainerInput';
import styles from '../PaymentContainer/PaymentContainer.module.css';

class PaymentContainer extends React.Component {
  onLoad = (e) => {
    e.preventDefault();
  }

  render () {
    const { inputData } = this.props;
    return (
      <div className={styles.paymentContainer}>
        <form onLoad={this.onLoad}>
          {
            inputData.map((item, index) => (
              <PaymentContainerInput
                key={`${item.name}${index}`}
                item={item}
              />
            ))
          }
        </form>
      </div>
    )
  }
}

export default PaymentContainer;