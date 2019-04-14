const emailValidator = require('email-validator');

function checkIsSignUpDataValid(email, name, password) {
  if (!emailValidator.validate(email)) {
    return {
      isValid: false,
      message: 'Email пользователя невалидный!'
    };
  }

  if (name.length < 2 || name.length > 64) {
    return {
      isValid: false,
      message: 'Имя пользователя невалидно!'
    };
  }

  if (password.length < 6 || password.length > 64) {
    return {
      isValid: false,
      message: 'Пароль пользователя невалидный!'
    };
  }

  return {
    isValid: true
  };
}

function checkIsSignInDataValid(email, password) {
  if (!emailValidator.validate(email)) {
    return {
      isValid: false,
      message: 'Email пользователя невалидный!'
    };
  }

  if (password.length < 6 || password.length > 64) {
    return {
      isValid: false,
      message: 'Пароль пользователя невалидный!'
    };
  }

  return {
    isValid: true
  };
}

function checkIsTokenValid(token) {
  if (token.length !== 128) {
    return false;
  }

  return true;
}

exports.checkIsSignUpDataValid = checkIsSignUpDataValid;
exports.checkIsSignInDataValid = checkIsSignInDataValid;
exports.checkIsTokenValid = checkIsTokenValid;