import React from 'react';
import CartProgressContainer from '../CartProgressContainer/CartProgressContainer';
import CheckoutContainer from '../../checkout/CheckoutContainer/CheckoutContainer';
import Products from '../../products/Products/Products';
import GenerateCheckoutToken from '../../apiCalls/generateCheckoutToken';
import GetShippingCountries from '../../apiCalls/getShippingCountries';
import SetTaxZone from '../../apiCalls/setTaxZone';
import EmptyCart from '../../apiCalls/emptyCart';
import styles from './CartContainer.module.css';

import { cart, shipping, payment, confirmation, firstName, lastName, 
  email, address, city, SHIPPING_INFO, standard, express, 
  standardPerItemCost, expressPerItemCost, giveDiscountAfterSaidAmount,
  PAYMENT_INFO, NAME_ON_CARD, CARD_NUMBER, EXPIRATION_DATE, CVV, CARD_DATA,
} from '../../constants';
import { makeButtons, hasError } from '../../functions';
import { nameAndTitleValidation, addressValidation, emailValidation, numberValidation } from '../../validations/shippingValidations';
import { validateMajorCardType, validateCVV, validateExpirationDate } from '../../validations/paymentValidation';

const goToShipping = 'Go To Shipping';
const backToCart = 'Back To Cart';
const goToBilling = 'Go To Billing';
const backToShipping = 'Back To Shipping';
const makeAPayment = 'Make A Payment';

const displayCartItems = 'Display Cart Items';
const hideCartItems = 'Hide Cart Items';
const displayOrderItems = 'Display Order Items';
const hideOrderItems = 'Hide Order Items';

const generateCheckoutToken = new GenerateCheckoutToken();
const getShippingCountries = new GetShippingCountries();
const setTaxZone = new SetTaxZone();
const emptyCart = new EmptyCart();

const { radioValue, ...SHIPPING_INFO_ERRORS} = SHIPPING_INFO; 

const INIT_STATE = {
  cartProgress: cart,
  displayProducts: false,
  generatingCheckoutToken: false,
  gettingShippingCountries: false,
  settingTaxZone: false,
  error: false,
  checkoutTokenId: '',
  countries: {},
  taxDue: 0,
  shippingDue: 0,
  shippingInfo: SHIPPING_INFO,
  shippingInfoErrors: SHIPPING_INFO_ERRORS,
  paymentInfo: PAYMENT_INFO,
  paymentInfoErrors: PAYMENT_INFO,
  cardData: CARD_DATA,
  confirmationItemsTotal: 0,
  confirmationCashTotal: 0,
}

