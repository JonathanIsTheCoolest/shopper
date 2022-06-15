import React from 'react';
import ProductImages from '../ProductImages/ProductImages';
import styles from './ProductImageContainer.module.css'

class ProductImageContainer extends React.Component {
  render() {
    const { onClickX, name, images } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.nameContainer}>
            <div className={styles.x} onClick={onClickX}>X</div>
            <h2>{name}</h2>
          </div>
          <div className={styles.imageContainer}>
            {
              images.map((item, index) => (
                <ProductImages key={`${item}${index}`} image={item} name={name}/>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default ProductImageContainer