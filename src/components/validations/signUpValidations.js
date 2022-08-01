export const passwordValidation = (password) => {
  const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()_+])[A-Za-z\d!@#$%^&()_+]{8,20}$/ ;
  if (!password.length) {
    return (
      ''
    )
  } else if (!password.match(regEx)) {
    return (
      'This is not a valid password'
    )
  }
}

export const confirmPasswordValidation = (password, confirmPassword) => {
  const passOne = password;
  const passTwo = confirmPassword;
  if (!passTwo.length) {
    return (
      ''
    )
  } else if (passOne !== passTwo) {
    return (
      'Passwords do not match'
    )
  }
}