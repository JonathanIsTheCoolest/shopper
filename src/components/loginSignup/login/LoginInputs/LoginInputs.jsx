import React from 'react';
import { makeNameIntoTitle } from '../../../functions';
import styles from '../../../checkout/payment/PaymentContainerInput/PaymentContainerInput.module.css'


class LoginInputs extends React.Component {
  render() {
    const { item } = this.props;
    const { name, error, value, className, type, placeholder, getValueFunction, onBlurFunction, eye } = item;

    const title = makeNameIntoTitle(name);
    return(
        <label htmlFor={name}>
          <div className={`${styles.inputAndTitleContainer} ${className}`}>
            <div className={styles.nameContainer}>
              <div className={styles.name}>{title}</div>
            </div>
            <div className={styles.inputAndErrorContainer}>
              <div className={styles.inputContainer}>
                <input 
                  className={`${styles.inputs} ${eye ? styles.eyePadding : null}`}
                  name={name}
                  value={value}
                  type={type} 
                  placeholder={placeholder}
                  onChange={getValueFunction}
                  onBlur={onBlurFunction}
                />
                <div className={styles.eyeContainer}>
                  {eye ? eye : null}
                </div>
              </div>
              <div className={styles.errors}>{error}</div>
            </div>
          </div>
        </label>
    )
  }
}

export default LoginInputs