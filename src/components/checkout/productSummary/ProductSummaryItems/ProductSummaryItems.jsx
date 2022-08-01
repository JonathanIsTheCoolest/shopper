import React from 'react';
import styles from './ProductSummaryItems.module.css';

class ProductSummaryItems extends React.Component {
  render () {
    const {item} = this.props;
    const {name, description: desc, price, quantity, image } = item;

    const individualTotal = ((price * 1) * (quantity * 1)).toFixed(2);

    const description = desc.replaceAll('<p>', '').replaceAll('</p>', '');
    return (
      <div className={styles.ProductSummaryItemsContainer}>
        <div className={styles.nameAndImageContainer}>
          <h3>{name}</h3>
          <div className={styles.imageContainer}>
            <img src={image} alt={description} />
          </div>
        </div>
        <div className={styles.description}>{description}</div> 
        <div className={styles.priceAndQuantityContainer}>
          <div>Quantity: <strong>{quantity}</strong></div>
          <div>Total: <strong>${individualTotal}</strong></div>
        </div>
      </div>
    )
  }
}

export default ProductSummaryItems;