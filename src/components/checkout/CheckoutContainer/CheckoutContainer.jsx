import React from 'react';
import ProductSummaryContainer from '../productSummary/ProductSummaryContainer/ProductSummaryContainer';
import ShippingContainer from '../shipping/ShippingContainer/ShippingContainer';
import PaymentContainer from '../payment/PaymentContainer/PaymentContainer';
import ConfirmationContainer from '../confirmation/ConfirmationContainer/ConfirmationContainer';
import GetCountrySubdivisions from '../../apiCalls/getCountrySubdivisions';
import styles from './CheckoutContainer.module.css';

import { TEXT, SELECT, RADIO, SHIPPING_INFO, shipping, payment, 
  confirmation, firstName, lastName, areaCode, phoneNumber, email, 
  address, country, state, city, zipCode, radioValue, standard, express, 
  standardPerItemCost, expressPerItemCost, giveDiscountAfterSaidAmount,
  NAME_ON_CARD, CARD_NUMBER, EXPIRATION_DATE, CVV, PAYMENT_INFO, CARD_DATA, 
} from '../../constants';
import { checkMajorCardType } from '../../validations/paymentValidation';
import { returnOnlyNumbers, limitAndFormatNumbers, limitAndFormatExpirationDate, cardExpirationDate } from '../../functions';

const getCountrySubdivisions = new GetCountrySubdivisions();


const makeCountriesAndSubdivisionsArray = (object) => {
  const initialArray = [SELECT];

  if (object !== {} && object !== []) {
    for (const item in object) {
      initialArray.push(item)
    }
    return initialArray;
  } else {
    return initialArray;
  }
};

const INIT_STATE = {
  shippingInfo: SHIPPING_INFO,
  paymentInfo: PAYMENT_INFO,
  subdivisions: [SELECT],
  gettingSubDivisions: false,
  loadingError: false,
};

class CheckoutContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = INIT_STATE;
  }

  onBlurGenerateCountrySubdivisions = (e) => {
    const { onBlurErrorsShipping } = this.props;
    const { country } = this.state.shippingInfo;

    if (country.length) {
      this.setState({ gettingCountrySubdivisions: true })
      getCountrySubdivisions.fetchData(country)
      .then((res) => {
        if (res && res.response.ok) {
          this.setState({ subdivisions: makeCountriesAndSubdivisionsArray(res.subdivisions), gettingCountrySubdivisions: false, loadingError: false })
        } else {
          this.setState({ subdivisions: makeCountriesAndSubdivisionsArray(res.subdivisions), gettingCountrySubdivisions: false, loadingError: true })
          console.log('Something went wrong');
          console.log(res.response);
        }
      }, (error) => {
        this.setState({ subdivisions: [SELECT], gettingCountrySubdivisions: false, loadingError: true })
        console.error('There was an error: ', error);
      })
    }

    onBlurErrorsShipping(e)
  }

  onChangeShipping = (e) => {
    const { shippingInfo } = this.state;
    const { onChangeShipping } = this.props;
    const currentShippingInfoObject = Object.assign({}, shippingInfo);


    const name = e.target.name;
    const value = e.target.value;
    const maxLength = e.target.maxLength;

    const setStateFunction = (stateValue) => {
      this.setState((prevState) => ({
        shippingInfo: {
          ...prevState.shippingInfo,
          [name]: stateValue,
        }
      }))
    }

    if (maxLength > 0) {
      setStateFunction(limitAndFormatNumbers(name, returnOnlyNumbers(value)))
      currentShippingInfoObject[name] = limitAndFormatNumbers(name, returnOnlyNumbers(value));
    } else {
      setStateFunction(value)
      currentShippingInfoObject[name] = value;
    }
    onChangeShipping(currentShippingInfoObject)
  }

  onChangePayment = (e) => {
    const { paymentInfo } = this.state;
    const { onChangePayment, onChangeGetCardType } = this.props;
    const currentPaymentInfoObject = Object.assign({}, paymentInfo);

    const name = e.target.name;
    const value = e.target.value;
    const maxLength = e.target.maxLength;

    const setStateFunction = (stateValue) => {
      this.setState((prevState) => ({
        paymentInfo: {
          ...prevState.paymentInfo,
          [name]: stateValue,
        }
      }))
    }

    const limitAndFormatNumbersStatement = (name, value, maxLength) =>
      setStateFunction(limitAndFormatNumbers(name, returnOnlyNumbers(value), maxLength))
      currentPaymentInfoObject[name] = limitAndFormatNumbers(name, returnOnlyNumbers(value), maxLength);
    ;

    if (maxLength > 0) {
      if (name === EXPIRATION_DATE) {
        setStateFunction(limitAndFormatExpirationDate(returnOnlyNumbers(value)))
        currentPaymentInfoObject[name] = limitAndFormatExpirationDate(returnOnlyNumbers(value));
      } else if (name === CARD_NUMBER) {
        const cardType = checkMajorCardType(value);
        if (cardType !== undefined) {
          onChangeGetCardType(cardType);
        } else {
          onChangeGetCardType(CARD_DATA);
        }
         limitAndFormatNumbersStatement(name, value, maxLength);
      } else {
        limitAndFormatNumbersStatement(name, value, maxLength);
      }
    } else {
      setStateFunction(value)
      currentPaymentInfoObject[name] = value;
    }

    onChangePayment(currentPaymentInfoObject)
  }

  render () {
    const { shippingInfo, subdivisions, paymentInfo } = this.state;
    const { cartData, cartProgress, cartItemsTotal, cashTotal, cartTotal, taxDue, shippingDue, countries, shippingInfoErrors, onBlurErrorsShipping, onClickGetShippingTotal, paymentInfoErrors, cardData, onBlurErrorsPayment } = this.props;

    const { firstName: firstNameState, lastName: lastNameState, areaCode: areaCodeState, phoneNumber: phoneNumberState, email: emailState, address: addressState, country: countryState, state: stateState, city: cityState, zipCode: zipCodeState, radioValue: radioValueState } = shippingInfo;
    const { firstName: firstNameErrors, lastName: lastNameErrors, areaCode: areaCodeErrors, phoneNumber: phoneNumberErrors, email: emailErrors, address: addressErrors, country: countryErrors, state: stateErrors, city: cityErrors, zipCode: zipCodeErrors, } = shippingInfoErrors;

    const { nameOnCard: nameOnCardState, cardNumber: cardNumberState, expirationDate: expirationDateState, cvv: cvvState } = paymentInfo;
    const { nameOnCard: nameOnCardError, cardNumber: cardNumberError, expirationDate: expirationDateError, cvv: cvvError } = paymentInfoErrors;

    const { cardType, image: cardImage, pattern: cardPattern } = cardData;

    const standardMessage = `Free with any purchase of $${giveDiscountAfterSaidAmount} or more dollars, else $${standardPerItemCost} dollars per item`;
    const expressMessage = `$${standardPerItemCost} per item with purchase over $${giveDiscountAfterSaidAmount} dollars, else $${expressPerItemCost} per item`;

    const inputShippingData = [
      {name: firstName, error: firstNameErrors, value: firstNameState, className: styles.firstName, type: TEXT, placeholder: 'John', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: lastName, error: lastNameErrors, value: lastNameState, className: styles.lastName, type: TEXT, placeholder: 'Doe', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: areaCode, error: areaCodeErrors, value: areaCodeState, className: styles.areaCode, type: TEXT, maxLength: 5, placeholder: '(555)', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: phoneNumber, error: phoneNumberErrors, value: phoneNumberState, className: styles.phoneNumber, type: TEXT, maxLength: 8, placeholder: '555-5555', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: email, error: emailErrors, value: emailState, className: styles.email, type: TEXT, placeholder: 'test@mail.com', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: address, error: addressErrors, value: addressState, className: styles.address, type: TEXT, placeholder: '123 Some Street', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: country, error: countryErrors, value: countryState, className: styles.country, type: SELECT, optionsArray: makeCountriesAndSubdivisionsArray(countries), getValueFunction: this.onChangeShipping, getSubdivisionsFunction: this.onBlurGenerateCountrySubdivisions },
      {name: state, error: stateErrors, value: stateState, className: styles.state, type: SELECT, optionsArray: subdivisions, getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: city, error: cityErrors, value: cityState, className: styles.city, type: TEXT, placeholder: 'San Francisco', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: zipCode, error: zipCodeErrors, value: zipCodeState, className: styles.zipCode, type: TEXT, maxLength: 5, placeholder: 'Zip Code', getValueFunction: this.onChangeShipping, onBlurFunction: onBlurErrorsShipping },
      {name: radioValue, value: standard, message: standardMessage, currentRadioState: radioValueState, className: styles.standard, type: RADIO, placeholder: standard, getValueFunction: this.onChangeShipping, onClickGetShippingTotal: onClickGetShippingTotal },
      {name: radioValue, value: express, message: expressMessage, currentRadioState: radioValueState, className: styles.express, type: RADIO, placeholder: express, getValueFunction: this.onChangeShipping, onClickGetShippingTotal: onClickGetShippingTotal },
    ];

    const inputPaymentData = [
      {name: NAME_ON_CARD, error: nameOnCardError, value: nameOnCardState, className: styles.nameOnCard, type: TEXT, placeholder: 'John Doe', getValueFunction: this.onChangePayment, onBlurFunction: onBlurErrorsPayment },
      {name: CARD_NUMBER, error: cardNumberError, value: cardNumberState, maxLength: cardPattern.length, className: styles.cardNumber, type: TEXT, placeholder: '1234 5678 9012 3456', getValueFunction: this.onChangePayment, onBlurFunction: onBlurErrorsPayment, cardType, cardImage },
      {name: EXPIRATION_DATE, error: expirationDateError, value: expirationDateState, maxLength: 5, className: styles.expirationDate, type: TEXT, placeholder: cardExpirationDate, getValueFunction: this.onChangePayment, onBlurFunction: onBlurErrorsPayment },
      {name: CVV, error: cvvError, value: cvvState, maxLength: 4, className: styles.cvv, type: TEXT, placeholder: '123', getValueFunction: this.onChangePayment, onBlurFunction: onBlurErrorsPayment },
    ]

    const renderCheckoutForms = 
      cartProgress === shipping ?
      <ShippingContainer
        inputData={inputShippingData}
        country={countryState}
      /> :
      cartProgress === payment ?
      <PaymentContainer
        inputData={inputPaymentData}
      /> :
      cartProgress === confirmation ?
      <ConfirmationContainer
        cartTotal={cartTotal}
        shippingInfo={shippingInfo}
        paymentInfo={paymentInfo}
      /> :
      null
    ;

    const makeContainerClassStatements = (classOne, classTwo) => {
      const statement = 
        cartProgress === confirmation ?
        classOne :
        classTwo
      ;
      return statement
    }

    const isConfirmationContainer = 
      makeContainerClassStatements(styles.checkoutContainerConfirmation, styles.checkoutContainer)
    ;
    const isConfirmationFormContainer = 
      makeContainerClassStatements(styles.confirmationFormContainer, styles.formContainer)
    ;
    const isConfirmationProductSummaryContainer = 
      makeContainerClassStatements(styles.confirmationProductSummaryContainer, styles.productSummaryContainer)
    ;
    return (
      <div className={isConfirmationContainer}>
        <div className={isConfirmationFormContainer}>
          {renderCheckoutForms}
        </div>
        <div className={isConfirmationProductSummaryContainer}>
          <ProductSummaryContainer 
            cartProgress={cartProgress}
            cartData={cartData}
            cartItemsTotal={cartItemsTotal}
            cashTotal={cashTotal}
            taxDue={taxDue}
            shippingDue={shippingDue}
            cartTotal={cartTotal}
          />
        </div>
      </div>
    )
  }
}

export default CheckoutContainer;