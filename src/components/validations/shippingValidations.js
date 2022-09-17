import { makeNameIntoTitle, makeNumberErrorResponse, returnEverythingButNumbers } from "../functions";

export const numberValidation = (name, value, maxLength) => {
  const refactoredMaxLength = 
    maxLength > returnEverythingButNumbers(value).length ?
    (maxLength * 1) - (returnEverythingButNumbers(value).length * 1) :
    (returnEverythingButNumbers(value).length * 1) - (maxLength * 1)
  ;

  if (!value.length) {
    return (
      ''
    )
  } else if (value.length !== maxLength ) {
    if (name === 'phoneNumber') {
      return makeNumberErrorResponse(makeNameIntoTitle(name), (maxLength * 1) - 1);
    } else {
      return makeNumberErrorResponse(makeNameIntoTitle(name), refactoredMaxLength)
    }
  }
}

export const nameAndTitleValidation = (name, value) => {
  const errorName = makeNameIntoTitle(name);

  const regEx = /^[a-zA-Z\s-.]{2,}$/ ;
  if (!value.length) {
    return (
      ''
    )
  } else if (!value.match(regEx)) {
    return (
      `${errorName} cannot contain numbers or special characters besides - or . and must be at least two characters in length`
    )
  }
}

export const addressValidation = (value) => {
  const regEx = /^[a-zA-Z\d\s-,.'/]{3,}$/ ;
  if (!value.length) {
    return (
      ''
    )
  } else if (!value.match(regEx)) {
    return (
      `Address cannot contain special characters besides - / , . '  and must be at least three characters in length`
    )
  }
}

export const emailValidation = (email) => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
  if (!email.length) {
    return (
      ''
    )
  } else if (!email.match(regEx)) {
    return (
      'This is not a valid email address'
    )
  } 
}