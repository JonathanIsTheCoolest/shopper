import React from 'react';
import styles from './ProductCategories.module.css';

class ProductCategories extends React.Component {
  render() {
    const { name, onClick, selected } = this.props;

    const classStatement = 
      name === selected ? 
      `${styles.navOptions} ${styles.selected}` :
      styles.navOptions
    ;
    return (
      <li onClick={onClick} className={classStatement}>
        {name}
      </li>
    )
  }
}

export default ProductCategories;