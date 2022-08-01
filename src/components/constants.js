 export const SHOPPER_SECRET_API_KEY = process.env.REACT_APP_SHOPPER_SECRET_API_KEY;

// I Know The Naming Scheme On Most Of These Are Incorrect But By The Time I Realized They Should Have Been Constants I Was Pretty Far Along With The Project. So They're Lower Case... :)

export const cart = 'cart';
export const shipping = 'shipping';
export const payment = 'payment';
export const confirmation = 'confirmation';

export const home = 'home';
export const products = 'products';
export const loginSignUp = 'login/signUp';
export const logout = 'logout';
export const user = 'user';

export const password = 'password'
export const confirmPassword = 'confirmPassword'

export const firstName = 'firstName';
export const lastName = 'lastName';
export const areaCode = 'areaCode';
export const phoneNumber = 'phoneNumber';
export const email = 'email';
export const address = 'address'
export const country = 'country';
export const state = 'state';
export const city = 'city';
export const zipCode = 'zipCode';
export const radioValue = 'radioValue';
export const standard = 'standard';
export const express = 'express';

export const standardPerItemCost = 2;
export const expressPerItemCost = 4;
export const giveDiscountAfterSaidAmount = 100;

export const PASSWORD_PLACEHOLDER = 'lookAtMe!1mAP***word?'

export const SIGN_UP = 'signUp';
export const LOGIN = 'login';
export const SIGN_UP_LOGIN = 'signUpLogin';

export const NAME_ON_CARD = 'nameOnCard';
export const CARD_NUMBER = 'cardNumber';
export const EXPIRATION_DATE = 'expirationDate';
export const CVV = 'cvv';

export const TEXT = 'text'
export const SELECT = 'select';
export const RADIO = 'radio';
export const PASSWORD = 'password';

export const MASTER_CARD = 'masterCard';
export const VISA = 'visa';
export const DISCOVER = 'discover';
export const AMERICAN_EXPERSS = 'americanExpress';

export const SIGN_UP_INFO = {
  firstName: '',
  lastName: '',
  areaCode: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const LOGIN_INFO = {
  email: '',
  password: '',
}

export const USER_INFO = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
}

export const SHIPPING_INFO = {
  firstName: '',
  lastName: '',
  areaCode: '',
  phoneNumber: '',
  email: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  radioValue: 'standard',
}

export const PAYMENT_INFO = {
  nameOnCard: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
}

export const OTHERCARDS = [
  /[1-9]/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const AMERICANEXPRESS = [
  /[1-9]/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const CARD_DATA = {
  cardType: '',
  firstNumber: 0,
  pattern: OTHERCARDS,
  image: '',
}