class CartContainer extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      ...INIT_STATE,
      confirmationData: Object.assign([{}], this.props.cartData),
    };
  }

  onChangeShipping = (shippingInfo) => {
    this.setState({
      shippingInfo: shippingInfo,
    })
  }

  onChangePayment = (paymentInfo) => {
    this.setState({
      paymentInfo: paymentInfo,
    })
  }

  onChangeGetCardType = (cardType) => {
    this.setState({
      cardData: cardType,
    })
  }

  onBlurErrorsShipping = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const maxLength = e.target.maxLength;

    const setStateFunction = (name, value) => {
      this.setState((prevState) => ({
        shippingInfoErrors: {
          ...prevState.shippingInfoErrors,
          [name]: value
        }
      }))
    }

    if (!value.length) {
      setStateFunction(name, '')
    } else if (value.length) {
      if (name === firstName || name === lastName || name === city ) {
        setStateFunction(name, nameAndTitleValidation(name, value))
      } else if (name === address) {
        setStateFunction(name, addressValidation(value))
      } else if (name === email) {
        setStateFunction(name, emailValidation(value))
      } else if (maxLength > 0) {
        setStateFunction(name, numberValidation(name, value, maxLength))
      } else {
        setStateFunction(name, undefined)
      }
    }
  }

  onBlurErrorsPayment = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const maxLength = e.target.maxLength;

    const setStateFunction = (name, value) => {
      this.setState((prevState) => ({
        paymentInfoErrors: {
          ...prevState.paymentInfoErrors,
          [name]: value
        }
      }))
    }

    if (!value.length) {
      setStateFunction(name, '')
    } else if (value.length) {
      if (name === NAME_ON_CARD ) {
        setStateFunction(name, nameAndTitleValidation(name, value))
      } else if (name === CARD_NUMBER) {
        setStateFunction(name, validateMajorCardType(value))
      } else if (name === EXPIRATION_DATE) {
        setStateFunction(name, validateExpirationDate(name, value, maxLength))
      } else if (name === CVV) {
        setStateFunction(name, validateCVV(value, maxLength))
      }
    }
  }

  onClickNextPage = (infoErrors, state) => {
    const errorArray = [];
    for (const item in infoErrors) {
      if ( infoErrors[item] !== undefined ) {
        errorArray.push(infoErrors[item])
        break;
      }
    }
    if (!errorArray.length) {
      this.setState(state)
    }
  }

  onClickRequired = (info, infoErrorsName, infoErrorsState, state) => {
    const required = 'required';
    const currentErrorObject = Object.assign({}, infoErrorsState);

    const setStateFunction = (item, infoErrorsName, value) => {
      this.setState((prevState) => ({
        [infoErrorsName]: {
          ...prevState[infoErrorsName],
          [item]: value,
        }
      }))
    }

    for (const item in info) {
      if ( !info[item].length ) {
        setStateFunction(item, infoErrorsName, required);
        currentErrorObject[item] = required;
      } else if ( info[item].length && infoErrorsState[item] !== undefined && !infoErrorsState[item].length ) {
        setStateFunction(item, infoErrorsName, undefined);
        currentErrorObject[item] = undefined;
      }
    }
    this.onClickNextPage(currentErrorObject, state)
  }

  setTaxZone = () => {
    const { checkoutTokenId } = this.state;

    this.setState({ settingTaxZone: true })
    setTaxZone.setTaxZone(checkoutTokenId)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ taxDue: res.totalTax, settingTaxZone: false, error: false })
        // Uncomment Below To Log Tax Breakdown onClickGoToBilling
        // console.log(res.breakdown);
      } else {
        this.setState({ taxDue: '', settingTaxZone: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ taxDue: '', settingTaxZone: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  emptyCart = () => {
    const { cartId } = this.props;

    this.setState({ deletingCartContent: true })
    emptyCart.deleteData(cartId)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ deletingCartContent: false, error: false })
        console.log('Cart was successfully cleared')
      } else {
        this.setState({ deletingCartContent: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ deletingCartContent: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  generateCheckoutToken = () => {
    const { cartId } = this.props;

    this.setState({ generatingCheckoutToken: true })
    generateCheckoutToken.generateToken(cartId)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ checkoutTokenId: res.checkoutTokenId, generatingCheckoutToken: false, error: false })
        this.generateShippingCountries(res.checkoutTokenId)
      } else {
        this.setState({ checkoutTokenId: '', generatingCheckoutToken: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ checkoutTokenId: '', generatingCheckoutToken: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  generateShippingCountries = (checkoutTokenId) => {
    this.setState({ gettingShippingCountries: true })
    getShippingCountries.fetchData(checkoutTokenId)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ countries: res.countries, gettingShippingCountries: false, error: false })
      } else {
        this.setState({ countries: {}, gettingShippingCountries: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ countries: {}, gettingShippingCountries: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  onClickGetShippingTotal = (currentRadioValue) => {
    const { cartItemsTotal, cashTotal } = this.props;
    const { shippingInfo } = this.state;
    const { radioValue } = shippingInfo;

    const getTotal = (itemCost) => {
      return (cartItemsTotal * 1) * (itemCost * 1);
    }

    const ifCurrentRadioValue = 
      currentRadioValue ? currentRadioValue : radioValue
    ;

    const isOverAmountIfStatement = (itemCostOne, itemCostTwo) => {
      if (cashTotal >= giveDiscountAfterSaidAmount) {
        this.setState({ shippingDue: itemCostOne })
      } else {
        this.setState({ shippingDue: itemCostTwo })
      }
    }

    if (ifCurrentRadioValue === standard) {
      isOverAmountIfStatement(0, getTotal(standardPerItemCost))
    } else if (ifCurrentRadioValue === express) {
      isOverAmountIfStatement(getTotal(standardPerItemCost), getTotal(expressPerItemCost))
    }
  }

  onClickGoToShipping = () => {
    const { cartData } = this.props;
    if ( cartData.length ) {
      this.generateCheckoutToken();
      this.onClickGetShippingTotal();
      this.setState({ cartProgress: shipping })
      this.props.onClickUpdateCart(shipping);
    }
  }

  onClickGoToBilling = () => {
    const { checkoutTokenId, shippingInfo, shippingInfoErrors } = this.state;
    const cartProgressIsPayment = { cartProgress: payment }
    const shippingInfoErrorsTitle = 'shippingInfoErrors';

    if (checkoutTokenId.length) {
      if (!hasError(shippingInfoErrors)) {
        this.setTaxZone();
        this.props.onClickUpdateCart(payment);
      }
      this.onClickRequired(shippingInfo, shippingInfoErrorsTitle, shippingInfoErrors, cartProgressIsPayment);
    }
  }

  onClickMakeAPayment = () => {
    const { paymentInfo, paymentInfoErrors } = this.state;
    const cartProgressIsConfirmation = { cartProgress: confirmation }
    const paymentInfoErrorsTitle = 'paymentInfoErrors';
    this.onClickRequired(paymentInfo, paymentInfoErrorsTitle, paymentInfoErrors, cartProgressIsConfirmation)
    if (!hasError(paymentInfoErrors)) {
      this.emptyCart();
      this.props.onClickResetConfirmationData();
      this.props.onClickUpdateCart(confirmation);
      this.setState({
        confirmationItemsTotal: this.props.cartItemsTotal,
      })
    }
  }

  onClickGoBackToCart = () => {
    this.setState({ cartProgress: cart, shippingInfo: SHIPPING_INFO, shippingInfoErrors: SHIPPING_INFO_ERRORS })
    this.props.onClickUpdateCart(cart);
  }

  onClickGoBackToShipping = () => {
    const { taxDue } = this.state;
    if (taxDue > 0) {
      this.setState({ cartProgress: shipping, taxDue: 0 })
      this.props.onClickUpdateCart(shipping);
    }
  }

  onClickDisplayCartItems = () => {
    this.setState({ displayProducts: true })
  }

  onClickHideCartItems = () => {
    this.setState({ displayProducts: false })
  }

  render() {
    const { cartProgress, displayProducts, taxDue, shippingDue, countries, shippingInfoErrors, paymentInfoErrors, cardData, confirmationData, confirmationItemsTotal } = this.state;

    const { cartData, cashTotal, render, data, onClickRemoveFromCart, cartItemsTotal, cartId } = this.props;

    const displayCartItemsTextStatement = cartProgress !== confirmation ? displayCartItems : displayOrderItems;
    const hideCartItemsTextStatement = cartProgress !== confirmation ? hideCartItems : hideOrderItems;

    const goToShippingButton = makeButtons( goToShipping, this.onClickGoToShipping );
    const backToCartButton = makeButtons( backToCart, this.onClickGoBackToCart );
    const goToBillingButton = makeButtons( goToBilling, this.onClickGoToBilling );
    const backToShippingButton = makeButtons( backToShipping, this.onClickGoBackToShipping );
    const makeAPaymentButton = makeButtons( makeAPayment, this.onClickMakeAPayment );
    const displayCartItemsButton = makeButtons( displayCartItemsTextStatement, this.onClickDisplayCartItems );
    const hideCartItemsButton = makeButtons( hideCartItemsTextStatement, this.onClickHideCartItems );

    const displayButtonsProductStatement = 
      displayProducts && cartProgress !== cart ? hideCartItemsButton :
      !displayProducts && cartProgress !== cart ? displayCartItemsButton :
      null
    ;

    const buttonStatement = (buttonOne, buttonTwo, buttonThree) => {
      const statement = 
        cartProgress === cart ?
        buttonOne :
        cartProgress === shipping ?
        buttonTwo :
        cartProgress === payment ?
        buttonThree :
        null
      ;
      return statement
    };

    const renderButton = (button) => cartData.length ? button : null;

    const backButtonStatement = buttonStatement(goToShippingButton, backToCartButton, backToShippingButton);
    const forwardButtonStatement = buttonStatement(goToShippingButton, goToBillingButton, makeAPaymentButton);

    const totalRender = cartData.length ? styles.dataTotalText : styles.noDataTotalText;

    const total = (cashTotal * 1) + (shippingDue * 1) + (taxDue * 1);

    const totalStatement = 
      taxDue <= 0 ?
      <div className={totalRender}>Subtotal: ${cashTotal}</div> :
      cartProgress === confirmation ?
      <div className={totalRender}>You Spent: ${total.toFixed(2)}</div> :
      <div className={totalRender}>Total: ${total.toFixed(2)}</div>
    ; 

    const buttons = 
      <div className={styles.buttonContainer}>
        {renderButton(backButtonStatement)}
        {totalStatement}
        {renderButton(forwardButtonStatement)}
      </div>
    ;

    const isConfirmationStatement = (useIfTrue, useIfFalse) => {
      const statement = 
        cartProgress === confirmation ? useIfTrue : useIfFalse
      ;
      return statement
    }

    const ProductComponent = (cartData) => {
      const products =
       cartData.map((item, index) => (
          <Products 
            key={`${item.name.replace(' ', '').toLowerCase()}${index}`} 
            render={render} 
            props={item}
            data={data}
            cartData={confirmationData}
            cartProgress={cartProgress}
            onClickRemoveFromCart={onClickRemoveFromCart}
            cartItemsTotal={isConfirmationStatement(confirmationItemsTotal, cartItemsTotal)}
            cartId={cartId}
          />
        ))
      ;

      return products;
    }

    const cartProgressRenderContainerClasses = (className) => {
      return cartProgress !== cart ? className : null
    };

    const displayProductContainerClass = cartProgressRenderContainerClasses(styles.displayProductContainer); 
    const hideProductContainerClass = cartProgressRenderContainerClasses(styles.hideProductContainer); 
    const checkoutContainerClass = cartProgressRenderContainerClasses(styles.checkoutContainer); 

    const productContainerClass = 
      displayProducts ? displayProductContainerClass :
      !displayProducts ? hideProductContainerClass :
      null
    ;

    return(
      <div>
        <CartProgressContainer cartProgress={cartProgress}/>
        {buttons}
        <div className={checkoutContainerClass}>
          {
            cartProgress !== cart ?
            <CheckoutContainer
              cartData={isConfirmationStatement(confirmationData, cartData)}
              cartProgress={cartProgress}
              key={`checkoutContainer0`}
              cartItemsTotal={isConfirmationStatement(confirmationItemsTotal, cartItemsTotal)}
              cashTotal={cashTotal}
              cartTotal={total}
              cartId={cartId}
              countries={countries}
              taxDue={taxDue}
              shippingDue={shippingDue}
              shippingInfoErrors={shippingInfoErrors}
              onChangeShipping={this.onChangeShipping}
              onBlurErrorsShipping={this.onBlurErrorsShipping}
              onClickGetShippingTotal={this.onClickGetShippingTotal}
              onChangePayment={this.onChangePayment}
              onBlurErrorsPayment={this.onBlurErrorsPayment}
              onChangeGetCardType={this.onChangeGetCardType}
              paymentInfoErrors={paymentInfoErrors}
              cardData={cardData}
            /> :
            null
          }
        </div>
        <div className={styles.displayOrHideContentButtons}>
          {displayButtonsProductStatement}
        </div>
        <div className={productContainerClass}>
          {
            cartProgress === confirmation ?
            ProductComponent(confirmationData) :
            ProductComponent(cartData)
          }
        </div>
        {cartData.length ? buttons : null}
      </div>
    )
  }
}

export default CartContainer;