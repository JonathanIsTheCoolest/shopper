import React from 'react';
import styles from './ProductImages.module.css';

class ProductImages extends React.Component {

  render() {

    const { image, name, count, imageAndCounterArray } = this.props;

    const cardPlacement = 
      count === 0 ?
      `${styles.imageContainer} ${styles.centerCard}` :
      count === 1 ?
      `${styles.imageContainer} ${styles.rightCard}` :
      count === imageAndCounterArray.length - 1 ?
      `${styles.imageContainer} ${styles.leftCard}` :
      `${styles.imageContainer} ${styles.notVisible}` 
    ;
    return(
      <div className={cardPlacement}>
        <img src={image} alt={name} />
      </div>
    )
  }
}

export default ProductImages;