import React from 'react';
import styles from './ProductImages.module.css';

class ProductImages extends React.Component {
  render() {
    const { image, name } = this.props
    return(
      <div className={styles.imageContainer}>
        <img src={image} alt={name} />
      </div>
    )
  }
}

export default ProductImages;