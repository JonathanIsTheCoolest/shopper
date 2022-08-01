import React from 'react';
import SignUpInputs from '../SignUpInputs/SignUpInputs';
import styles from '../SignUpContainer/SignUpContainer.module.css';

class SignUpContainer extends React.Component {
  render() {
    const {inputData} = this.props;

    return(
      <div className={styles.signUpContainer}>
        {inputData.map((item, index) => (
          <SignUpInputs
            key={`${item.name}${index}`}
            item={item}
          />
        ))}
      </div>
    )
  }
}

export default SignUpContainer