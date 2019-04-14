const signUpHandler = require('./SignUp');
const signInHandler = require('./SignIn');
const getUserDataHandler = require('./GetUserData');

const getCities = require('./GetCities');
const getCinemas = require('./GetCinemas');
const getFormats = require('./GetFormats');

exports.signUpHandler = signUpHandler;
exports.signInHandler = signInHandler;
exports.getUserDataHandler = getUserDataHandler;

exports.getCities = getCities;
exports.getCinemas = getCinemas;
exports.getFormats = getFormats;
