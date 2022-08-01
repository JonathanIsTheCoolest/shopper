import React from 'react';
import Products from '../Products/Products';
import ProductCategories from '../ProductCategories/ProductCategories';
import ProductSearchBar from '../ProductSearchBar/ProductSearchBar';
import styles from './ProductContainer.module.css';

const all = 'all'

const categoryArray = [ 'all', 'shoes', 'shirts', 'pants', 'jackets', 'accessories', ];

const INIT_STATE = {
  selected: all,
  searchBarValue: '',
  searchDataArray: [],
};

class ProductContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INIT_STATE,
      selectedData: this.props.props.data,
    };
  }

  selectProductsByCategory = (name) => {
    const dataArray = []

    const { data } = this.props.props;

    if ( data.length ) {
      for ( const info of data ) {
        const category = info.category.toLowerCase();
        if ( name === all ) {
          dataArray.push(info);
        } else if ( name === category ) {
          dataArray.push(info)
        }
      }
      this.setState({
        selectedData: dataArray,
        searchBarValue: '',
      })
    }
  }

  onChangeSearch = (e) => {
    const searchDataArray = [];

    const { selectedData } = this.state;

    const value = e.target.value.toLowerCase();

    if ( selectedData.length ) {
      for (const data of selectedData) {
        const name = data.name.toLowerCase();
        const category = data.category.toLowerCase();
        const description = data.description.toLowerCase();
        if (name.includes(value) || category.includes(value) || description.includes(value)) {
          searchDataArray.push(data);
        }
      }
      this.setState({ 
        searchDataArray: searchDataArray,
        searchBarValue: value,
      })
    }
  }

  onClickSelect = (e) => {
    const name = e.target.textContent;
    this.setState({ selected: name })
    this.selectProductsByCategory(name);
  }

  onClickAddToCart = (cartData, data, selectedData, searchData) => {
    const { searchBarValue, searchDataArray } = this.state;

    if (searchBarValue.length) {
      this.setState({ selectedData: selectedData, searchDataArray: searchData })
      this.props.onClickAddToCart(cartData, data);
    } else {
      this.setState({ selectedData: selectedData, searchDataArray: searchDataArray })
      this.props.onClickAddToCart(cartData, data);
    }
  }

  render() {
    const { selected, selectedData, searchDataArray, searchBarValue } = this.state;

    const { loading, error, data, render, cartId } = this.props.props;

    const categoryNav = 
      categoryArray.map((item, index) => (
        <ProductCategories 
          onClick={this.onClickSelect} 
          selected={selected} 
          key={`${item}${index}`} 
          name={item}
        />
      ))
    ;

    const displayProductPage =
      !loading && !error && searchBarValue.length ?
      searchDataArray.map((item, index) => (
        <Products 
          key={`${item.name.replace(' ', '')}${index}`} 
          data={data} selectedData={selectedData} 
          searchBarValue={searchBarValue} 
          searchDataArray={searchDataArray} 
          props={item} 
          onClickAddToCart={this.onClickAddToCart}
          render={render}
          cartId={cartId}
        />
      )) :
      !loading && !error && !searchBarValue.length && !selectedData.length ?
      data.map((item, index) => (
        <Products 
          key={`${item.name.replace(' ', '')}${index}`} 
          data={data} selectedData={selectedData} 
          props={item} 
          onClickAddToCart={this.onClickAddToCart}
          render={render}
          cartId={cartId}
        />
      )) :
      !loading && !error && !searchBarValue.length ?
      selectedData.map((item, index) => (
        <Products 
          key={`${item.name.replace(' ', '')}${index}`} 
          data={data} 
          selectedData={selectedData} 
          props={item} 
          onClickAddToCart={this.onClickAddToCart}
          render={render}
          cartId={cartId}
        />
      )) :
      loading  ?
      <div>Loading...</div> :
      error ?
      <div>Something Went Wrong</div> :
      null
    ;

    return(
      <div>
        <ul className={styles.navBar}>
          {categoryNav}
        </ul>
        <ProductSearchBar value={searchBarValue} onChange={this.onChangeSearch} key="searchBar0"/>
        {displayProductPage}
      </div>
    )
  }
}

export default ProductContainer;