const signUpHandler = require('./SignUp');
const signInHandler = require('./SignIn');
const getUserDataHandler = require('./GetUserData');

const getCities = require('./GetCities');
const getCinemas = require('./GetCinemas');
const getFormats = require('./GetFormats');
const getFilms = require('./GetFilms');
const getGenres = require('./GetGenres');
const getFilm = require('./GetFilm');
const getSessions = require('./GetSessions');

exports.signUpHandler = signUpHandler;
exports.signInHandler = signInHandler;
exports.getUserDataHandler = getUserDataHandler;

exports.getCities = getCities;
exports.getCinemas = getCinemas;
exports.getFormats = getFormats;
exports.getFilms = getFilms;
exports.getGenres = getGenres;
exports.getFilm = getFilm;
exports.getSessions = getSessions;