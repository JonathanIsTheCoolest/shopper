import React from 'react';
import Products from '../Products/Products';

class ProductContainer extends React.Component {
  render() {
    const { data, loading, error, } = this.props.props;

    const displayProductPage =
      !loading && !error ?
      data.map((item, index) => (
        <Products key={`${item.name.replace(' ', '')}${index}`} props={item}/>
      )) :
      loading  ?
      <div>Loading...</div> :
      error ?
      <div>Something Went Wrong</div> :
      null
    ;
    return(
      <div>
        {displayProductPage}
      </div>
    )
  }
}

export default ProductContainer;