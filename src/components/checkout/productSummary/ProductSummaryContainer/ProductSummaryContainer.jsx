import React from 'react';
import ProductSummaryItems from '../ProductSummaryItems/ProductSummaryItems';
import { makeButtons } from '../../../functions';
import styles from './ProductSummaryContainer.module.css';

import { confirmation } from '../../../constants';

const displayCartOverview = 'Display Cart Overview';
const hideCartOverview = 'Hide Cart Overview';
const displayOrderDetails = 'Display Order Details';
const hideOrderDetails = 'Hide Order Details';

const productOverview = 'Product Overview';
const orderSummary = 'Order Summary';

const INIT_STATE = {
  displayProducts: false,
}

class ProductSummaryContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = INIT_STATE;
  }

  onClickDisplayCartOverview = () => {
    this.setState({ displayProducts: true })
  }

  onClickHideCartOverview = () => {
    this.setState({ displayProducts: false })
  }

  render () {
    const { displayProducts } = this.state;
    const { cartProgress, cartData, cartItemsTotal, cashTotal, taxDue, shippingDue, cartTotal } = this.props;

    const buttonTextDisplayStatement = cartProgress !== confirmation ? displayCartOverview : displayOrderDetails;
    const buttonTextHideStatement = cartProgress !== confirmation ? hideCartOverview : hideOrderDetails;

    const displayCartOverviewButton = makeButtons( buttonTextDisplayStatement, this.onClickDisplayCartOverview );
    const hideCartOverviewButton = makeButtons( buttonTextHideStatement, this.onClickHideCartOverview );

    const displayButtons = 
      displayProducts ? hideCartOverviewButton :
      !displayProducts ? displayCartOverviewButton :
      null
    ;

    const displayProductsContainerClasses = 
      displayProducts ? styles.productContainerVisible :
      !displayProducts ? styles.productContainerHidden :
      null
    ;

    const orderedInCartStatement = 
      cartProgress !== confirmation ? 'In Cart' : 'Ordered'
    ;

    return (
      <div className={styles.productSummaryContainer}>
        <h2>{cartProgress !== confirmation ? productOverview : orderSummary}</h2>
        <h3>Items {orderedInCartStatement}: <strong>{cartItemsTotal}</strong></h3>
        {displayButtons}
        <div className={displayProductsContainerClasses}>
          <hr />
          {
            cartData.map((item, index) => (
              <ProductSummaryItems
                key={`${item.name[0].toLowerCase().concat(item.name.slice(1, item.name.length)).replace(' ', '')}${index}`}
                item={item}
              />
            ))
          }
          <hr />
        </div>
        <h3>Subtotal: <strong>${cashTotal}</strong></h3>
        <h3>Shipping: <strong>${shippingDue.toFixed(2)}</strong></h3>
        <h3>Tax: <strong>${taxDue.toFixed(2)}</strong></h3>
        <h3>Total: <strong>${cartTotal.toFixed(2)}</strong></h3>
      </div>
    )
  }
}

export default ProductSummaryContainer;