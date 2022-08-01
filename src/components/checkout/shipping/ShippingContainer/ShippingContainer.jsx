import React from 'react';
import ShippingContainerInputs from '../ShippingContainerInputs/ShippingContainerInputs';
import styles from './ShippingContainer.module.css'
import { TEXT, SELECT, RADIO } from '../../../constants';

const zipCode = 'zipCode';
const city = 'city';

class ShippingContainer extends React.Component {
  onLoad = (e) => {
    e.preventDefault();
  }

  render() {
    const { inputData, country } = this.props;

    const makeShippingContainerComponent = (item, index) => {
      return <ShippingContainerInputs
                key={`${item.name}${index}`}
                item={item}
                country={country}
              />
    };
    return (
      <div className={styles.containerWidth}>
        <form className={styles.formContainer} onLoad={this.onLoad}>
          <div className={styles.inputContainer}>
            {inputData.map((item, index) => (
              item.name !== zipCode && item.name !== city && item.type === TEXT ?
              makeShippingContainerComponent(item, index) :
              null
            ))}
          </div>
          <div className={styles.selectContainer}>
            {inputData.map((item, index) => (
              item.type === SELECT ?
              makeShippingContainerComponent(item, index) :
              null
            ))}
          </div>
          <div className={styles.inputContainer}>
            {inputData.map((item, index) => (
              item.name === zipCode || item.name === city ?
              makeShippingContainerComponent(item, index) :
              null
            ))}
          </div>
          <hr />
          <div className={styles.radioContainer}>
            <div className={styles.radioContainerButtons}>
              {inputData.map((item, index) => (
                item.type === RADIO ?
                makeShippingContainerComponent(item, index) :
                null
              ))}
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default ShippingContainer; 