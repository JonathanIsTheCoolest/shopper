import React from 'react';
import LoginSignUpRadioButtons from '../LoginSignUpRadioButtons/LoginSignUpRadioButtons';
import SignUpContainer from '../signUp/SignUpContainer/SignUpContainer';
import LoginContainer from '../login/LoginContainer/LoginContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../LoginSignUpContainer/LoginSignUpContainer.module.css';

import { TEXT, RADIO, PASSWORD, firstName, lastName, areaCode, phoneNumber, email, password, PASSWORD_PLACEHOLDER, confirmPassword, user, SIGN_UP, LOGIN, SIGN_UP_LOGIN, LOGIN_INFO, SIGN_UP_INFO, } from '../../constants';
import { makeButtons, makeNameIntoTitle, limitAndFormatNumbers, returnOnlyNumbers, hasError } from '../../functions';

import { numberValidation, nameAndTitleValidation, emailValidation } from '../../validations/shippingValidations';
import { passwordValidation, confirmPasswordValidation } from '../../validations/signUpValidations';

import CreateCustomer from '../../apiCalls/createCustomer';
import GetCustomerList from '../../apiCalls/getCustomerList';

const createCustomer = new CreateCustomer();
const getCustomerList = new GetCustomerList();

const accountAlreadyExistsMessage = 'An account with this email address already exists';

const INIT_STATE = {
  loginInfo: LOGIN_INFO,
  loginInfoErrors: LOGIN_INFO,
  signUpInfo: SIGN_UP_INFO,
  signUpInfoErrors: SIGN_UP_INFO,
  radioValue: LOGIN,
  passwordTypeState: PASSWORD,
  gettingCustomerList: false,
  error: false,
  onSubmitErrorMessage: '',
}

class LoginSignUpContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = INIT_STATE;
  }

  getCustomerList = () => {
    this.setState({ gettingCustomerList: true })
    getCustomerList.getCustomerList()
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ gettingCustomerList: false, error: false })
        console.log(res.response);
        console.log(res.emailArray);
      } else {
        this.setState({ gettingCustomerList: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ gettingCustomerList: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  emailAndPasswordMatch = () => {
    const {email, password} = this.state.loginInfo
     
    this.setState({ gettingCustomerList: true })
    getCustomerList.getCustomerList(email, password)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ gettingCustomerList: false, error: false })
        console.log(res.response);
        console.log(res.user);
        if (res.user) {
          this.setState({ onSubmitErrorMessage: `Congratulations ${res.user.firstName} you have been successfully loged in!`, loginInfo: LOGIN_INFO, })
          this.props.onClickGetUserInfo(res.user);
          this.props.onClickRender(user)
        } else {
          this.setState({ onSubmitErrorMessage: `Shoot it looks like the provided information was incorrect. Please try again` })
        }
      } else {
        this.setState({ gettingCustomerList: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ gettingCustomerList: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  createCustomer = () => {
    const { email, areaCode, phoneNumber, firstName, lastName, password } = this.state.signUpInfo;

    const fullPhoneNumber = (`+1 ${returnOnlyNumbers(areaCode)} ${returnOnlyNumbers(phoneNumber)}`)

    this.setState({ creatingCustomer: true })
    createCustomer.createCustomer(email, fullPhoneNumber, firstName, lastName, password)
    .then((res) => {
      if (res && res.response.ok) {
        this.setState({ onSubmitErrorMessage: '', signUpInfo: SIGN_UP_INFO, radioValue: LOGIN, creatingCustomer: false, error: false })
        console.log(res.response);
        console.log(res.json);
      } else {
        this.setState({ onSubmitErrorMessage: accountAlreadyExistsMessage, creatingCustomer: false, error: true })
        console.log('Something went wrong');
        console.log(res.response);
      }
    }, (error) => {
      this.setState({ onSubmitErrorMessage: accountAlreadyExistsMessage, creatingCustomer: false, error: true })
      console.error('There was an error: ', error);
    })
  }

  onChangeSignUp = (e) => { const name = e.target.name;
    const value = e.target.value;
    const maxLength = e.target.maxLength;

    const setStateFunction = (stateValue) => {
      this.setState((prevState) => ({
        signUpInfo: {
          ...prevState.signUpInfo,
          [name]: stateValue,
        }
      }))
    }

    if (maxLength > 0) {
      setStateFunction(limitAndFormatNumbers(name, returnOnlyNumbers(value), maxLength))
    } else {
      setStateFunction(value)
    }
  }

  onChangeLogin = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const setStateFunction = (stateValue) => {
      this.setState((prevState) => ({
        loginInfo: {
          ...prevState.loginInfo,
          [name]: stateValue,
        }
      }))
    }
    setStateFunction(value);
  }

  onBlurLogin = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const setStateFunction = (stateValue) => {
      this.setState((prevState) => ({
        loginInfoErrors: {
          ...prevState.loginInfoErrors,
          [name]: stateValue,
        }
      }))
    }

    if (name === email) {
      setStateFunction(emailValidation(value));
    } else if (name === password) {
      setStateFunction(passwordValidation(value))
    }
  }

  onBlurSignUp = (e) => {
    const {password: currentPassword, confirmPassword: currentConfirmPassword} = this.state.signUpInfo;

    const name = e.target.name;
    const value = e.target.value;
    const maxLength = e.target.maxLength;

    const setStateFunction = (stateValue) => {
      this.setState((prevState) => ({
        signUpInfoErrors: {
          ...prevState.signUpInfoErrors,
          [name]: stateValue,
        }
      }))
    }

    if (name === firstName || name === lastName) {
      setStateFunction(nameAndTitleValidation(name, value));
    } else if (name === email) {
      setStateFunction(emailValidation(value));
    } else if (name === password) {
      setStateFunction(passwordValidation(value));
      if (currentConfirmPassword.length) {
        this.setState((prevState) => ({
          signUpInfoErrors: {
            ...prevState.signUpInfoErrors,
            confirmPassword: confirmPasswordValidation(currentConfirmPassword, currentPassword),
          }
        }))
      } else if (!currentConfirmPassword.length) {
        this.setState((prevState) => ({
          signUpInfoErrors: {
            ...prevState.signUpInfoErrors,
            confirmPassword: '',
          }
        }))
      }
    } else if (name === confirmPassword) {
      setStateFunction(confirmPasswordValidation(value, currentPassword))
    } else if (maxLength > 0) {
      setStateFunction(numberValidation(name, value, maxLength))
    }
  }

  onClickRadio = (e) => {
    const value = e.target.value;

    this.setState({ radioValue: value, passwordTypeState: PASSWORD, signUpInfoErrors: SIGN_UP_INFO, signUpInfo: SIGN_UP_INFO, loginInfoErrors: LOGIN_INFO, loginInfo: LOGIN_INFO, onSubmitErrorMessage: '', })
  }

  onClickEye = () => {
    const { passwordTypeState } = this.state;

    if (passwordTypeState === PASSWORD) {
      this.setState({ passwordTypeState: TEXT })
    } else if (passwordTypeState === TEXT) {
      this.setState({ passwordTypeState: PASSWORD })
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
  }

  onClickSignUp = () => {
    const { signUpInfo, signUpInfoErrors } = this.state;
    const signUpInfoErrorsName = 'signUpInfoErrors';

    this.onClickRequired(signUpInfo, signUpInfoErrorsName, signUpInfoErrors, undefined )
    if (!hasError(signUpInfoErrors)) {
      this.createCustomer();
    }
  }

  onClickLogin = () => {
    const { loginInfo, loginInfoErrors } = this.state;
    const loginInfoErrorsName = 'loginInfoErrors';

    this.onClickRequired(loginInfo, loginInfoErrorsName, loginInfoErrors, undefined )
    if (!hasError(loginInfoErrors)) {
      this.emailAndPasswordMatch()
    }
  }

  onLoad = (e) => {
    e.preventDefault()
  }

  render () {
    const { radioValue, passwordTypeState, signUpInfo, signUpInfoErrors, loginInfo, loginInfoErrors, onSubmitErrorMessage } = this.state;

    const { firstName: firstNameValue, lastName: lastNameValue, email: signUpEmailValue, areaCode: areaCodeValue, phoneNumber: phoneNumberValue, password: signUpPasswordValue, confirmPassword: confirmPasswordValue } = signUpInfo;
    const { firstName: firstNameError, lastName: lastNameError, email: signUpEmailError, areaCode: areaCodeError, phoneNumber: phoneNumberError, password: signUpPasswordError, confirmPassword: confirmPasswordError } = signUpInfoErrors;

    const { email: loginEmailValue, password: loginPasswordValue } = loginInfo;
    const { email: loginEmailError, password: loginPasswordError } = loginInfoErrors;


    const eyeNoSlash = 
    <FontAwesomeIcon icon={faEye} className={styles.eye} onClick={this.onClickEye}/>
    ;
    const eyeSlash = 
    <FontAwesomeIcon icon={faEyeSlash} className={styles.eye} onClick={this.onClickEye}/>
    ;

    const signUpButton = makeButtons(makeNameIntoTitle(SIGN_UP), this.onClickSignUp);
    const loginButton = makeButtons(makeNameIntoTitle(LOGIN), this.onClickLogin);

    const signUpLoginButtonStatement = 
      radioValue === SIGN_UP ?
      signUpButton :
      loginButton
    ;

    const eyeStatement = 
      passwordTypeState === PASSWORD ?
      eyeNoSlash :
      eyeSlash
    ;

    const radioInputs = [
      { name: SIGN_UP, radioGroup: SIGN_UP_LOGIN, className: styles.signUp, type: RADIO, getValueFunction: this.onClickRadio },
      { name: LOGIN, radioGroup: SIGN_UP_LOGIN, className: styles.login, type: RADIO, getValueFunction: this.onClickRadio },
    ];

    const inputSignUpData = [
      { name: firstName, error: firstNameError, value: firstNameValue, className: styles.firstName, type: TEXT, placeholder: 'John', getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp },
      { name: lastName, error: lastNameError, value: lastNameValue, className: styles.lastName, type: TEXT, placeholder: 'Doe', getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp },
      { name: email, error: signUpEmailError, value: signUpEmailValue, className: styles.email, type: TEXT, placeholder: 'test@mail.com', getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp },
      { name: areaCode, error: areaCodeError, value: areaCodeValue, className: styles.areaCode, type: TEXT, placeholder: '(555)', getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp, maxLength: 5 },
      { name: phoneNumber, error: phoneNumberError, value: phoneNumberValue, className: styles.phoneNumber, type: TEXT, placeholder: '555-5555', getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp, maxLength: 8 },
      { name: password, error: signUpPasswordError, value: signUpPasswordValue, className: styles.passwordSignUp, type: passwordTypeState, placeholder: PASSWORD_PLACEHOLDER, getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp, eye: eyeStatement },
      { name: confirmPassword, error: confirmPasswordError, value: confirmPasswordValue, className: styles.confirmPassword, type: passwordTypeState, placeholder: PASSWORD_PLACEHOLDER, getValueFunction: this.onChangeSignUp, onBlurFunction: this.onBlurSignUp, eye: eyeStatement },
    ];

    const inputLoginData = [
      { name: email, error: loginEmailError, value: loginEmailValue, className: styles.email, type: TEXT, placeholder: email, getValueFunction: this.onChangeLogin, onBlurFunction: this.onBlurLogin },
      { name: password, error: loginPasswordError, value: loginPasswordValue, className: styles.passwordLogin, type: passwordTypeState, placeholder: PASSWORD_PLACEHOLDER, getValueFunction: this.onChangeLogin, onBlurFunction: this.onBlurLogin, eye: eyeStatement },
    ];
    return (
      <div>
        <div className={styles.loginSignUpRadioContainer}>
        {radioInputs.map((item, index) => (
              <LoginSignUpRadioButtons
                key={`${item.name}${index}`}
                item={item}
                radioValue={radioValue}
              />
            ))}
        </div>
        {onSubmitErrorMessage}
        <div className={styles.loginSignUpContainer}>
          <form onLoad={this.onLoad}>
            {
              radioValue === SIGN_UP ?
              <SignUpContainer
                key={`${SIGN_UP}0`}
                inputData={inputSignUpData}
              /> :
              radioValue === LOGIN ?
              <LoginContainer
                key={`${LOGIN}0`}
                inputData={inputLoginData}
              /> :
              null
            }
          </form>
        </div>
        {signUpLoginButtonStatement}
        {/* Uncomment Below To Log A List Of All User Emails */}
        {/* {makeButtons(makeNameIntoTitle('logUserList'), this.getCustomerList)} */}
      </div>
    )
  }
}

export default LoginSignUpContainer; 