import amex from '../assets/images/majorCardTypes/amex.png'
import discover from '../assets/images/majorCardTypes/discover.png';
import masterCard from '../assets/images/majorCardTypes/masterCard.png';
import visa from '../assets/images/majorCardTypes/visa.png';

import { OTHERCARDS, AMERICANEXPRESS } from '../constants';
import { makeNameIntoTitle, expirationMonth, expirationYear, returnOnlyNumbers } from '../functions';

const numberArray = [
  {cardType: 'AMERICAN EXPRESS', firstNumber: 3, pattern: AMERICANEXPRESS, image: amex}, 
  {cardType: 'VISA', firstNumber: 4, pattern: OTHERCARDS, image: visa}, 
  {cardType: 'MASTERCARD', firstNumber: 5, pattern: OTHERCARDS, image: masterCard}, 
  {cardType: 'MASTERCARD', firstNumber: 2, pattern: OTHERCARDS, image: masterCard}, 
  {cardType: 'DISCOVER', firstNumber: 6, pattern: OTHERCARDS, image: discover},
];

const regExpArray = [
  {expression: /^4[0-9]{12}(?:[0-9]{3})?$/},
  {expression: /^3[47][0-9]{13}$/},
  {expression: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/},
  {expression: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/},
]

export const checkMajorCardType = (value) => {
  if (value) {
    for (const item of numberArray) {
      const {firstNumber} = item;
      if ((value[0] * 1) === firstNumber) {
        return item;
      }
    }
  }
}

const returnTrueFalseCardType = (value) => {
  if (value.length) {
    for (const regExp of regExpArray) {
      if (value.match(regExp.expression)) {
        return true;
      }
    }
    return false;
  }
}

export const validateMajorCardType = (value) => {
  const numberValue = returnOnlyNumbers(value);

  if (!numberValue.length) {
    return ''
  } else if (!returnTrueFalseCardType(numberValue)) {
    return 'The card that you have entered is not valid'
  }
}

export const validateCVV = (value, maxLength) => {
  if (!value.length) {
    return ''
  } else if (value.length < maxLength - 1) {
    return 'CVV must be at least 3 numbers in length'
  }
}

export const validateExpirationDate = (name, value, maxLength) => {
  const numberValue = returnOnlyNumbers(value);
  const monthValue = numberValue.slice(0, 2) * 1;
  const yearValue = numberValue.slice(-2) * 1;

  if (!value.length) {
    return ''
  } else if (value.length) {
    if (value.length < maxLength) {
      return `${makeNameIntoTitle(name)} must be ${maxLength - 1} numbers in length`
    } else if (yearValue === (expirationYear * 1) && monthValue < expirationMonth) {
      return 'The card that you have entered is expired'
    }
  }
}