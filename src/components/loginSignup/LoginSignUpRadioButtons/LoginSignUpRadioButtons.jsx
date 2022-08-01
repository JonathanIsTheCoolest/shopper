import React from 'react';
import styles from '../LoginSignUpRadioButtons/LoginSignUpRadioButtons.module.css'

import { makeNameIntoTitle } from '../../functions'

class LoginSignUpRadioButtons extends React.Component {
  render() {
    const { item, radioValue } = this.props;
    const { name, radioGroup, className, type, getValueFunction } = item;

    const title = makeNameIntoTitle(name);
    return (
      <div className={styles.radioButtonContainer}>
        <div className={styles.title}>{title}</div>
        <label htmlFor={radioGroup}>
          <input 
            type={type}
            value={name}
            name={radioGroup}
            id={name}
            checked={ name === radioValue ? true : false }
            onChange={getValueFunction} 
            className={className}
          />
        </label>

      </div>
    )
  }
}

export default LoginSignUpRadioButtons