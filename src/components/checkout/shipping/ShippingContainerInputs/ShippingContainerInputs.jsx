import React from 'react';
import styles from './ShippingContainerInputs.module.css';

import { TEXT, SELECT, RADIO } from '../../../constants';
import { makeNameIntoTitle } from '../../../functions'

class ShippingContainerInputs extends React.Component {
  onClickGetShippingTotal = () => {
    const { item } = this.props;
    const { value, onClickGetShippingTotal: getTotal } = item
    getTotal(value)
  }

  render () {
    const { item } = this.props;
    const {name, error, value, message, className, type, maxLength, placeholder, optionsArray, currentRadioState, getValueFunction, getSubdivisionsFunction, onBlurFunction} = item;

    const inputAndTitleClassContainerStatement = 
      type === SELECT ?
      `${styles.inputAndTitleContainerSelect} ${className}` :
      `${styles.inputAndTitleContainerInput} ${className}`
    ;

    const nameTitle = makeNameIntoTitle(name);
    const valueTitle = value ? makeNameIntoTitle(value) : null;
    const titleStatement = type === RADIO ? valueTitle : nameTitle;
    return (
    <label htmlFor={name}>
      <div className={inputAndTitleClassContainerStatement}>
        <div className={styles.nameContainer}>
          <div className={styles.name}>{titleStatement}</div>
        </div>
        <div className={type === RADIO ? styles.inputContainerRadio : styles.errorAndInputContainer}>
          {
            type === TEXT ?
            <input 
              value={value} 
              className={`${styles.inputAndSelect} ${styles.inputs}`} 
              onChange={getValueFunction} 
              onBlur={onBlurFunction} 
              name={name} 
              id={name} 
              type={type} 
              maxLength={maxLength} 
              placeholder={placeholder}
            /> :
            type === SELECT ?
              <select 
                className={`${styles.inputAndSelect} ${styles.select}`} 
                onBlur={getSubdivisionsFunction ? getSubdivisionsFunction : onBlurFunction } 
                onChange={getValueFunction} 
                name={name} 
                id={name}
              >
                {optionsArray.map((item, index) => (
                  index === 0 ?
                  <option 
                    hidden 
                    key={`${ value.length ? value : item }${index}`} 
                    value={ value.length ? value : item }
                  >
                    { value.length ? value : item }
                  </option> :
                  <option key={`${item}${index}`} value={item}>{item}</option>
                ))}
              </select>:
              type === RADIO ?
              <input 
                value={value} 
                name={name} 
                id={value} 
                onChange={getValueFunction} 
                onClick={this.onClickGetShippingTotal}
                type={type} 
                checked={currentRadioState === value ? true : false}
              />
              :
            null
          }
          {
            error ? 
            <div className={styles.errors}>{error}</div> :
            null
          }
        </div>
        {
          message ?
          <div className={styles.shippingMessage}>{message}</div> :
          null
        }
      </div>
    </label>
    )
  }
}

export default ShippingContainerInputs;