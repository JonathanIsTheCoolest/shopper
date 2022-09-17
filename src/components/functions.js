import { areaCode, phoneNumber, OTHERCARDS, AMERICANEXPRESS, CARD_NUMBER } from "./constants";

export const makeButtons = (value, onClick) => {
  const replacedValue = value[0].toLowerCase().concat(value.replaceAll(' ', '').slice(1, value.length));

  const button = 
    <label htmlFor={replacedValue}>
      <input name={replacedValue} id={replacedValue} value={value} type="button" onClick={onClick}/>
    </label>
  ;
  return button
}

export const makeNameIntoTitle = (name) => {
  const titleName = name[0].toUpperCase().concat(name.slice(1, name.length)).replace(/([A-Z])/g, ' $1').trim()
  return titleName;
}

export const makeNumberErrorResponse = (name, maxLength) => {
  return `${name} must be ${maxLength} characters long.`
}

// Has Error Function

export const hasError = (infoErrors) => {
  const errorArray = [];
  for (const item in infoErrors) {
    if ( infoErrors[item] !== undefined ) {
      errorArray.push(infoErrors[item])
      break;
    }
  }
  if (errorArray.length) {
    return true;
  } else {
    return false;
  }
}

// Card Expiration Date Function

export const expirationYear = `${new Date().getFullYear()}`.slice(2);
export const expirationMonth = new Date().getMonth() + 1;
const expiration = `${expirationMonth}/${expirationYear}`;

const expirationFormatFunction = (value) => {
  const regEx = /^[1-9]\//;
  if (value.match(regEx)) {
    return `0${value}`
  } else {
    return value
  }
} 

export const cardExpirationDate = expirationFormatFunction(expiration);

// Format Functions
const formatAreaCode = (value) => 
  `(${value})`
;

const formatPhoneNumber = (value) => {
  if (value.length > 3) {
    return `${value.slice(0,3)}-${value.slice(3, value.length)}`
  } else {
    return value
  }
}

const formatAmexCards = (value) => {
  if (value.length) {
    let amex = [];
    const captureOne = value.slice(0, 4);
    const captureTwo = value.slice(4, 10);
    const captureThree = value.slice(10, value.length);
    amex.push(captureOne);
    if (value.length > 4) {
      amex.push(captureTwo);
    }
    if (value.length > 10) {
      amex.push(captureThree);
    }
    return amex.join(' ');
  }
}

const formatOtherCards = (value) => {
  let returnValue;
  const cardSectionArray = [];
  const regEx = /[\d]{4}|[\d]+/g;
  if (value.match(regEx)) {
    cardSectionArray.push(value.match(regEx));
  }

  const [array] = cardSectionArray;
  returnValue = array.join(' ');

  if (array.length) {
    return returnValue;
  } else {
    return value;
  }
}

const formatCardNumber = (value, maxLength) => {
  if (maxLength === AMERICANEXPRESS.length) {
    return formatAmexCards(value);
  } else if (maxLength === OTHERCARDS.length) {
    return formatOtherCards(value);
  }
}

const formatExpirationDate = (value) => {
  if (value.length > 2) {
    return `${value.slice(0,2)}/${value.slice(2, value.length)}`
  } else {
    return value
  }
}

export const formatXsAndLastFourCardNumbers = (value) => {
  const regEx = /\d/g;
  const cardXsAndSpaces = value.replace(regEx, 'X').slice(0, value.length - 4);
  const lastFour = value.slice(-4);
  return `${cardXsAndSpaces}${lastFour}`;
}

// Number Functions

export const returnOnlyNumbers = (value) => {
  const regExNumbers = /\d/;
  const numbersArray = [];
  for (let x = 0; x < value.length; x++) {
    if (value[x].match(regExNumbers)) {
      numbersArray.push(value[x]);
    }
  }
  return numbersArray.join('')
}

export const returnEverythingButNumbers = (value) => {
  const regExNumbers = /\d/;
  const numbersArray = [];
  for (let x = 0; x < value.length; x++) {
    if (!value[x].match(regExNumbers)) {
      numbersArray.push(value[x]);
    }
  }
  return numbersArray.join('')
}

export const limitAndFormatNumbers = (name, value, maxLength) => {
  let returnValue;
  const numbersArray = [];
  const regExFirst = /[1-9]/;
  const regExRest = /\d/;

  for (let x = 0; x < value.length; x++) {
    if (value[x] === value[0]) {
      if (value[0].match(regExFirst)) {
        numbersArray.push(value[0]);
      }
    } else if (value[x].match(regExRest)) {
      numbersArray.push(value[x]);
    }
  }
  returnValue = numbersArray.join('')
  if (returnValue.length) {
    if (name === areaCode) {
      return formatAreaCode(returnValue)
    } else if (name === phoneNumber) {
      return formatPhoneNumber(returnValue);
    } else if (name === CARD_NUMBER) {
      return formatCardNumber(returnValue, maxLength);
    } else {
      return returnValue;
    }
  } else {
    return returnValue;
  }
}

export const limitAndFormatExpirationDate = (value) => {
  let returnValue;
  const numbersArray = [];
  const regExFirst = /[01]/;
  const regExNotZero = /[1-9]/
  const expYearIndexOneRangeOne = expirationYear[0];
  const expYearIndexOneRangeTwo = (expirationYear[0] * 1) + 1;
  const expYearIndexTwo = expirationYear[1];

  for (const index in value) {
    if (index === '0') {
      if (value[index].match(regExFirst)) {
        numbersArray.push(value[index])
      }
    } else if (index === '1') {
      if (value[0] === '0') {
        if (value[index].match(regExNotZero)) {
          numbersArray.push(value[index])
        }
      } else {
        if (value[index] <= 2) {
          numbersArray.push(value[index])
        }
      }
    } else if (index === '2') {
      if (value[index] === expYearIndexOneRangeOne || ( value[index] * 1) === expYearIndexOneRangeTwo) {
        numbersArray.push(value[index])
      }
    } else if (index === '3') {
      if (value[2] === expYearIndexOneRangeOne) {
        if (value[index] >= expYearIndexTwo ) {
          numbersArray.push(value[index])
        }
      } else {
        if (value[index] <= expYearIndexTwo ) {
          numbersArray.push(value[index])
        }
      }
    }
  }

  returnValue = numbersArray.join('')

  if (returnValue && returnValue.length) {
    return formatExpirationDate(returnValue);
  } else {
    return returnValue;
  }
}