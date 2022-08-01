import React from 'react';
import styles from './ProductSearchBar.module.css'

class ProductSearchBar extends React.Component {
  render() {
    const { value, onChange } = this.props
    return (
      <div className={styles.searchBarContainer}>
        <label htmlFor="search">
          <input value={value} onChange={onChange} className={styles.searchBar} id="search" name="search" type="text" placeholder="Search..." />
        </label>
      </div>
    )
  }
}

export default ProductSearchBar;