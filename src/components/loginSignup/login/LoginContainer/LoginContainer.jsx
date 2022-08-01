import React from 'react';
import LoginInputs from '../LoginInputs/LoginInputs';
import styles from '../LoginContainer/LoginContainer.module.css';

class LoginContainer extends React.Component {
  render() {
    const {inputData} = this.props;

    return (
      <div className={styles.loginContainer}>
        {inputData.map((item, index) => (
          <LoginInputs
            key={`${item.name}${index}`}
            item={item}
          />
        ))}
      </div>
    )
  }
}

export default LoginContainer;