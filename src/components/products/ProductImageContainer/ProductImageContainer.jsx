import React from 'react';
import ProductImages from '../ProductImages/ProductImages';
import styles from './ProductImageContainer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

class ProductImageContainer extends React.Component {

  onClickLeftArrow = () => {
    this.props.onClickLeftArrow();
  }

  onClickRightArrow = () => {
    this.props.onClickRightArrow();
  }

  render() {
    const { description, onClickX, name, imageAndCounterArray } = this.props;

    const x = <FontAwesomeIcon className={styles.x} onClick={onClickX} icon={faXmark}/>;
    const leftArrow = <FontAwesomeIcon onClick={this.onClickLeftArrow} className={styles.leftArrow} icon={faAngleLeft}/>;
    const rightArrow = <FontAwesomeIcon onClick={this.onClickRightArrow} className={styles.rightArrow} icon={faAngleRight}/>;
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer} onClick={onClickX}>
          <div className={styles.nameContainer}>
            {x}
            <h2>{name}</h2>
          </div>
          <div className={styles.imageContainer}>
            {
              imageAndCounterArray.map((item, index) => (
                <ProductImages 
                  count={item.count} 
                  key={`${item.image}${index}`} 
                  image={item.image}
                  imageAndCounterArray={imageAndCounterArray} 
                  name={name}
                />
              ))
            }
          </div>
          <p>{description}</p>
          {/* {leftArrow}
          {rightArrow} */}
        </div>
        {leftArrow}
        {rightArrow}
      </div>
    )
  }
}

export default ProductImageContainer;