import React from 'react';
import styles from '../PaymentContainerInput/PaymentContainerInput.module.css';

import { CVV, CARD_NUMBER } from '../../../constants';
import { makeNameIntoTitle } from '../../../functions'

class PaymentContainerInput extends React.Component {
  render () {
    const { item } = this.props;
    const { name, error, value, maxLength, className, type, placeholder, getValueFunction, onBlurFunction, cardType, cardImage } = item;
    const title = name === CVV ? name.toUpperCase() : makeNameIntoTitle(name);
    return (
      <label htmlFor={name}>
        <div className={`${styles.inputAndTitleContainer} ${className}`}>
          <div className={styles.nameContainer}>
            <div className={styles.name}>{title}</div>
          </div>
          <div className={styles.inputAndErrorContainer}>
            <div className={styles.inputContainer}>
              <input
                value={value}
                className={`${styles.inputs} ${name === CARD_NUMBER ? styles.cardInput : null}`}
                onChange={getValueFunction}
                onBlur={onBlurFunction}
                name={name}
                id={name}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
              />
              {
                cardImage ?
                <div className={styles.imageContainer}>
                  <img src={cardImage} alt={name} />
                </div> :
                null
              }
              {
                cardType ?
                <div className={styles.cardType}>{cardType}</div> :
                null
              }
            </div>
            {
              error && error.length ?
              <div className={styles.errors}>{error}</div> :
              null
            }
          </div>
        </div>
      </label>
    )
  }
}

export default PaymentContainerInput;